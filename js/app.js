/* Escritura 303: elegís un paso, le das tipo de tiempo (nota, ligado, silencio), altura y modificadores; TAP avanza.
   Arriba las perillas de sonido (motor en js/worklet.js); abajo la hoja de carga para la TB-303 real. */
const NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B',"C'"];
const KEYMAP='awsedftgyhujk';
const DEF={tune:.5,cutoff:.42,reso:.62,envmod:.55,decay:.4,accent:.65,wave:0,vol:.75,bpm:124};
const KNOBS=[['tune','TUNE'],['cutoff','CUTOFF'],['reso','RESO'],['envmod','ENV MOD'],['decay','DECAY'],['accent','ACCENT'],['vol','VOLUME']];
const STORE='uma303-v2';
const COL={acc:'#d12f7d',sl:'#2a9ebf',tie:'#e1c43b'};
const blank=()=>({type:'rest',pitch:0,oct:0,acc:false,slide:false});
function example(){
  const n=(p,o=0,a=false,s=false)=>({type:'note',pitch:p,oct:o,acc:a,slide:s});
  const t=()=>({...blank(),type:'tie'}),r=()=>blank();
  return [n(0,0,true),n(0,1,false,true),n(3),t(),n(0),r(),n(7,-1,true),n(10,-1,false,true),
          n(0),t(),r(),n(3,1,true),n(5,0,false,true),n(7),r(),n(12)];
}
let S={len:16,sel:0,steps:example(),P:{...DEF},playing:false,auto:true,scale:11,root:0,snap:false,arm:{down:false,up:false,acc:false,slide:false}};
try{const d=JSON.parse(localStorage.getItem(STORE));if(d&&d.steps&&d.steps.length===16){S.len=d.len;S.steps=d.steps;S.P={...DEF,...d.P};if(d.auto===false)S.auto=false;if(d.scale>=0&&d.scale<SCALES.length)S.scale=d.scale;if(d.root>=0&&d.root<12)S.root=d.root;S.snap=!!d.snap;}}catch(e){}
function save(){try{localStorage.setItem(STORE,JSON.stringify({len:S.len,steps:S.steps,P:S.P,auto:S.auto,scale:S.scale,root:S.root,snap:S.snap}));}catch(e){}}

const $=id=>document.getElementById(id);
const u=k=>T.ui[k];
const fmtS=(s,o)=>s.replace(/\{(\w+)\}/g,(_,k)=>o[k]);
const nm=s=>NAMES[s.pitch]+(s.oct>0?'↑':s.oct<0?'↓':'');

/* encadenar a escala: la altura guardada no cambia; lo que suena y se muestra es la nota de la escala más cercana (empate: abajo) */
const inScale=semi=>SCALES[S.scale][1].includes(((semi-S.root)%12+12)%12);
const fromSemi=q=>q<0?{pitch:q+12,oct:-1}:q>12?{pitch:q-12,oct:1}:{pitch:q,oct:0};
function snapSemi(q){for(let d=0;d<12;d++){if(q-d>=-12&&inScale(q-d))return q-d;if(q+d<=24&&inScale(q+d))return q+d;}return q;}
const eff=s=>!S.snap||s.type!=='note'?s:{...s,...fromSemi(snapSemi(s.pitch+12*s.oct))};
const steps=()=>S.steps.map(eff);

/* qué suena en cada paso: dueño de cada ligado, duración de cada nota y si entra deslizando */
let EV=[];
function derive(){
  const L=S.len,st=steps();EV=new Array(L).fill(null);
  const owner=new Array(L).fill(-1);let last=-1;
  for(let i=0;i<L;i++){const s=st[i];if(s.type==='note'){last=i;owner[i]=i;}else if(s.type==='tie')owner[i]=last;else last=-1;}
  for(let i=0;i<L;i++){
    const s=st[i];if(s.type!=='note')continue;
    let j=i+1,d=1;while(j<L&&st[j].type==='tie'){d++;j++;}
    const nxt=st[j<L?j:0];
    EV[i]={semi:s.pitch+12*s.oct,acc:s.acc,dur:d,legato:s.slide&&nxt.type==='note',slideIn:false,end:j};
  }
  for(let i=0;i<L;i++){if(!EV[i])continue;const e=EV[i],k=e.end<L?e.end:0;if(e.legato&&EV[k])EV[k].slideIn=true;}
  return owner;
}
function sync(){
  Engine.set({pattern:steps().slice(0,S.len).map(s=>({t:s.type==='note'?'n':s.type==='tie'?'t':'r',n:s.pitch,o:s.oct,a:s.acc,s:s.slide})),params:{...S.P}});
}

