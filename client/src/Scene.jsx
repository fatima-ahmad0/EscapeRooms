// 3D escape room built with React Three Fiber. Camera, doors, shutters, vault and the treasure chamber are driven by the game phase.
import {Canvas,useFrame,useThree} from '@react-three/fiber'
import * as THREE from 'three'
import {useRef,useMemo,useEffect,useState} from 'react'
export const X=[-4.5,0,4.5]
const ease=x=>1-Math.pow(1-Math.min(1,Math.max(0,x)),3),V3=THREE.Vector3

function Label({text,color}){ // screen text drawn on a canvas texture (no font downloads needed)
  const tex=useMemo(()=>{const c=document.createElement('canvas');c.width=256;c.height=170;return new THREE.CanvasTexture(c)},[])
  useEffect(()=>{const x=tex.image.getContext('2d');x.fillStyle='#120c28';x.fillRect(0,0,256,170);x.fillStyle=color;x.font='bold 30px monospace';x.textAlign='center'
    text.forEach((s,i)=>x.fillText(s,128,70+i*45));tex.needsUpdate=true},[text.join('|'),color])
  return <meshBasicMaterial map={tex}/>
}
function Terminal({i,done,sink,onPick}){
  const s=useRef(),g=useRef(),[hot,setHot]=useState(false)
  useFrame(({clock})=>{if(s.current)s.current.material.emissiveIntensity=done?.9:.45+Math.sin(clock.elapsedTime*3+i)*.25+(hot?.5:0)
    if(g.current){g.current.position.y+=((sink?-3.4:0)-g.current.position.y)*.05;g.current.scale.setScalar(THREE.MathUtils.lerp(g.current.scale.x,hot&&!done?1.07:1,.15))}})
  return <group ref={g} position={[X[i],0,-3]} onClick={e=>{e.stopPropagation();onPick(i)}}
    onPointerOver={()=>{setHot(true);document.body.style.cursor='pointer'}} onPointerOut={()=>{setHot(false);document.body.style.cursor=''}}>
    <mesh position={[0,.6,0]}><boxGeometry args={[2.4,1.2,1.2]}/><meshStandardMaterial color="#2a2060"/></mesh>
    <mesh ref={s} position={[0,2,-.2]} rotation={[-.12,0,0]}><boxGeometry args={[2.3,1.6,.14]}/><meshStandardMaterial color="#120c28" emissive={done?'#6dffb0':'#ffb347'}/></mesh>
    <mesh position={[0,2,-.1]} rotation={[-.12,0,0]}><planeGeometry args={[2,1.3]}/>
      <Label text={done?['ACCESS','GRANTED']:['TERMINAL',String(i+1)]} color={done?'#6dffb0':'#ffb347'}/></mesh>
  </group>
}
function Shutter({i,open}){ // wall hatch that slides up when its terminal is solved
  const r=useRef()
  useFrame(()=>{r.current.position.y+=((open?7.6:5.9)-r.current.position.y)*.06})
  return <group position={[X[i],0,0]}>
    <mesh position={[0,5.9,-7.85]}><boxGeometry args={[2.4,1.2,.1]}/><meshBasicMaterial color="#6dffb0"/></mesh>
    <mesh ref={r} position={[0,5.9,-7.7]}><boxGeometry args={[2.6,1.4,.25]}/><meshStandardMaterial color="#2a2060" emissive="#ff4d6d" emissiveIntensity={.4}/></mesh></group>
}
function Sparks({burst}){
  const N=160,g=useRef(),k=useRef(0),P=useMemo(()=>new Float32Array(N*3).fill(-99),[]),Vl=useMemo(()=>new Float32Array(N*3),[]),L=useMemo(()=>new Float32Array(N),[])
  useEffect(()=>{if(!burst)return;const [x,y,z]=burst.p
    for(let n=0;n<45;n++){const j=(k.current++)%N,a=Math.random()*6.28,u=Math.random()*2-1,s=2+Math.random()*4,r=Math.sqrt(1-u*u)
      P.set([x,y,z],j*3);Vl.set([r*Math.cos(a)*s,u*s+2,r*Math.sin(a)*s],j*3);L[j]=1}},[burst])
  useFrame((_,d)=>{d=Math.min(d,.05);for(let j=0;j<N;j++)if(L[j]>0){L[j]-=d*.9;Vl[j*3+1]-=7*d;for(let c=0;c<3;c++)P[j*3+c]+=Vl[j*3+c]*d;if(L[j]<=0)P[j*3+1]=-99}
    g.current.geometry.attributes.position.needsUpdate=true})
  return <points ref={g} frustumCulled={false}><bufferGeometry><bufferAttribute attach="attributes-position" args={[P,3]}/></bufferGeometry>
    <pointsMaterial color="#ffd27a" size={.16} transparent depthWrite={false} blending={THREE.AdditiveBlending}/></points>
}
function Pulse({i}){ // visual energy pulse travels from a solved terminal to its lamp on the vault wall
  const r=useRef(),t0=useRef(null)
  useFrame(({clock})=>{if(t0.current===null)t0.current=clock.elapsedTime;const u=Math.min(1,(clock.elapsedTime-t0.current)/1.1),e=u*u*(3-2*u)
    const m=new V3(X[i],2.6,-3).lerp(new V3([-.7,0,.7][i],4.9,-7.4),e);m.y+=Math.sin(u*Math.PI)*2;r.current.position.copy(m);r.current.scale.setScalar(u>=1?0:1)})
  return <mesh ref={r}><sphereGeometry args={[.22,12,12]}/><meshBasicMaterial color="#6dffb0"/></mesh>
}
const GL=['for','if','&&','||','++','{ }','int','==','<=',';','%','else','main','0x','printf']
function Glyphs(){ // floating C keywords drifting up through the room
  const g=useRef(),items=useMemo(()=>GL.map(s=>{const c=document.createElement('canvas');c.width=128;c.height=48;const x=c.getContext('2d');x.fillStyle='#5ee7ff';x.font='bold 30px monospace';x.textAlign='center';x.fillText(s,64,34)
    return{tex:new THREE.CanvasTexture(c),x:(Math.random()-.5)*13,z:(Math.random()-.5)*12,y:Math.random()*7,v:.15+Math.random()*.25}}),[])
  useFrame((_,d)=>{g.current.children.forEach((m,i)=>{const o=items[i];o.y+=o.v*d;if(o.y>7)o.y=0;m.position.set(o.x,o.y,o.z);m.material.opacity=Math.sin(Math.PI*o.y/7)*.5})})
  return <group ref={g}>{items.map((o,i)=><sprite key={i} scale={[1.6,.6,1]}><spriteMaterial map={o.tex} transparent depthWrite={false} opacity={0}/></sprite>)}</group>
}
function Confetti({on}){
  const N=260,g=useRef(),P=useMemo(()=>{const a=new Float32Array(N*3);for(let i=0;i<N;i++){a[i*3]=(Math.random()-.5)*12;a[i*3+1]=Math.random()*9;a[i*3+2]=-30+(Math.random()-.5)*18}return a},[]),
    C=useMemo(()=>{const a=new Float32Array(N*3),pal=['#ffd27a','#ff4d6d','#5ee7ff','#6dffb0','#c9a3ff'];for(let i=0;i<N;i++)new THREE.Color(pal[i%5]).toArray(a,i*3);return a},[]),
    sp=useMemo(()=>Array.from({length:N},()=>1+Math.random()*2),[])
  useFrame((_,d)=>{if(!on)return;d=Math.min(d,.05);for(let i=0;i<N;i++){P[i*3+1]-=sp[i]*d;P[i*3]+=Math.sin(P[i*3+1]*2+i)*d*.6;if(P[i*3+1]<0)P[i*3+1]=9}g.current.geometry.attributes.position.needsUpdate=true})
  return <points ref={g} visible={on} frustumCulled={false}><bufferGeometry><bufferAttribute attach="attributes-position" args={[P,3]}/><bufferAttribute attach="attributes-color" args={[C,3]}/></bufferGeometry>
    <pointsMaterial vertexColors size={.1} depthWrite={false}/></points>
}
function Rig({phase,focus,shake}){
  const {camera,size}=useThree(),p=useRef(new V3(0,11,36)),l=useRef(new V3(0,3,-4)),t0=useRef(performance.now()),sh=useRef(0),jumped=useRef(false)
  useEffect(()=>{t0.current=performance.now();jumped.current=false},[phase])
  useEffect(()=>{sh.current=1},[shake])
  useEffect(()=>{camera.fov=size.width<size.height?80:62;camera.updateProjectionMatrix()},[size,camera])
  useFrame(({clock},dt)=>{
    const t=clock.elapsedTime,w=(performance.now()-t0.current)/1000;let c,a=[0,2,-4]
    if(phase==='idle')c=[Math.sin(t*.15)*10,3.5+Math.sin(t*.2),9+Math.cos(t*.15)*3]
    else if(phase==='intro'){c=w<1.8?[0,4.5,21]:w<2.8?[0,1.8,9.5]:[0,2.4,7.2];a=[0,2.4,-6]}
    else if(phase==='win'){
      if(w<.3)c=[0,2.4,7.2]
      else if(w<3.6){c=[-2.2,4.4,1.2];a=[0,2.4,-7.7]} // look over the terminals at the vault
      else if(w<5){c=[2.2,3,-4.6];a=[0,2.4,-7.8]}    // slip past the terminals toward the opening door
      else{if(!jumped.current){jumped.current=true;p.current.set(0,3.4,-26)}const g=(w-5)*.22;c=[Math.sin(g)*7,3.2+Math.sin(g*.7)*.4,-34+Math.cos(g)*7];a=[0,2.8,-34]}}
    else if(focus>=0){c=[X[focus]*.5,2.2,1.8];a=[X[focus],2,-3]}else c=[0,2.4,7.2]
    const k=1-Math.exp(-2.2*Math.min(dt,.05));p.current.lerp(new V3(...c),k);l.current.lerp(new V3(...a),k);sh.current*=.9
    camera.position.set(p.current.x+Math.sin(t*.4)*.2+(Math.random()-.5)*sh.current*.4,p.current.y+Math.sin(t*.7)*.05+(Math.random()-.5)*sh.current*.4,p.current.z)
    camera.lookAt(l.current)})
  return null
}
const metal=<meshStandardMaterial color="#6b6f86" metalness={.85} roughness={.3}/>
function World({phase,focus,solved,low,burst,pulse,shake,onPick}){
  const [sw,setSw]=useState(false),[fire,setFire]=useState(null),ph0=useRef({p:'',t:0}),fw=useRef(0)
  const dL=useRef(),dR=useRef(),wheel=useRef(),dv=useRef(),glow=useRef(),bug=useRef(),a1=useRef(),a2=useRef(),tr=useRef(),dust=useRef()
  const dpos=useMemo(()=>{const a=new Float32Array(780);for(let i=0;i<260;i++){a[i*3]=(Math.random()-.5)*14;a[i*3+1]=Math.random()*6.5;a[i*3+2]=(Math.random()-.5)*14}return a},[])
  const win=phase==='win',ev=useRef({}),shock=useRef(),bolts=useRef(),vl=useRef(),r1=useRef(),r2=useRef(),rays=useRef()
  useFrame(({clock},dt)=>{ // w = seconds since all three terminals were solved; this is the opening timeline
    const t=clock.elapsedTime;if(ph0.current.p!==phase){ph0.current={p:phase,t};ev.current={}}
    const e=t-ph0.current.t,w=win?e:-1
    if(win&&e>5&&!sw)setSw(true);if(!win&&sw)setSw(false)
    const open=phase==='play'||win||(phase==='intro'&&e>1.8)
    ;[dL,dR].forEach((r,k)=>{const s=k?1:-1;r.current.visible=phase!=='idle';r.current.position.x=phase==='idle'?s*4:r.current.position.x+(s*(4+(open?10:0))-r.current.position.x)*.05})
    wheel.current.rotation.z=w>=0?-ease((w-.4)/1.6)*Math.PI*3:t*.4
    const ret=w>=0?ease((w-1.2)/.8):0
    bolts.current.children.forEach((m,k)=>{const an=k*Math.PI/4,rr=1.9-.4*ret;m.position.set(Math.cos(an)*rr,Math.sin(an)*rr,0)})
    dv.current.rotation.y=w>2.2?-ease((w-2.2)/2.6)*1.9:0
    const lg=w>=0?ease((w-2.3)/1.5):0
    glow.current.material.opacity=lg;vl.current.intensity=lg*1.8;rays.current.visible=lg>0
    rays.current.children.forEach((m,k)=>{m.material.opacity=lg*[.11,.08,.06][k]*(.85+Math.sin(t*3+k)*.15)})
    const sk=w>=2?ease((w-2)/1.6):0;shock.current.scale.setScalar(1+sk*14);shock.current.material.opacity=w>=2?(1-sk)*.8:0
    bug.current.rotation.set(t*.6,t*(1+(win?4:0)),0);bug.current.position.y=3.6+Math.sin(t*2)*.2;bug.current.scale.setScalar(w>=0?Math.max(0,1-w*1.3):1)
    ;[a1,a2].forEach((r,i)=>{const an=t*1.6+i*Math.PI;r.current.position.set(Math.cos(an)*5,5.5,-2+Math.sin(an)*5);r.current.intensity=win?0:low?2+Math.sin(t*12)*2:1.2+Math.sin(t*3)*.6})
    dust.current.rotation.y=t*.03
    if(win&&!sw)[1.3,2,2.6,3.2].forEach((tt,k)=>{if(w>=tt&&!ev.current[k]){ev.current[k]=1;setFire({p:[(k%2?1:-1)*1.3,2.4,-6.6],k:t+k})}})
    if(sw){tr.current.rotation.y=t;tr.current.position.y=2.6+Math.sin(t*2)*.25;r1.current.rotation.x=t;r2.current.rotation.y=t*1.3;fw.current-=dt
      if(fw.current<0){fw.current=.45;setFire({p:[(Math.random()-.5)*8,2+Math.random()*4,-32+Math.random()*4],k:t})}}})
  const door=<mesh><boxGeometry args={[8,7,.4]}/><meshStandardMaterial color="#3a3470" emissive="#ff4d6d" emissiveIntensity={.25}/></mesh>
  return <>
    <ambientLight intensity={.9} color="#6a5aa8"/>
    <pointLight ref={a1} color="#ff3355" distance={16}/><pointLight ref={a2} color="#ff3355" distance={16}/>
    <pointLight position={[-5,4.5,0]} color="#ffb347" intensity={1.1} distance={20}/><pointLight position={[5,4.5,2]} color="#5ee7ff" intensity={1} distance={20}/>
    <Rig phase={phase} focus={focus} shake={shake}/>
    <group visible={!sw}>
      <mesh position={[0,3.5,0]}><boxGeometry args={[16,7,16]}/><meshStandardMaterial color="#1d1640" side={THREE.BackSide} roughness={.9}/></mesh>
      <gridHelper args={[16,16,'#ffb347','#3a2f78']} position={[0,.02,0]}/>
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,.05,-1]}><ringGeometry args={[2.6,3.4,64]}/><meshBasicMaterial color="#ffb347" transparent opacity={.4} side={THREE.DoubleSide}/></mesh>
      {[[-7,-5],[7,-5],[-7,3],[7,3]].map(([x,z])=><mesh key={x+'_'+z} position={[x,3.5,z]}><cylinderGeometry args={[.4,.4,7,12]}/><meshStandardMaterial color="#2a2060"/></mesh>)}
      <Glyphs/>
      {[0,1,2].map(i=><Terminal key={i} i={i} done={!!solved[i]} sink={win} onPick={onPick}/>)}
      {[0,1,2].map(i=><Shutter key={i} i={i} open={!!solved[i]}/>)}
      {[-.7,0,.7].map((x,k)=><mesh key={k} position={[x,4.9,-7.5]}><sphereGeometry args={[.17,16,16]}/>
        <meshStandardMaterial color={solved[k]?'#6dffb0':'#ff4d6d'} emissive={solved[k]?'#6dffb0':'#ff4d6d'} emissiveIntensity={1}/></mesh>)}
      <mesh position={[0,2.2,-7.7]}><torusGeometry args={[1.95,.28,16,48]}/>{metal}</mesh>
      <mesh ref={glow} position={[0,2.2,-7.85]}><circleGeometry args={[1.75,40]}/><meshBasicMaterial color="#ffd27a" transparent opacity={0}/></mesh>
      <group ref={dv} position={[-1.85,2.2,-7.6]}>
        <mesh position={[1.85,0,0]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[1.75,1.75,.4,48]}/>{metal}</mesh>
        <mesh position={[1.85,0,.22]}><torusGeometry args={[1.25,.06,12,40]}/><meshStandardMaterial color="#ffb347" emissive="#ffb347" emissiveIntensity={.5}/></mesh>
        <group ref={bolts} position={[1.85,0,.05]}>{[0,1,2,3,4,5,6,7].map(k=><mesh key={k} rotation={[0,0,k*Math.PI/4]}><boxGeometry args={[.5,.22,.32]}/><meshStandardMaterial color="#ffb347" metalness={.8} roughness={.3}/></mesh>)}</group>
        <group ref={wheel} position={[1.85,0,.35]}><mesh><torusGeometry args={[.5,.07,10,24]}/>{metal}</mesh>
          {[0,1,2].map(k=><mesh key={k} rotation={[0,0,k*Math.PI/3]}><boxGeometry args={[1,.09,.09]}/>{metal}</mesh>)}</group></group>
      <mesh ref={shock} rotation={[-Math.PI/2,0,0]} position={[0,.07,-7]}><ringGeometry args={[.9,1,64]}/><meshBasicMaterial color="#ffd27a" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>
      <group ref={rays} visible={false} position={[0,2.2,-3.9]} rotation={[-Math.PI/2,0,0]}>{[1.7,1.1,.6].map(R=><mesh key={R}><coneGeometry args={[R,7,32,1,true]}/><meshBasicMaterial color="#ffd27a" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending}/></mesh>)}</group>
      <pointLight ref={vl} position={[0,2.2,-6.8]} color="#ffd27a" intensity={0} distance={9}/>
      <mesh ref={bug} position={[0,3.6,-1]}><icosahedronGeometry args={[.65,0]}/>
        <meshStandardMaterial color={win?'#6dffb0':'#ff4d6d'} emissive={win?'#6dffb0':'#ff4d6d'} emissiveIntensity={.7} flatShading/>
        <mesh scale={1.45}><icosahedronGeometry args={[.65,1]}/><meshBasicMaterial color={win?'#6dffb0':'#ff4d6d'} wireframe transparent opacity={.4}/></mesh></mesh>
      <points ref={dust}><bufferGeometry><bufferAttribute attach="attributes-position" args={[dpos,3]}/></bufferGeometry><pointsMaterial color="#5ee7ff" size={.07}/></points>
      <group ref={dL} position={[-4,3.5,8.3]}>{door}<mesh position={[3.9,0,0]}><boxGeometry args={[.25,7,.45]}/><meshStandardMaterial color="#ffb347" emissive="#ffb347" emissiveIntensity={1}/></mesh></group>
      <group ref={dR} position={[4,3.5,8.3]}>{door}<mesh position={[-3.9,0,0]}><boxGeometry args={[.25,7,.45]}/><meshStandardMaterial color="#ffb347" emissive="#ffb347" emissiveIntensity={1}/></mesh></group>
    </group>
    <group visible={sw}>
      <mesh position={[0,4,-30]}><boxGeometry args={[14,8,22]}/><meshStandardMaterial color="#3a2a08" emissive="#2a1c00" side={THREE.BackSide} metalness={.5} roughness={.6}/></mesh>
      <gridHelper args={[22,22,'#ffd27a','#6a4a10']} position={[0,.02,-30]}/>
      <mesh ref={tr} position={[0,2.6,-34]}><octahedronGeometry args={[.9,0]}/><meshStandardMaterial color="#ffd27a" emissive="#ffb347" emissiveIntensity={.8} metalness={1} roughness={.2} flatShading/></mesh>
      {[-4,4].flatMap(x=>[-24,-30,-36].map(z=><mesh key={x+'_'+z} position={[x,4,z]}><cylinderGeometry args={[.35,.35,8,10]}/><meshStandardMaterial color="#6a4a10" emissive="#ffb347" emissiveIntensity={.4}/></mesh>))}
      <mesh position={[0,.3,-34]}><cylinderGeometry args={[1.3,1.6,.6,32]}/><meshStandardMaterial color="#6a4a10" emissive="#ffb347" emissiveIntensity={.5} metalness={.8}/></mesh>
      <mesh ref={r1} position={[0,2.6,-34]}><torusGeometry args={[1.6,.04,8,48]}/><meshBasicMaterial color="#ffd27a"/></mesh>
      <mesh ref={r2} position={[0,2.6,-34]}><torusGeometry args={[2.2,.04,8,48]}/><meshBasicMaterial color="#5ee7ff"/></mesh>
      <pointLight position={[0,5,-31]} color="#ffd27a" intensity={3.5} distance={30}/>
    </group>
    <Sparks burst={burst}/><Sparks burst={fire}/><Confetti on={sw}/>{pulse&&<Pulse key={pulse.k} i={pulse.i}/>}
  </>
}
export default function Scene(p){
  return <Canvas camera={{fov:62,position:[0,11,36],near:.1,far:80}} dpr={[1,2]}
    onCreated={({scene})=>{scene.background=new THREE.Color('#0d0a1f');scene.fog=new THREE.Fog('#0d0a1f',9,28)}}><World {...p}/></Canvas>
}
