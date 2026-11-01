// State store: MongoDB when MONGO_URI is set, otherwise a JSON file. Both keep one in-memory copy for speed.
const fs=require('fs'),path=require('path');
const FILE=process.env.DATA_FILE||path.join(__dirname,'data.json');
let S={teams:{}},M=null;
exports.init=async()=>{
  if(process.env.MONGO_URI){
    const m=require('mongoose');await m.connect(process.env.MONGO_URI);
    M=m.model('State',new m.Schema({_id:String,s:m.Schema.Types.Mixed},{minimize:false}));
    const d=await M.findById('event');if(d&&d.s)S=d.s;
  }else{try{S=JSON.parse(fs.readFileSync(FILE,'utf8'))}catch(e){}}
  if(!S.teams)S.teams={};
};
exports.get=()=>S;
exports.set=x=>{S=x};
exports.save=()=>{
  try{if(M)M.findByIdAndUpdate('event',{s:S},{upsert:true}).catch(e=>console.error('save',e.message));else fs.writeFileSync(FILE,JSON.stringify(S))}
  catch(e){console.error('save',e.message)}
};
