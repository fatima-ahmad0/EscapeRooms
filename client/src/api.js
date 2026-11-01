// All game decisions come from the server. Team token and organiser token travel in headers.
export async function api(path,o={},admin){
  const r=await fetch('/api'+path,{method:o.body?'POST':'GET',headers:{'Content-Type':'application/json',
    'x-token':localStorage.getItem('esc_token')||'','x-admin':localStorage.getItem('esc_admin')||''},body:o.body?JSON.stringify(o.body):undefined});
  const j=await r.json().catch(()=>({}));
  if(!r.ok)throw Object.assign(new Error(j.error||'Server error'),{status:r.status});
  return j;
}
