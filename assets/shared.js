// --- Configuration commune ---
const idx=Object.fromEntries(headers.map((h,i)=>[h.toLowerCase(),i]));
const F=CONFIG.fields; const L=Object.fromEntries(Object.entries(F).map(([k,v])=>[k,(v||'').toLowerCase()]));
const items=rows.map(r=>{
const d=r[idx[L.date]], h=r[idx[L.heure]], dt=U.parseDateTimeFR(d,h);
const e1=(r[idx[L.equipe1]]||'').trim(), e1x=(r[idx[L.equipe1x]]||'').trim();
const e2=(r[idx[L.equipe2]]||'').trim(), e2x=(r[idx[L.equipe2x]]||'').trim();
const e1label=(e1+(e1x?` ${e1x}`:'' )).trim(); const e2label=(e2+(e2x?` ${e2x}`:'' )).trim();
const photo=(r[idx[L.photo]]||'').trim();
return {
match_id:r[idx[L.match_id]], date_str:d, heure_str:h, _date:dt,
categorie:r[idx[L.categorie]], genre:r[idx[L.genre]] || '',
championnat:r[idx[L.championnat]],
equipe1:e1label, equipe2:e2label,
eq1score:r[idx[L.eq1score]], eq2score:r[idx[L.eq2score]],
winlose:r[idx[L.winlose]], gymnase:r[idx[L.gymnase]], ville:r[idx[L.ville]],
photo:U.isUrl(photo)?photo:''
};
}).filter(x=>x&&x.match_id);
// fenêtre J-2 → J+5
const base=new Date(); base.setHours(0,0,0,0);
const start=new Date(base); start.setDate(start.getDate()-(CONFIG.dateWindow.pastDays||2));
const end=new Date(base); end.setDate(end.getDate()+(CONFIG.dateWindow.futureDays||5));
const filtered=items.filter(x=>x._date && x._date>=start && x._date<=end);
filtered.sort((a,b)=> a._date-b._date);
return filtered;
}


export function saveSelection(m){ sessionStorage.setItem('selectedMatch', JSON.stringify(m)); }
export function getSelection(){ try{ return JSON.parse(sessionStorage.getItem('selectedMatch')||'null'); }catch{return null;} }


export function renderList(container, matches, onPick){
container.innerHTML='';
const byDay = {};
for(const m of matches){
const k = new Date(m._date.getFullYear(),m._date.getMonth(),m._date.getDate()).toISOString();
(byDay[k] ||= []).push(m);
}
const keys=Object.keys(byDay).sort((a,b)=> new Date(a)-new Date(b));
for(const k of keys){
const d=new Date(k);
const sec=document.createElement('div'); sec.className='day-section';
sec.innerHTML=`<div class="day-head"><div class="day-title">${U.fmtDate(d)}</div><div class="day-sub">${byDay[k].length} match${byDay[k].length>1?'s':''}</div></div>`;
const list=document.createElement('div'); list.className='list';
byDay[k].forEach(m=>{
const s1=(m.eq1score!==''&&m.eq1score!=null)?Number(m.eq1score):null;
const s2=(m.eq2score!==''&&m.eq2score!=null)?Number(m.eq2score):null;
const btn=document.createElement('button'); btn.type='button'; btn.className='match-card';
btn.innerHTML=`
<div class="time-col">
<div class="time-box">${U.fmtTime(m._date)}</div>
<div class="code-chip">${m.match_id}</div>
</div>
<div class="teams">
<div class="team-row"><div class="team-name">${m.equipe1}</div><div class="team-score">${s1??''}</div></div>
<div class="team-row"><div class="team-name">${m.equipe2}</div><div class="team-score">${s2??''}</div></div>
<div class="meta-line">${(m.categorie||m.genre||m.championnat)?`<span class="meta-cat">${[m.categorie,m.genre,m.championnat].filter(Boolean).join(' ')}</span>`:''}</div>
<div class="meta-line">${(m.ville||m.gymnase)?`<span class="meta-place">${[m.ville,m.gymnase].filter(Boolean).join(' · ')}</span>`:''}</div>
</div>
<div class="right">${m.photo?`<span class="thumb-wrap"><img class="thumb" src="${m.photo}" alt="Photo du match"></span>`:''}</div>`;
btn.addEventListener('click',()=> onPick(m));
list.appendChild(btn);
});
sec.appendChild(list); container.appendChild(sec);
}
}
