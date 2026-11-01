// ESC-C-APE server. Answers, passcodes and the timer live here, never in the browser.
const express=require('express'),crypto=require('crypto'),path=require('path');
const store=require('./store'),CFG=require('./questions.json');
const DUR=+process.env.DURATION_MS||600000,WRONG_MS=60000,WRONG_PTS=5,HINT_PTS=3,VAULT_PTS=20,MAX_PAUSE=8000;
const ADMIN=process.env.ADMIN_PASS||'organiser2026';
const entry=n=>String(process.env['TEAM'+n+'_PASS']||process.env.ENTRY_PASS||'KEY8610').toUpperCase();
const norm=s=>String(s).toLowerCase().replace(/\s+/g,'').replace(/;$/,'');
const now=()=>Date.now(),tok=()=>crypto.randomBytes(16).toString('hex');
const admList=()=>store.get().admins||(store.get().admins=[]); // organiser sessions are saved, so a server restart does not log the organiser out
const err=(res,c,m)=>res.status(c).json({error:m}),T=()=>store.get().teams;
const app=express();app.use(express.json({limit:'10kb'}));

/* ---- timer: all values are timestamps, so background tabs and refreshes cannot drift ---- */
function remaining(t){if(t.status==='ready')return DUR;if(t.status==='playing')return Math.max(0,t.endAt-(t.pausedAt||now()));return t.left||0}
function finish(t,st){t.left=remaining(t);t.status=st;t.endedAt=now();t.pausedAt=0}
function tick(t){ // expire the clock, and never let a key-reveal pause freeze it for more than MAX_PAUSE
  if(t.status!=='playing')return;
  if(t.pausedAt&&now()-t.pausedAt>MAX_PAUSE){t.endAt+=MAX_PAUSE;t.pausedAt=0}
  if(!t.pausedAt&&t.endAt<=now()){t.left=0;t.status='expired';t.endedAt=t.endAt}
}
function penalise(t){t.endAt-=WRONG_MS;if(t.endAt<=now()){t.left=0;t.status='expired';t.endedAt=now()}}
const total=a=>a.reduce((x,y)=>x+y,0);
const score=t=>Math.max(0,CFG[t.n-1].q.reduce((s,q,i)=>s+(t.solved[i]?q.p:0),0)-WRONG_PTS*total(t.wr)-HINT_PTS*total(t.hint)+(t.status==='escaped'?VAULT_PTS:0));
function view(t){ // what the browser may see: no answers, explanations only after a question is done or the run ended
  const c=CFG[t.n-1],over=!['ready','playing'].includes(t.status);
  return{n:t.n,name:t.name,status:t.status,left:remaining(t),paused:!!t.pausedAt,solved:t.solved,wr:t.wr,vw:t.vw,score:score(t),digits:t.digits,
    hints:c.q.map((q,i)=>t.hint[i]?q.h:null),ex:c.q.map((q,i)=>t.solved[i]||over?q.e:null),
    q:c.q.map(x=>({t:x.t,n:x.n,c:x.c,o:x.o,q:x.q})),code:t.status==='escaped'?c.d.join(''):null};
}
function correct(q,a){
  if(q.t==='mcq')return Number.isInteger(a)&&a===q.a;
  if(a===null||a===undefined||String(a).trim()==='')return false;
  if(q.t==='err')return norm(a)===String(total(q.b)); // debugging: sum of the faulty line numbers
  return q.a.some(x=>norm(x)===norm(a));
}
const auth=(req,res,next)=>{const t=Object.values(T()).find(x=>x.token&&x.token===req.get('x-token'));
  if(!t)return err(res,401,'Session not found. Return to the home screen.');tick(t);req.t=t;next()};
const adm=(req,res,next)=>admList().includes(req.get('x-admin'))?next():err(res,401,'Organiser login required.');

