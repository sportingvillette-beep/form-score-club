import {CONFIG, U, getSelection, saveSelection, loadMatches, renderList, isFinished} from './shared.js';
}


export function wireFinalPhotoForm(){
const sel=getSelection();
const form=document.getElementById('fPhoto');
const msg=document.getElementById('msg2');
const btn=document.getElementById('btn2');
const banner=document.getElementById('infoFinale');


if(sel){
banner.textContent = isFinished(sel.winlose)? 'Match terminé ✅ — vous pouvez ajouter une photo finale.' : '⚠️ Cette action est réservée aux matchs terminés.';
}


form.addEventListener('submit', async (e)=>{
e.preventDefault(); msg.textContent='';
const file=document.getElementById('photo2').files[0];
if(!file){ msg.textContent='Choisissez une photo.'; msg.className='msg err'; return; }
if (file && file.size > CONFIG.maxSizeMB*1024*1024){ msg.textContent=`Fichier trop lourd (max ${CONFIG.maxSizeMB} Mo).`; msg.className='msg err'; return; }


const fd=new FormData();
fd.append('match_id', sel?.match_id||'');
fd.append('equipe1_label', sel?.equipe1||'');
fd.append('equipe2_label', sel?.equipe2||'');
fd.append('meta', [U.fmtDate(sel?._date), U.fmtTime(sel?._date), sel?.categorie, sel?.ville].filter(Boolean).join(' · '));
fd.append('photo_finale', document.getElementById('photo2').files[0]);


try{
btn.disabled=true; btn.textContent='Envoi…'; msg.textContent='Transmission sécurisée…'; msg.className='msg muted';
const res=await fetch(CONFIG.webhookPhotoUrl,{method:'POST', body:fd});
if(!res.ok) throw new Error('Webhook photo non joignable');
form.reset(); document.getElementById('preview2').style.display='none';
msg.textContent='Photo envoyée pour archivage !'; msg.className='msg ok';
setTimeout(()=>{ location.href='index.html#ok'; }, 700);
}catch(err){ msg.textContent='Erreur d\'envoi. Réessayez.'; msg.className='msg err'; }
finally{ btn.disabled=false; btn.textContent='Envoyer photo'; }
});
}


export function wireGenericPhotoForm(){
const sel=getSelection();
const form=document.getElementById('fPhoto');
const msg=document.getElementById('msg2');
const btn=document.getElementById('btn2');


form.addEventListener('submit', async (e)=>{
e.preventDefault(); msg.textContent='';
const file=document.getElementById('photo2').files[0];
if(!file){ msg.textContent='Choisissez une photo.'; msg.className='msg err'; return; }
if (file && file.size > CONFIG.maxSizeMB*1024*1024){ msg.textContent=`Fichier trop lourd (max ${CONFIG.maxSizeMB} Mo).`; msg.className='msg err'; return; }


const fd=new FormData();
fd.append('match_id', sel?.match_id||'');
fd.append('equipe1_label', sel?.equipe1||'');
fd.append('equipe2_label', sel?.equipe2||'');
fd.append('meta', [U.fmtDate(sel?._date), U.fmtTime(sel?._date), sel?.categorie, sel?.ville].filter(Boolean).join(' · '));
fd.append('photo', document.getElementById('photo2').files[0]);


try{
btn.disabled=true; btn.textContent='Envoi…'; msg.textContent='Transmission sécurisée…'; msg.className='msg muted';
const res=await fetch(CONFIG.webhookPhotoUrl,{method:'POST', body:fd});
if(!res.ok) throw new Error('Webhook photo non joignable');
form.reset(); document.getElementById('preview2').style.display='none';
msg.textContent='Photo envoyée !'; msg.className='msg ok';
setTimeout(()=>{ location.href='index.html#ok'; }, 700);
}catch(err){ msg.textContent='Erreur d\'envoi. Réessayez.'; msg.className='msg err'; }
finally{ btn.disabled=false; btn.textContent='Envoyer photo'; }
});
}


export function wireDropzone(fileId, previewId, zoneId){
const dz=document.getElementById(zoneId), file=document.getElementById(fileId), prev=document.getElementById(previewId);
['dragenter','dragover'].forEach(evt=>dz.addEventListener(evt,e=>{e.preventDefault();e.stopPropagation();dz.classList.add('drag')}));
['dragleave','drop'].forEach(evt=>dz.addEventListener(evt,e=>{e.preventDefault();e.stopPropagation();dz.classList.remove('drag')}));
dz.addEventListener('drop',e=>{ if(e.dataTransfer.files?.length){ file.files=e.dataTransfer.files; file.dispatchEvent(new Event('change')); } });
file.addEventListener('change',()=>{ const f=file.files[0]; if(!f){ prev.style.display='none'; prev.src=''; return; } prev.src=URL.createObjectURL(f); prev.style.display='block'; });
}
