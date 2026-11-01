import React,{useState,useEffect,useRef,useCallback} from 'react'
import Scene,{X} from './Scene'
import {api} from './api'
import {S,setSound} from './sfx'
import './style.css'

const fmt=ms=>{const s=Math.ceil(Math.max(0,ms)/1000);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
const LABEL={none:'Not Started',ready:'Ready',playing:'In Progress',escaped:'Escaped',expired:'Time Expired',failed:'Failed'}
const hasGL=()=>{try{const c=document.createElement('canvas');return !!(c.getContext('webgl2')||c.getContext('webgl'))}catch(e){return false}}
class Boundary extends React.Component{ // if the 3D scene crashes, the game keeps working on a plain backdrop
  state={bad:false};static getDerivedStateFromError(){return{bad:true}}
  render(){return this.state.bad?<div className="fb"/>:this.props.children}
}
const RULES=['Time: 10 minutes for all three terminals and the vault. The clock starts after the 3-2-1 countdown.',
 'Click a glowing terminal in the room, or use the Terminal buttons. Any order is fine.',
 'Two attempts per question. A wrong attempt costs 1 minute and 5 points. Two wrong attempts on one question end the mission.',
 'One hint per question. It costs 3 points and no time.',
 'Debug questions: BOTH syntax errors and logical errors count. Find the faulty line numbers and enter their SUM.',
 'Each correct answer gives one key digit. After all three, enter the digits in order at the vault. Two attempts, a wrong code costs 1 minute.',
 'The clock pauses while a key digit is shown. No phones, no Googling. Discuss the code as a team.']
const Rules=({onOk,label})=><div className="ov" style={{zIndex:6}}><div className="pn"><h2>Mission rules</h2>
  <ul style={{paddingLeft:18,margin:'6px 0'}}>{RULES.map((r,i)=><li key={i} style={{margin:'6px 0',fontSize:16}}>{r}</li>)}</ul><button onClick={onOk}>{label}</button></div></div>

const BugIcon=()=><svg className="bug" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="#ffb347" strokeWidth="4" strokeLinecap="round"><path d="M35 40L15 28M35 55L10 55M36 70L16 84M65 40L85 28M65 55L90 55M64 70L84 84M42 22L36 8M58 22L64 8"/></g>
  <ellipse cx="50" cy="58" rx="22" ry="27" fill="#2a2060" stroke="#ffb347" strokeWidth="4"/><circle cx="50" cy="28" r="13" fill="#2a2060" stroke="#ffb347" strokeWidth="4"/>
  <circle className="eye" cx="45" cy="27" r="3.2" fill="#ff4d6d"/><circle className="eye" cx="55" cy="27" r="3.2" fill="#ff4d6d"/><path d="M50 40V84" stroke="#ffb347" strokeWidth="3"/></svg>
const TICK='SYSTEM STATUS: SEALED   //   BUG DETECTED IN LAB   //   10:00 TO ESCAPE   //   3 TERMINALS   //   1 VAULT   //   GOOD LUCK   //   '
function Home({onStarted,onBoard,onAdmin,onRules,note}){
  const [pass,setP]=useState(''),[n,setN]=useState(0),[name,setName]=useState(''),[err,setErr]=useState(note||''),[busy,setBusy]=useState(false)
  async function go(){ // validate, then ask the server to check the passcode and open the team's session
    if(busy)return;if(!pass.trim())return setErr('Enter the access code.');if(!n)return setErr('Select your team number.');if(!name.trim())return setErr('Enter a team name.')
    setBusy(true);setErr('')
    try{const r=await api('/start',{body:{pass,team:n,name}});localStorage.setItem('esc_token',r.token);S.ok();await onStarted()}catch(e){setErr(e.message);S.bad()}
    setBusy(false)}
  const enter=e=>{if(e.key==='Enter')go()}
  return <div className="ov home"><div className="hm">
    <section className="hero">
      <p className="kick">C PROGRAMMING ESCAPE ROOM | FINAL ROUND</p>
      <h1 className="glitch" data-t="ESC-C-APE">ESC-C-APE</h1>
      <div className="subrow"><BugIcon/><span className="sub2">THE LAST BUG</span></div>
      <p className="lead">A rogue bug has sealed the lab. Crack three C terminals, collect three key digits and open the vault before the clock hits zero.</p>
      <div className="chips"><div><b>10:00</b><span>TIME LIMIT</span></div><div><b>3</b><span>TERMINALS</span></div><div><b>2</b><span>ATTEMPTS EACH</span></div><div><b>1</b><span>VAULT</span></div></div>
      <ol className="steps"><li>Enter the passcode from the last room</li><li>Solve the output, debug and pattern puzzles</li><li>Combine the key digits and crack the vault</li></ol>
    </section>
    <section className="card">
      <h2>MISSION LOGIN</h2>
      <label htmlFor="ac">ACCESS CODE</label><input id="ac" value={pass} onChange={e=>setP(e.target.value)} onKeyDown={enter} placeholder="Enter passcode" autoComplete="off"/>
      <label>TEAM NUMBER</label><div className="teams">{[1,2,3,4,5].map(i=><button key={i} className={'tmb'+(n===i?' on':'')} onClick={()=>setN(i)} aria-label={'Team '+i}>{i}</button>)}</div>
      <label htmlFor="tn">TEAM NAME</label><input id="tn" value={name} maxLength={24} onChange={e=>setName(e.target.value)} onKeyDown={enter} placeholder="Team name" autoComplete="off"/>
      <button className="go" disabled={busy} onClick={go}>START MISSION</button><p className="msg">{err}</p>
      <div className="links"><button className="lk" onClick={onRules}>Rules</button><button className="lk" onClick={onBoard}>Scoreboard</button><a href="#organiser" onClick={onAdmin}>Organiser</a></div>
    </section>
    <div className="ticker"><div>{TICK+TICK+TICK+TICK}</div></div>
  </div></div>
}
function Board({admin,onClose,extra,onFail}){ // admin dashboard and public scoreboard read the same server state, so a reset shows up in both
  const [rows,setR]=useState([]),[msg,setMsg]=useState(''),load=useCallback(async()=>{
    try{setR(await api(admin?'/admin/teams':'/scoreboard',{},admin));setMsg('')}
    catch(e){if(admin&&e.status===401){localStorage.removeItem('esc_admin');onFail&&onFail()}else setMsg('Could not load the table: '+e.message)}},[admin])
  useEffect(()=>{load();const a=setInterval(load,2000);return()=>clearInterval(a)},[load])
  const reset=async n=>{if(window.confirm('Reset Team '+n+'? Only this team is erased.')){await api('/admin/reset/'+n,{body:{}},true);load()}}
  return <div className="ov" style={{zIndex:6}}><div className="pn wide"><h2>{admin?'Organiser dashboard':'Scoreboard'}</h2><div className="tw"><table className="tbl"><thead><tr>
    <th>#</th><th>Team</th><th>Done</th>{admin&&<><th>Now</th><th>Keys</th><th>Wrong</th></>}<th>Score</th><th>Left</th><th>Status</th>{admin&&<th></th>}</tr></thead><tbody>
    {rows.map(r=><tr key={r.n}><td>{r.n}</td><td>{r.name||'-'}</td><td>{r.done}/3</td>{admin&&<><td>{r.status==='playing'||r.status==='ready'?r.cur:'-'}</td><td>{r.digits}</td><td>{r.wr}</td></>}
      <td>{r.score}</td><td>{r.status==='none'?'-':fmt(r.left)}</td><td>{LABEL[r.status]}</td>{admin&&<td><button style={{padding:'4px 8px',fontSize:13}} onClick={()=>reset(r.n)}>Reset</button></td>}</tr>)}
    </tbody></table></div>{msg&&<p className="msg">{msg}</p>}<div className="row" style={{marginTop:10}}>{extra}<button className="ghost" onClick={onClose}>Close</button></div></div></div>
}
function Admin({onClose}){
  const [ok,setOk]=useState(!!localStorage.getItem('esc_admin')),[pass,setP]=useState(''),[err,setErr]=useState('')
  async function login(){try{const r=await api('/admin/login',{body:{pass}});localStorage.setItem('esc_admin',r.token);setOk(true)}catch(e){setErr(e.message)}}
  async function wipe(){if(window.confirm('Start a NEW EVENT? All five teams are erased.')&&window.prompt('Type RESET to confirm')==='RESET'){await api('/admin/reset-all',{body:{confirm:'RESET'}},true);localStorage.removeItem('esc_token');window.location.reload()}}
  if(ok)return <Board admin onClose={onClose} onFail={()=>{setOk(false);setErr('Session expired. Please log in again.')}} extra={<><button className="ghost" onClick={()=>window.open('#scoreboard','_blank')}>Open live scoreboard</button><button onClick={wipe}>New event (reset all)</button></>}/>
  return <div className="ov"><div className="pn"><h2>Organiser login</h2><input type="password" value={pass} onChange={e=>setP(e.target.value)} placeholder="Organiser passcode"/>
    <button onClick={login}>Enter</button><button className="ghost" onClick={onClose}>Back</button><p className="msg">{err}</p></div></div>
}
function QModal({i,me,sync,onSolved,close,onBad}){
  const q=me.q[i],[val,setVal]=useState(''),[pick,setPick]=useState(null),[msg,setMsg]=useState(me.hints[i]?'Hint: '+me.hints[i]:''),[busy,setBusy]=useState(false)
  const left=2-me.wr[i]
  async function submit(){
    if(busy)return;const ans=q.t==='mcq'?pick:val.trim()
    if(ans===null||ans==='')return setMsg('Give an answer first.')
    setBusy(true)
    try{const r=await api('/answer',{body:{q:i,answer:ans}});sync(r.state)
      if(r.ok)onSolved(r);else{S.bad();onBad();setMsg(r.state.status==='playing'?'Not correct. Minus 1 minute and 5 points. One attempt remains.':'')}}
    catch(e){setMsg(e.message)}
    setBusy(false)}
  async function hint(){if(me.hints[i]||busy)return;try{const r=await api('/hint',{body:{q:i}});sync(r);setMsg('Hint: '+r.hints[i])}catch(e){setMsg(e.message)}}
  const err=q.t==='err'
  return <div className="ov"><div className="pn"><h2>Terminal {i+1}: {q.n}</h2>
    <p className="goal">{err?'Find the line numbers containing syntax or logical errors (both count) and enter their SUM.':q.q} Attempts left: {left}</p>
    <div className="code">{q.c.map((l,k)=><div key={k} className="ln st">{err&&<span className="lnn">{String(k+1).padStart(2,'0')}  </span>}{l}</div>)}</div>
    {q.t==='mcq'?<div className={'opts'+(q.o.some(o=>o.split('\n').some(l=>l.length>30))?' one':'')}>{q.o.map((o,k)=><div key={k} tabIndex={0} className={'opt'+(pick===k?' on':'')} onClick={()=>setPick(k)} onKeyDown={e=>e.key==='Enter'&&setPick(k)}><b>{'ABCD'[k]}</b><pre style={{margin:'4px 0 0',font:'inherit',fontSize:16}}>{o}</pre></div>)}</div>
     :<input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submit()} placeholder={err?'Sum of faulty line numbers':'Type the output'} inputMode={err?'numeric':'text'} style={{letterSpacing:1}}/>}
    <div className="row" style={{marginTop:8}}><button disabled={busy} onClick={submit}>Submit answer</button>
      <button className="ghost" disabled={!!me.hints[i]} onClick={hint}>{me.hints[i]?'Hint used':'Hint (-3 pts)'}</button><button className="ghost" onClick={close}>Close</button></div>
    <p className="msg" style={{color:msg.startsWith('Hint')?'var(--am)':undefined}}>{msg}</p></div></div>
}
function Vault({me,sync,onOpen,close,onBad}){
  const [code,setC]=useState(''),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false)
  async function go(){if(busy)return;if(!/^\d{3}$/.test(code.trim()))return setMsg('Enter exactly three digits.');setBusy(true)
    try{const r=await api('/vault',{body:{code}});sync(r.state);if(r.ok)onOpen(code.trim());else{S.bad();onBad();setMsg(r.state.status==='playing'?'Wrong code. Minus 1 minute. One attempt remains.':'')}}catch(e){setMsg(e.message)}setBusy(false)}
  return <div className="ov"><div className="pn"><h2>Final vault</h2><p className="goal">Enter the three key digits in the order of Terminal 1, 2, 3. Attempts left: {2-me.vw}</p>
    <input value={code} maxLength={3} inputMode="numeric" onChange={e=>setC(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()} placeholder="000" style={{fontSize:34}}/>
    <div className="row"><button disabled={busy} onClick={go}>Unlock</button><button className="ghost" onClick={close}>Close</button></div><p className="msg">{msg}</p></div></div>
}
function Result({me,leave,board}){ // congratulations / failure screen, drawn over the 3D chamber
  const w=me.status==='escaped',used=me.wr.reduce((a,b)=>a+b,0)+me.vw,hints=me.hints.filter(Boolean).length
  return <div className="ov lite"><div className={'pn res '+(w?'win':'lose')}>
    <p className="kick">{w?'THE VAULT IS OPEN':'THE VAULT STAYS SEALED'}</p>
    <h1 className="rh">{w?'MISSION COMPLETE':me.status==='expired'?"TIME'S UP":'MISSION FAILED'}</h1>
    <p className="sub">{me.name} | Team {me.n}</p>
    {w&&<><p className="sm">YOUR NEW PASSCODE</p><div className="tiles">{me.code.split('').map((d,i)=><span key={i} className="tile" style={{animationDelay:(.3+i*.3)+'s'}}>{d}</span>)}</div></>}
    <div className="stats"><div><b>{me.score}</b><span>SCORE</span></div><div><b>{fmt(me.left)}</b><span>TIME LEFT</span></div><div><b>{used}</b><span>WRONG</span></div><div><b>{hints}</b><span>HINTS</span></div></div>
    <details><summary>Review answers</summary>{me.q.map((q,i)=>me.ex[i]&&<p key={i} className="ex"><b>Terminal {i+1}, {q.n}:</b> {me.ex[i]}</p>)}</details>
    <div className="row" style={{justifyContent:'center',marginTop:12}}><button onClick={leave}>Home</button><button className="ghost" onClick={leave}>Next team</button><button className="ghost" onClick={board}>Scoreboard</button></div></div></div>
}
export default function App(){
  const [me,setMe]=useState(null),[ph,setPh]=useState('idle'),[focus,setFocus]=useState(-1),[modal,setModal]=useState(null),[ttl,setTtl]=useState(null),[key,setKey]=useState(null),
    [unlock,setUnlock]=useState(null),[burst,setBurst]=useState(null),[shake,setShake]=useState(0),[flash,setFlash]=useState(0),[now,setNow]=useState(Date.now()),
    [note,setNote]=useState(''),[sbOnly,setSbOnly]=useState(window.location.hash==='#scoreboard'),[cap,setCap]=useState(null),[soft,setSoft]=useState(0),[pulse,setPulse]=useState(null),[snd,setSnd]=useState(true),[admin,setAdmin]=useState(window.location.hash==='#organiser'),[gl]=useState(hasGL),boot=useRef(false),sy=useRef(0)
  const sync=r=>setMe({...r,_t:Date.now()})
  const refresh=useCallback(async()=>{try{sync(await api('/state'))}catch(e){if(e.status===401){if(localStorage.getItem('esc_token'))setNote('This team was reset by the organiser. Please start again.');localStorage.removeItem('esc_token');boot.current=false;setMe(null);setPh('idle');setModal(null);setKey(null);setFocus(-1);setUnlock(false);setCap(null);document.body.classList.remove('cine')}}},[])
  useEffect(()=>{if(localStorage.getItem('esc_token'))refresh();const a=setInterval(()=>setNow(Date.now()),250);return()=>clearInterval(a)},[refresh])
  useEffect(()=>{if(!me||boot.current)return;boot.current=true;if(me.status==='ready')setModal({k:'rules'});else if(me.status==='playing')setPh('play')},[me])
  useEffect(()=>{if(!me||!['ready','playing'].includes(me.status))return;const a=setInterval(refresh,5000);return()=>clearInterval(a)},[me&&me.status,refresh])
  const live=!!me&&me.status==='playing'&&!me.paused,left=me?(live?me.left-(now-me._t):me.left):0,low=live&&left<=60000&&left>0
  useEffect(()=>{if(live&&left<=0&&Date.now()-sy.current>1500){sy.current=Date.now();refresh()}})
  useEffect(()=>{if(live&&left>0&&left<=10000)S.tick()},[Math.ceil(left/1000)])
  useEffect(()=>{if(me&&(me.status==='expired'||me.status==='failed'))S.fail()},[me&&me.status])
  const playing=!!me&&['ready','playing'].includes(me.status),failed=!!me&&['failed','expired'].includes(me.status)

  async function launch(){ // cinematic entry, then the server starts the clock
    setModal(null);document.body.classList.add('cine');setPh('intro');S.hum();setTtl(['SYSTEM BREACH','TEAM '+me.n+' ENTERS THE LAB'])
    setTimeout(()=>setTtl(null),2800);[3,2,1].forEach((n,k)=>setTimeout(()=>{setTtl([String(n),'GET READY']);S.tick()},2900+k*800))
    setTimeout(async()=>{try{sync(await api('/begin',{body:{}}))}catch(e){}document.body.classList.remove('cine');setTtl(['GO!','10 MINUTES. CRACK 3 TERMINALS.']);setTimeout(()=>setTtl(null),1500);setPh('play')},5400)}
  const pick=i=>{if(ph!=='play'||!me||me.solved[i]||me.paused||modal||key)return;setFocus(i);setModal({k:'q',i})}
  const closeModal=()=>{setModal(null);setFocus(-1)}
  function solved(r){ // show the key digit; the server pauses the clock until we continue
    S.key();setPulse({i:r.idx,k:Date.now()});setBurst({p:[X[r.idx],2.2,-3],k:Date.now()});setModal(null);setKey({digit:r.digit,idx:r.idx,e:r.state.ex[r.idx]})
    clearTimeout(solved.t);solved.t=setTimeout(()=>cont(r.state),4500)}
  async function cont(st){setKey(null);setFocus(-1);let s=st;try{s=await api('/continue',{body:{}});sync(s)}catch(e){}
    if(s.status==='playing'&&s.solved.every(Boolean))setModal({k:'vault'})}
  function opened(){ // vault accepted: real opening sequence in 3D (nothing blocks the view), then the congratulations screen
    const at=(ms,f)=>setTimeout(f,ms);S.vault();setModal(null);setPh('win');setUnlock(true);document.body.classList.add('cine')
    at(400,()=>{setCap('CODE ACCEPTED');S.ok()});at(1300,()=>{setCap('BOLTS RETRACTING');S.clunk()});at(2300,()=>{setCap('VAULT OPENING');S.door();setSoft(f=>f+1)})
    at(4300,()=>setCap('LIGHT FLOODS THE CHAMBER'));at(5000,()=>{setFlash(f=>f+1);S.win()});at(5700,()=>setCap('ENTERING THE TREASURE CHAMBER'))
    at(9000,()=>{setCap(null);setUnlock(false);document.body.classList.remove('cine')})}
  function leave(){localStorage.removeItem('esc_token');boot.current=false;setMe(null);setPh('idle');setModal(null);setKey(null);setFocus(-1)}
  const toggleSound=()=>{setSnd(!snd);setSound(!snd)}

  return <>
    <div style={{position:'fixed',inset:0}}>{gl?<Boundary><Scene phase={ph} focus={focus} solved={me?me.solved:[0,0,0]} low={low||failed} burst={burst} pulse={pulse} shake={shake} onPick={pick}/></Boundary>:<div className="fb"/>}</div>
    <div className="vg"/><div className="bar" style={{top:0}}/><div className="bar" style={{bottom:0}}/>
    <div id="ti" style={{opacity:ttl?1:0}}>{ttl&&<>{ttl[0]}<small>{ttl[1]}</small></>}</div>
    {flash>0&&<div key={flash} className="flash"/>}{soft>0&&<div key={'s'+soft} className="flash soft"/>}{shake>0&&<div key={'r'+shake} className="flash red"/>}
    {cap&&<div className="cap" key={cap}>{cap}</div>}
    <button className="snd" onClick={toggleSound}>{snd?'SOUND ON':'SOUND OFF'}</button>
    {sbOnly&&<Board onClose={()=>{setSbOnly(false);window.location.hash=''}}/>}
    {!me&&!admin&&!modal&&!sbOnly&&<Home note={note} onStarted={()=>{setNote('');return refresh()}} onBoard={()=>setModal({k:'board'})} onAdmin={()=>setAdmin(true)} onRules={()=>setModal({k:'rules'})}/>}
    {admin&&<Admin onClose={()=>{setAdmin(false);window.location.hash=''}}/>}
    {playing&&ph==='play'&&<>
      <div id="hud"><span id="tm" className={low?'lo':''}>{fmt(left)}</span><span>{me.name} | Team {me.n}</span><span>Score {me.score}</span><span>Keys {me.digits.map(d=>d===null?'?':d).join(' ')}</span></div>
      {low&&<div className="warn">ONE MINUTE REMAINING</div>}
      <div id="bar">{[0,1,2].map(i=><button key={i} className={me.solved[i]?'done':''} disabled={!!me.solved[i]} onClick={()=>pick(i)}>Terminal {i+1}{me.solved[i]?' done':''}</button>)}
        {me.solved.every(Boolean)&&<button onClick={()=>setModal({k:'vault'})}>Vault</button>}<button className="ghost" onClick={()=>setModal({k:'rules'})}>Rules</button></div></>}
    {modal&&modal.k==='rules'&&<Rules onOk={()=>me&&me.status==='ready'?launch():setModal(null)} label={me&&me.status==='ready'?'I understand the rules. Start':me?'Back to the room':'Back to home'}/>}
    {modal&&modal.k==='board'&&<Board onClose={()=>setModal(null)}/>}
    {modal&&modal.k==='q'&&me&&<QModal key={modal.i} i={modal.i} me={me} sync={sync} onSolved={solved} close={closeModal} onBad={()=>setShake(s=>s+1)}/>}
    {modal&&modal.k==='vault'&&me&&<Vault me={me} sync={sync} onOpen={opened} close={closeModal} onBad={()=>setShake(s=>s+1)}/>}
    {key&&<div className="ov lite key"><div className="pn" style={{textAlign:'center'}}><h2>Access granted</h2><p className="sm">Key digit for Terminal {key.idx+1}. The clock is paused.</p>
      <p className="big pop" key={key.idx}>{key.digit}</p><p className="ex">{key.e}</p><button onClick={()=>{clearTimeout(solved.t);cont(me)}}>Continue</button></div></div>}
    {me&&!playing&&!unlock&&!key&&<Result me={me} leave={leave} board={()=>setModal({k:'board'})}/>}
  </>
}