app.post('/api/start',(req,res)=>{
  const n=+req.body.team,name=String(req.body.name||'').trim().slice(0,24),pass=String(req.body.pass||'').trim().toUpperCase();
  if(!Number.isInteger(n)||n<1||n>5)return err(res,400,'Choose a team from 1 to 5.');
  if(!name)return err(res,400,'Enter a team name.');
  if(pass!==entry(n))return err(res,403,'Wrong passcode for this team.');
  let t=T()[n];
  if(t){tick(t);if(['ready','playing'].includes(t.status)){
    if(t.name.trim().toLowerCase()!==name.toLowerCase())return err(res,409,'Team '+n+' is already in use by "'+t.name+'". Pick your own team number, or ask the organiser to reset it.');
    t.token=tok();store.save();return res.json({token:t.token})}
    return err(res,409,'This team has already finished. Ask the organiser to reset it.')}
  t=T()[n]={n,name,token:tok(),status:'ready',solved:[0,0,0],wr:[0,0,0],hint:[0,0,0],vw:0,digits:[null,null,null],pausedAt:0,endAt:0,left:DUR};
  store.save();res.json({token:t.token});
});
app.get('/api/state',auth,(req,res)=>{store.save();res.json(view(req.t))});
app.post('/api/begin',auth,(req,res)=>{const t=req.t;if(t.status==='ready'){t.status='playing';t.startedAt=now();t.endAt=now()+DUR;store.save()}res.json(view(t))});
app.post('/api/hint',auth,(req,res)=>{const t=req.t,i=+req.body.q;
  if(t.status!=='playing'||![0,1,2].includes(i)||t.solved[i])return err(res,409,'Hint not available.');
  t.hint[i]=1;store.save();res.json(view(t))});
app.post('/api/answer',auth,(req,res)=>{ // one decision per request; solved questions can never be scored twice
  const t=req.t,i=+req.body.q;
  if(t.status!=='playing'||t.pausedAt||![0,1,2].includes(i)||t.solved[i])return err(res,409,'Answer not accepted right now.');
  const c=CFG[t.n-1];
  if(correct(c.q[i],req.body.answer)){t.solved[i]=1;t.digits[i]=c.d[i];t.pausedAt=now();store.save();return res.json({ok:true,digit:c.d[i],idx:i,state:view(t)})}
  t.wr[i]++;penalise(t);if(t.status==='playing'&&t.wr[i]>=2)finish(t,'failed');
  store.save();res.json({ok:false,state:view(t)});
});
app.post('/api/continue',auth,(req,res)=>{const t=req.t;
  if(t.pausedAt){t.endAt+=Math.min(now()-t.pausedAt,MAX_PAUSE);t.pausedAt=0;store.save()}res.json(view(t))});
app.post('/api/vault',auth,(req,res)=>{
  const t=req.t,c=CFG[t.n-1];
  if(t.status!=='playing'||t.pausedAt||!t.solved.every(Boolean))return err(res,409,'Solve all three terminals first.');
  if(String(req.body.code||'').trim()===c.d.join('')){finish(t,'escaped');store.save();return res.json({ok:true,state:view(t)})}
  t.vw++;penalise(t);if(t.status==='playing'&&t.vw>=2)finish(t,'failed');
  store.save();res.json({ok:false,state:view(t)});
});

const rows=()=>[1,2,3,4,5].map(n=>{const t=T()[n];if(!t)return{n,name:'',status:'none',done:0,score:0,left:0,wr:0,digits:'---',cur:'-'};
  tick(t);return{n,name:t.name,status:t.status,done:total(t.solved),score:score(t),left:remaining(t),wr:total(t.wr)+t.vw,
    digits:t.digits.map(d=>d===null?'-':d).join(''),cur:t.solved.every(Boolean)?'Vault':t.solved.indexOf(0)+1}});
const rank=r=>[...r].sort((a,b)=>(b.status==='escaped')-(a.status==='escaped')||b.score-a.score||b.left-a.left||a.n-b.n);
app.get('/api/scoreboard',(q,res)=>res.json(rank(rows()).map(({digits,cur,...r})=>r)));
app.post('/api/admin/login',(req,res)=>{if(String(req.body.pass||'')!==ADMIN)return err(res,403,'Wrong organiser passcode.');const k=tok();admList().push(k);if(admList().length>20)admList().shift();store.save();res.json({token:k})});
app.get('/api/admin/teams',adm,(q,res)=>res.json(rows()));
app.post('/api/admin/reset/:n',adm,(req,res)=>{delete T()[+req.params.n];store.save();res.json({ok:true})});
app.post('/api/admin/reset-all',adm,(req,res)=>{if(req.body.confirm!=='RESET')return err(res,400,'Confirmation missing.');store.set({teams:{},admins:admList()});store.save(); // one shared state: the scoreboard and dashboard both read it, so both reset together
  res.json({ok:true})});
app.use('/api',(q,res)=>err(res,404,'Not found.'));
const D=path.join(__dirname,'../client/dist');
app.use(express.static(D));app.use((q,res)=>res.sendFile(path.join(D,'index.html')));
const PORT=process.env.PORT||5000;
store.init().then(()=>app.listen(PORT,()=>console.log('ESC-C-APE running on http://localhost:'+PORT))).catch(e=>{console.error(e);process.exit(1)});
