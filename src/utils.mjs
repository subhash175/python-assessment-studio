export function normalize(text, mode) {
  const value = text.replace(/\r\n/g, '\n');
  if(mode==='trim') return value.trim();
  if(mode==='whitespace') return value.trim().replace(/\s+/g,' ');
  return text;
}
export function csvCell(value){const s=String(value??'');return '"'+(/^[=+\-@\t\r]/.test(s)?"'":'')+s.replace(/"/g,'""')+'"';}
export function download(name,content,type='text/plain') {const u=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
