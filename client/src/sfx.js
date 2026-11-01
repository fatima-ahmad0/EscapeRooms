// Tiny WebAudio effects. The AudioContext is only created after a user click, never on page load.
let ac,on=true;export const setSound=v=>{on=v};
function sfx(f,d=.2,ty='sine',v=.1,f2){if(!on)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain(),n=ac.currentTime;
  o.type=ty;o.frequency.setValueAtTime(f,n);if(f2)o.frequency.exponentialRampToValueAtTime(f2,n+d);g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);
  o.connect(g);g.connect(ac.destination);o.start(n);o.stop(n+d)}catch(e){}}
const seq=(a,d,ty)=>a.forEach((f,i)=>setTimeout(()=>sfx(f,d,ty||'triangle'),i*130));
export const S={ok:()=>seq([660,990],.3),bad:()=>sfx(140,.35,'sawtooth',.14,60),key:()=>seq([523,659,784,1047],.3),vault:()=>sfx(55,2.4,'sawtooth',.2,38),
  fail:()=>sfx(200,1,'sawtooth',.12,50),win:()=>seq([392,523,659,784,1047],.5),tick:()=>sfx(880,.08,'square',.05),hum:()=>sfx(60,3,'sawtooth',.08,40),clunk:()=>{sfx(90,.3,'square',.22,40);setTimeout(()=>sfx(70,.3,'square',.2,35),180)},door:()=>sfx(70,2.4,'sawtooth',.12,45)};