/* ---------- render ---------- */
function render(){
  const owner=derive(),L=S.len,st=steps();
  $('len').textContent=L;$('bpm').textContent=S.P.bpm;
  document.querySelectorAll('#wave button').forEach(b=>b.classList.toggle('on',+b.dataset.w===(S.P.wave>=.5?1:0)));
  let h='';
  for(let i=0;i<16;i++){
    const s=st[i],off=i>=L,own=owner[i];
    const nextTie=i+1<L&&st[i+1].type==='tie'&&(s.type==='note'||(s.type==='tie'&&own>=0));
    let cls='cell '+s.type,blk='',fl='';
    if(s.type==='note'){blk=nm(s);if(s.acc)cls+=' acc';if(nextTie)cls+=' tn';if(s.acc)fl+='<i class="f-a">A</i>';if(s.slide)fl+='<i class="f-s">S</i>';}
    else if(s.type==='tie'){if(own<0){cls+=' dead';blk='—';}else{blk='~';if(nextTie)cls+=' tn';}}
    else blk='·';
    if(off)cls+=' off';if(i===S.sel)cls+=' sel';
    h+=`<button class="${cls}" data-i="${i}" aria-label="${fmtS(u('stepAria'),{n:i+1})}"><span class="num">${i+1}</span><span class="led"></span><span class="blk">${blk}</span><span class="flags">${fl}</span></button>`;
  }
  $('grid').innerHTML=h;
  // piano roll: rango automático alrededor de las notas usadas
  const used=EV.filter(Boolean).map(e=>e.semi);
  let lo=used.length?Math.min(...used):0,hi=used.length?Math.max(...used):12;
  if(hi-lo<12){const m=(hi+lo)/2;lo=Math.floor(m-6);hi=Math.ceil(m+6);}
  lo-=1;hi+=1;const rows=hi-lo+1,W=L*20,H=rows*10;
  let r=`<rect id="ph" x="-20" y="0" width="20" height="${H}" fill="#fff" opacity=".12"/>`;
  for(let i=0;i<=L;i++)r+=`<line x1="${i*20}" x2="${i*20}" y1="0" y2="${H}" stroke="${i%4?'#1d3c63':'#35577f'}" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
  // los Do: el central (C de la octava normal) punteado y claro, el resto finos
  for(let m=lo;m<=hi;m++)if(((m%12)+12)%12===0)r+=m===0?`<line x1="0" x2="${W}" y1="${(hi-m)*10+5}" y2="${(hi-m)*10+5}" stroke="#f7efd3" stroke-width="1.5" stroke-dasharray="1 4" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`:`<line x1="0" x2="${W}" y1="${(hi-m)*10+5}" y2="${(hi-m)*10+5}" stroke="#2b4a72" vector-effect="non-scaling-stroke"/>`;
  r+=`<rect x="${S.sel*20}" y="0" width="20" height="${H}" fill="none" stroke="#ee6c14" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`;
  EV.forEach((e,i)=>{if(!e)return;const y=(hi-e.semi)*10+1;
    r+=`<rect x="${i*20+1.5}" y="${y}" width="${e.dur>1?18.5:17}" height="8" rx="2" fill="${e.acc?COL.acc:'#f7efd3'}"/>`;
    for(let j=i+1;j<i+e.dur;j++)r+=`<rect x="${j*20}" y="${y+1}" width="${j===i+e.dur-1?18.5:20}" height="6" rx="1.5" fill="${COL.tie}"/>`;
    if(e.legato){const k=e.end<L?e.end:-1;if(k>=0&&EV[k]){const y2=(hi-EV[k].semi)*10+5;
      r+=`<line x1="${e.end*20-3}" y1="${y+4}" x2="${e.end*20+3}" y2="${y2}" stroke="${COL.sl}" stroke-width="2.5" vector-effect="non-scaling-stroke"/>`;}}
  });
  const sv=$('roll');sv.setAttribute('viewBox',`0 0 ${W} ${H}`);sv.innerHTML=r;
  const cm=$('cmark');if(hi>=0&&lo<=0){cm.hidden=false;cm.style.top=((hi*10+5)/H*100)+'%';}else cm.hidden=true;
  // editor
  const cur=st[S.sel],isN=cur.type==='note';
  $('selN').textContent=S.sel+1;
  $('selInfo').textContent=isN?fmtS(u('infoNote'),{n:nm(cur)})+(cur.acc?u('infoAcc'):'')+(cur.slide?u('infoSlide'):''):cur.type==='tie'?(owner[S.sel]<0?u('infoTieDead'):u('infoTie')):u('infoRest');
  document.querySelectorAll('.tb').forEach(b=>b.classList.toggle('on',b.dataset.t===cur.type));
  $('mods').classList.toggle('dis',!isN&&!S.auto);
  const on=!editing()?S.arm:{down:isN&&cur.oct<0,up:isN&&cur.oct>0,acc:isN&&cur.acc,slide:isN&&cur.slide};
  $('auto').classList.toggle('on',S.auto);$('auto').setAttribute('aria-pressed',S.auto);
  document.querySelectorAll('.mb[data-m]').forEach(b=>b.classList.toggle('on',on[b.dataset.m]));
  document.querySelectorAll('#kbd [data-p]').forEach(k=>{const p=+k.dataset.p,ins=inScale(p);
    k.classList.toggle('on',isN&&p===cur.pitch);k.classList.toggle('ins',ins);k.classList.toggle('out',S.snap&&!ins);k.classList.toggle('rt',((p-S.root)%12+12)%12===0);});
  $('snap').classList.toggle('on',S.snap);$('snap').setAttribute('aria-pressed',S.snap);
  $('scaleSel').value=S.scale;$('rootSel').value=S.root;
  renderSheet();
  sync();save();
  if(S.playing&&shown>=0)showStep(shown);
}

/* ---------- hoja de carga: pasos con su tiempo y la secuencia literal, botón por botón ---------- */
let done=new Set(),doneSig='';
function renderSheet(){
  const L=S.len,st=steps();
  const sig=JSON.stringify([L,st.slice(0,L)]);if(sig!==doneSig){done.clear();doneSig=sig;}
  const T3={note:'DOWN',tie:'UP',rest:'ACCENT'},G={note:'n',tie:'t',rest:'r'};
  let t='',k=0,id=0,lines='',caps='';
  const cap=(l,c,sub='')=>{const i=id++;return `<button class="cap c-${c}${done.has(i)?' done':''}" data-c="${i}">${sub?`<small>${sub}</small>`:''}${l}</button>`;};
  for(let i=0;i<L;i++){const s=st[i];
    if(s.type==='note'){k++;
      lines+=`<div class="line" data-i="${i}"><span class="ix">${k}</span>${cap(NAMES[s.pitch],'key')}${s.oct<0?cap('DOWN','mod'):''}${s.oct>0?cap('UP','mod'):''}${s.acc?cap('ACCENT','acc'):''}${s.slide?cap('SLIDE','mod'):''}${cap('TAP','tap')}</div>`;}
    t+=`<div class="sc t-${s.type}${s.type==='note'&&s.acc?' acc':''}" data-i="${i}"><span class="n">${i+1}</span><i class="g g-${G[s.type]}"></i><span class="v">${s.type==='note'?nm(s):''}</span><span class="k">${T3[s.type]}</span></div>`;
  }
  const pm=cap('PITCH MODE','fn');
  const body=lines;
  const tm=cap('TIME MODE','fn');
  for(let i=0;i<L;i++){const ty=st[i].type;caps+=cap(T3[ty],'t-'+ty,i+1);}
  $('timeList').innerHTML=t;
  $('tc').textContent=fmtS(u('tcCount'),{L,k});
  $('seq').innerHTML=`
    <li><span class="nb">1</span><span class="txt">${u('seqSetup')}</span></li>
    <li><span class="nb">2</span><div class="seqbody"><div class="caps">${pm}<span class="txt">${fmtS(u('seqPitch'),{k})}</span></div><div class="caps">${body||`<span class="txt">${u('noNotes')}</span>`}</div></div></li>
    <li><span class="nb">3</span><div class="seqbody"><div class="caps">${tm}<span class="txt">${fmtS(u('seqTime'),{L})}</span></div><div class="timecaps">${caps}</div></div></li>
    <li><span class="nb">4</span><span class="txt">${u('seqPlay')}</span></li>`;
  $('prog').textContent=`${done.size}/${id}`;
}

/* ---------- teclado ---------- */
(function(){
  const whites=[0,2,4,5,7,9,11,12],blacks=[[1,1],[3,2],[6,4],[8,5],[10,6]],w=100/8;
  let h='';
  whites.forEach((p,i)=>h+=`<button class="kw" data-p="${p}" style="left:${i*w}%;width:${w}%">${NAMES[p]}<kbd>${KEYMAP[p].toUpperCase()}</kbd></button>`);
  blacks.forEach(([p,pos])=>h+=`<button class="kb" data-p="${p}" style="left:${pos*w-w*.32}%;width:${w*.64}%"><kbd>${KEYMAP[p].toUpperCase()}</kbd></button>`);
  $('kbd').innerHTML=h;
})();

/* ---------- perillas de sonido ---------- */
const KA=v=>(-135+270*v)*Math.PI/180;
const kp=(a,r)=>`${(30+r*Math.sin(a)).toFixed(2)} ${(30-r*Math.cos(a)).toFixed(2)}`;
const karc=(v0,v1,r)=>v1-v0<.003?'':`M${kp(KA(v0),r)}A${r} ${r} 0 ${(v1-v0)*270>180?1:0} 1 ${kp(KA(v1),r)}`;
function kset(k,v){
  v=Math.max(0,Math.min(1,v));
  if(k==='tune')v=Math.round((v-.5)*24)/24+.5;
  S.P[k]=v;Engine.set({params:{...S.P}});updKnob(k);save();
}
function kfmt(k){const v=S.P[k];return k==='tune'?((v>.5?'+':'')+Math.round((v-.5)*24)):Math.round(v*100);}
function renderKnobs(){
  $('knobs').innerHTML=KNOBS.map(([k,l])=>`<div class="knob" data-k="${k}" tabindex="0" role="slider" aria-label="${l}" aria-valuemin="0" aria-valuemax="100">
    <svg viewBox="0 0 60 60" aria-hidden="true"><path class="kt" d="${karc(0,1,25)}"/><path class="kv"/><circle class="kbody" cx="30" cy="30" r="18"/><line class="kp" x1="30" y1="30"/></svg><b>${l}</b><span class="kval"></span></div>`).join('');
  document.querySelectorAll('.knob').forEach(el=>{
    const k=el.dataset.k;
    el.addEventListener('pointerdown',e=>{
      e.preventDefault();el.setPointerCapture(e.pointerId);
      const y0=e.clientY,v0=S.P[k];
      el.onpointermove=ev=>kset(k,v0+(y0-ev.clientY)/(ev.shiftKey?600:160));
      el.onpointerup=el.onpointercancel=()=>{el.onpointermove=null;};
    });
    el.addEventListener('dblclick',()=>kset(k,DEF[k]));
    el.addEventListener('wheel',e=>{e.preventDefault();kset(k,S.P[k]-Math.sign(e.deltaY)*.02);},{passive:false});
    el.addEventListener('keydown',e=>{const d={ArrowUp:.02,ArrowRight:.02,ArrowDown:-.02,ArrowLeft:-.02}[e.key];if(d){e.preventDefault();e.stopPropagation();kset(k,S.P[k]+d);}});
    updKnob(k);
  });
}
function updKnob(k){
  const el=document.querySelector(`.knob[data-k="${k}"]`);if(!el)return;
  const v=S.P[k],a=KA(v);
  el.querySelector('.kv').setAttribute('d',karc(0,v,25));
  const pl=el.querySelector('.kp');pl.setAttribute('x2',30+14*Math.sin(a));pl.setAttribute('y2',30-14*Math.cos(a));
  el.querySelector('.kval').textContent=kfmt(k);
  el.setAttribute('aria-valuenow',Math.round(v*100));
}

/* ---------- transporte y osciloscopio ---------- */
let shown=-1;
const buf=new Float32Array(2048);
function showStep(i){
  document.querySelectorAll('.cell.playing,.now').forEach(c=>c.classList.remove('playing','now'));
  const c=document.querySelector(`.cell[data-i="${i}"]`);if(c)c.classList.add('playing');
  const ph=$('ph');if(ph)ph.setAttribute('x',i<0?-20:i*20);
  if(i<0)return;
  const sc=document.querySelector(`.sc[data-i="${i}"]`);if(sc)sc.classList.add('now');
  const tc=document.querySelectorAll('.timecaps .cap')[i];if(tc)tc.classList.add('now');
}
function frame(){
  requestAnimationFrame(frame);
  if(!Engine.ctx)return;
  const c=Engine.step();
  if(S.playing&&c&&c.step>=0&&c.step!==shown){shown=c.step;showStep(shown);}
  const cv=$('scope'),g=cv.getContext('2d'),w=cv.width,h=cv.height;
  Engine.an.getFloatTimeDomainData(buf);
  let z=0;for(let i=1;i<1024;i++)if(buf[i-1]<0&&buf[i]>=0){z=i;break;}
  g.clearRect(0,0,w,h);g.strokeStyle='#e1c43b';g.lineWidth=1.5*devicePixelRatio;g.beginPath();
  for(let x=0;x<w;x++){const v=buf[z+Math.floor(x/w*1000)]||0,y=h/2-v*h*.45;x?g.lineTo(x,y):g.moveTo(x,y);}
  g.stroke();
}
function sizeScope(){const cv=$('scope');if(!cv)return;const r=cv.getBoundingClientRect();cv.width=Math.max(1,r.width*devicePixelRatio);cv.height=Math.max(1,r.height*devicePixelRatio);}
function toggle(){
  if(S.playing){S.playing=false;Engine.send({play:false});Engine.reset();shown=-1;showStep(-1);playUI();return;}
  Engine.init().then(()=>{sync();S.playing=true;Engine.reset();Engine.send({play:true});playUI();}).catch(()=>alert(u('audioErr')));
}
function playUI(){$('play').classList.toggle('on',S.playing);$('playTxt').textContent=S.playing?u('stop'):u('play');}
function preview(){
  const s=eff(S.steps[S.sel]);if(s.type!=='note'||S.playing)return;
  Engine.init().then(()=>{sync();Engine.send({audition:{n:s.pitch,o:s.oct,a:s.acc}});}).catch(()=>{});
}

/* ---------- eventos ---------- */
const advance=()=>{S.sel=(S.sel+1)%S.len;S.picked=false;};
/* Con avance automático, DOWN/UP/ACC/SLIDE se arman antes de la tecla y la tecla escribe y avanza (TAP queda opcional).
   Sin él, funciona como la 303: tecla, modificadores y TAP. */
const setType=t=>{const s=S.steps[S.sel];s.type=t;if(t==='note'&&!S.auto){render();preview();}else{if(t==='note')preview();advance();render();}};
/* Con avance auto, si elegiste a mano un paso que ya es nota (clic en la grilla, flechas o la hoja), los modificadores
   editan esa nota; si el cursor llegó solo, se arman para la próxima tecla. */
const editing=()=>!S.auto||(S.picked&&S.steps[S.sel].type==='note');
const pick=i=>{S.sel=i;S.picked=true;};
const setMod=m=>{
  if(!editing()){const a=S.arm;a[m]=!a[m];if(m==='up'&&a.up)a.down=false;if(m==='down'&&a.down)a.up=false;render();return;}
  const s=S.steps[S.sel];if(s.type!=='note')return;
  if(m==='up')s.oct=s.oct>0?0:1;else if(m==='down')s.oct=s.oct<0?0:-1;else s[m]=!s[m];render();preview();};
const setPitch=p=>{
  const s=S.steps[S.sel],a=S.arm,keep=S.auto&&editing();
  const o=S.auto&&!keep?(a.up?1:a.down?-1:0):(s.type==='note'?s.oct:0);
  s.type='note';Object.assign(s,S.snap?fromSemi(snapSemi(p+12*o)):{pitch:p,oct:o});
  if(!S.auto){render();preview();return;}
  if(!keep)Object.assign(s,{acc:a.acc,slide:a.slide});
  S.arm={down:false,up:false,acc:false,slide:false};preview();advance();render();
};
$('grid').addEventListener('click',e=>{const c=e.target.closest('.cell');if(!c)return;pick(+c.dataset.i);render();preview();});
document.querySelectorAll('.tb').forEach(b=>b.addEventListener('click',()=>setType(b.dataset.t)));
document.querySelectorAll('.mb[data-m]').forEach(b=>b.addEventListener('click',()=>setMod(b.dataset.m)));
$('tap').addEventListener('click',()=>{advance();render();});
$('kbd').addEventListener('click',e=>{const k=e.target.closest('[data-p]');if(k)setPitch(+k.dataset.p);});
$('play').addEventListener('click',toggle);
$('lenDn').addEventListener('click',()=>{S.len=Math.max(1,S.len-1);if(S.sel>=S.len)S.sel=S.len-1;render();});
$('lenUp').addEventListener('click',()=>{S.len=Math.min(16,S.len+1);render();});
$('bpmDn').addEventListener('click',()=>{S.P.bpm=Math.max(60,S.P.bpm-2);render();});
$('bpmUp').addEventListener('click',()=>{S.P.bpm=Math.min(200,S.P.bpm+2);render();});
document.querySelectorAll('#wave button').forEach(b=>b.addEventListener('click',()=>{S.P.wave=+b.dataset.w;render();}));
$('scaleSel').innerHTML=SCALES.map(([n],i)=>`<option value="${i}">${n}</option>`).join('');
$('rootSel').innerHTML=NAMES.slice(0,12).map((n,i)=>`<option value="${i}">${n}</option>`).join('');
$('scaleSel').addEventListener('change',e=>{S.scale=+e.target.value;render();});
$('rootSel').addEventListener('change',e=>{S.root=+e.target.value;render();});
$('snap').addEventListener('click',()=>{S.snap=!S.snap;render();});
$('auto').addEventListener('click',()=>{S.auto=!S.auto;S.arm={down:false,up:false,acc:false,slide:false};render();});

/* ---------- biblioteca de 100 líneas ---------- */
function renderLib(){
  $('libList').innerHTML=LIBRARY.map((g,si)=>`<section><h3>${T.scenes[si]}</h3><div class="libg">${g.map((e,k)=>`<button class="libb" data-s="${si}" data-k="${k}">${String(e.num).padStart(2,'0')}</button>`).join('')}</div></section>`).join('');
}
function loadLib(si,k){
  const e=LIBRARY[si][k];
  S.steps=e.steps.map(s=>({...s}));S.len=16;S.sel=0;
  Object.assign(S.P,e.k,{bpm:e.bpm,wave:e.wave});
  KNOBS.forEach(([k])=>updKnob(k));
  $('libNow').textContent=`${T.scenes[si]} · ${String(e.num).padStart(2,'0')}`;
  render();
}
$('ex').addEventListener('click',()=>{renderLib();$('lib').showModal();});
$('libClose').addEventListener('click',()=>$('lib').close());
$('lib').addEventListener('click',e=>{
  if(e.target===$('lib')){$('lib').close();return;}
  const b=e.target.closest('.libb');if(!b)return;
  document.querySelectorAll('.libb.on').forEach(x=>x.classList.remove('on'));b.classList.add('on');
  loadLib(+b.dataset.s,+b.dataset.k);
  if(!S.playing)toggle();
});
$('clr').addEventListener('click',()=>{S.steps=Array.from({length:16},blank);S.sel=0;render();});
$('sheet').addEventListener('click',e=>{
  const cp=e.target.closest('.cap[data-c]');
  if(cp){const i=+cp.dataset.c;done.has(i)?done.delete(i):done.add(i);cp.classList.toggle('done',done.has(i));$('prog').textContent=`${done.size}/${document.querySelectorAll('#seq .cap').length}`;return;}
  const c=e.target.closest('.sc[data-i]');if(c){pick(+c.dataset.i);render();$('grid').scrollIntoView({block:'nearest',behavior:'smooth'});}
});
$('seqReset').addEventListener('click',()=>{done.clear();renderSheet();});
document.addEventListener('keydown',e=>{
  if(e.metaKey||e.ctrlKey||e.altKey||e.repeat||e.target.closest('input,textarea,select,.knob'))return;
  const k=e.key,L=k.toLowerCase(),pi=KEYMAP.indexOf(L);
  if(k===' '){e.preventDefault();toggle();return;}
  if(pi>=0&&L.length===1){e.preventDefault();setPitch(pi);return;}
  if(k==='Enter'){e.preventDefault();advance();render();return;}
  if(k==='ArrowRight'||k==='ArrowLeft'){e.preventDefault();pick((S.sel+(k==='ArrowRight'?1:S.len-1))%S.len);render();preview();return;}
  const m={z:'down',x:'up','1':'acc','2':'slide'}[L];if(m){setMod(m);return;}
  const t={n:'note',l:'tie',r:'rest'}[L];if(t)setType(t);
});
renderKnobs();render();playUI();sizeScope();
addEventListener('resize',sizeScope);
requestAnimationFrame(frame);
