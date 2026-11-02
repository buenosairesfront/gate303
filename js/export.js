/* Guardar patterns (en este navegador), exportar la hoja de carga como PNG (descargar o compartir) y bajar el .mid. */
const SAVED='uma303-saved';
const loadSaved=()=>{try{return JSON.parse(localStorage.getItem(SAVED))||[];}catch(e){return [];}};
const storeSaved=a=>{try{localStorage.setItem(SAVED,JSON.stringify(a));}catch(e){}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const snapshot=()=>({len:S.len,steps:S.steps.map(s=>({...s})),P:{...S.P},scale:S.scale,root:S.root,snap:S.snap});
const patternName=()=>$('libNow').textContent.trim();
function renderSaved(){
  const a=loadSaved();
  $('savedList').innerHTML=a.length?a.map((p,i)=>`<li><button class="sv-load" data-i="${i}"><b>${esc(p.name)}</b><small>${p.data.P.bpm} BPM · ${p.data.len} · ${new Date(p.t).toLocaleDateString(LANG)}</small></button><button class="sv-del" data-i="${i}" aria-label="${u('del')}">✕</button></li>`).join(''):`<li class="empty">${u('savedEmpty')}</li>`;
}
function applySnapshot(d){
  S.len=d.len;S.steps=d.steps.map(s=>({...s}));S.P={...DEF,...d.P};
  if(d.scale!=null)S.scale=d.scale;if(d.root!=null)S.root=d.root;S.snap=!!d.snap;S.sel=0;
  KNOBS.forEach(([k])=>updKnob(k));render();
}
$('ex').addEventListener('click',renderSaved);
$('saveBtn').addEventListener('click',()=>{
  const a=loadSaved(),name=$('saveName').value.trim()||fmtS(u('defaultName'),{n:a.length+1});
  a.unshift({name,t:Date.now(),data:snapshot()});storeSaved(a);
  $('saveName').value='';$('libNow').textContent=name;renderSaved();
});
$('saveName').addEventListener('keydown',e=>{e.stopPropagation();if(e.key==='Enter')$('saveBtn').click();});
$('savedList').addEventListener('click',e=>{
  const a=loadSaved(),l=e.target.closest('.sv-load'),d=e.target.closest('.sv-del');
  if(l){const p=a[+l.dataset.i];applySnapshot(p.data);$('libNow').textContent=p.name;if(!S.playing)toggle();}
  if(d&&confirm(fmtS(u('delAsk'),{n:a[+d.dataset.i].name}))){a.splice(+d.dataset.i,1);storeSaved(a);renderSaved();}
});

/* ---------- archivos ---------- */
function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);}
const fileBase=()=>{const n=patternName().normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');return '303-trainer'+(n?'-'+n:'');};

/* MIDI tipo 0: semicorcheas de 24 ticks, gate 50%, ligados alargan, slide = notas superpuestas (legato), accent = velocity 127 */
function midiBlob(){
  derive();
  const L=S.len,T16=24,end=L*T16,ev=[];
  EV.forEach((e,i)=>{if(!e)return;
    const on=i*T16,k=e.end<L?e.end:-1,same=k>=0&&EV[k]&&EV[k].semi===e.semi;
    const off=Math.min(end,on+e.dur*T16+(e.legato?(same?0:4):-T16/2));
    ev.push([on,1,36+e.semi,e.acc?127:90],[off,0,36+e.semi,0]);
  });
  ev.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const vlq=n=>{const b=[n&127];while(n>>=7)b.unshift((n&127)|128);return b;};
  const trk=[],push=(dt,arr)=>trk.push(...vlq(dt),...arr);
  const us=Math.round(60e6/S.P.bpm),nm=[...new TextEncoder().encode(patternName()||'303 Trainer')];
  push(0,[0xFF,0x03,nm.length,...nm]);
  push(0,[0xFF,0x51,3,us>>16&255,us>>8&255,us&255]);
  push(0,[0xFF,0x58,4,4,2,24,8]);
  let t=0;for(const [tk,on,n,v] of ev){push(tk-t,[on?0x90:0x80,n,v]);t=tk;}
  push(Math.max(0,end-t),[0xFF,0x2F,0]);
  const n=trk.length;
  return new Blob([new Uint8Array([0x4D,0x54,0x68,0x64,0,0,0,6,0,0,0,1,0,96,0x4D,0x54,0x72,0x6B,n>>>24&255,n>>16&255,n>>8&255,n&255,...trk])],{type:'audio/midi'});
}

/* ---------- hoja de carga en PNG (1080 px de ancho) ---------- */
/* logo U-MA (el mismo del Norns Sound Creator) dibujado en el canvas, para que use las fuentes de la página */
function drawUma(g,x,y,w){
  const k=w/330;g.save();g.translate(x,y);g.scale(k,k);g.lineJoin='round';
  const poly=(pts,fill)=>{g.beginPath();pts.forEach(([a,b],i)=>i?g.lineTo(a,b):g.moveTo(a,b));g.closePath();g.fillStyle=fill;g.fill();g.lineWidth=3;g.strokeStyle='#161616';g.stroke();};
  poly([[36,6],[14,28],[14,206],[36,184]],'#a9aaa7');
  poly([[36,184],[14,206],[300,206],[322,184]],'#b4b5b2');
  g.fillStyle='#161616';g.fillRect(36,6,286,178);
  g.fillStyle='#EAEAE7';g.fillRect(45,14,268,114);
  g.font='800 116px "Barlow Condensed",sans-serif';g.textAlign='center';g.textBaseline='alphabetic';g.fillStyle='#161616';
  const tw=g.measureText('U-MA').width;g.save();g.translate(179,113);g.scale(248/tw,1);g.fillText('U-MA',0,0);g.restore();
  for(const [c,xx] of [['#D12F7D',45],['#2A9EBF',85],['#E1C43B',125]]){g.fillStyle=c;g.fillRect(xx,136,36,40);g.lineWidth=2;g.strokeStyle='#161616';g.strokeRect(xx,136,36,40);}
  g.fillStyle='#EAEAE7';g.fillRect(166,136,147,40);
  g.font='900 27px "Noto Sans JP","Hiragino Sans","Yu Gothic",sans-serif';g.fillStyle='#161616';
  if('letterSpacing' in g)g.letterSpacing='2px';g.fillText('サウンド',239.5,165);if('letterSpacing' in g)g.letterSpacing='0px';
  g.restore();
}
async function sheetBlob(){
  await Promise.all(['800 116px "Barlow Condensed"','900 27px "Noto Sans JP"','700 40px Poppins'].map(f=>document.fonts.load(f,'U-MA サウンド').catch(()=>{})));await document.fonts.ready;derive();
  const st=steps(),L=S.len,W=1080,M=56,IW=W-2*M,INK='#0b2a4f',MUT='#5a6a80',WELL='#0b2a4f',LO='#c8bc93';
  const cv=document.createElement('canvas');cv.width=W;cv.height=4200;const g=cv.getContext('2d');
  const CF=(w,s)=>`${w} ${s}px Poppins,"Arial Narrow",sans-serif`,MF=(w,s)=>`${w} ${s}px "IBM Plex Mono",Menlo,monospace`;
  const sp=v=>{if('letterSpacing' in g)g.letterSpacing=v+'px';};
  const rr=(x,y,w,h,r,fill,stroke,dash)=>{g.beginPath();g.roundRect?g.roundRect(x,y,w,h,r):g.rect(x,y,w,h);if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.setLineDash(dash||[]);g.strokeStyle=stroke;g.lineWidth=2;g.stroke();g.setLineDash([]);}};
  const text=(t,x,y,font,col,align='left')=>{g.font=font;g.fillStyle=col;g.textAlign=align;g.textBaseline='alphabetic';g.fillText(t,x,y);};
  const wrap=(t,x,y,maxW,lh,font,col)=>{g.font=font;let line='',yy=y;for(const w of t.split(' ')){const tr=line?line+' '+w:w;if(g.measureText(tr).width>maxW&&line){text(line,x,yy,font,col);line=w;yy+=lh;}else line=tr;}if(line){text(line,x,yy,font,col);yy+=lh;}return yy;};
  g.fillStyle='#f7efd3';g.fillRect(0,0,W,cv.height);

  // borde superior: banda blanca con logo chico, título a su lado y fecha; franja de colores fina debajo
  const HB=124;g.fillStyle='#fbf6e4';g.fillRect(0,0,W,HB);
  drawUma(g,M,30,100);
  g.fillStyle='#d9cda6';g.fillRect(M+124,34,2,56);
  sp(2);text('303 TRAINER',M+148,70,CF(700,40),INK);
  sp(5);text(u('sheetTitle').toUpperCase(),M+148,96,CF(600,17),MUT);sp(0);
  sp(1);text(new Date().toLocaleDateString(LANG,{year:'numeric',month:'short',day:'numeric'}).toUpperCase(),W-M,70,MF(500,15),MUT,'right');
  text(`${S.P.bpm} BPM`,W-M,96,MF(600,15),INK,'right');sp(0);
  g.fillStyle='#d9cda6';g.fillRect(0,HB,W,1);
  [COL.acc,COL.sl,COL.tie].forEach((c,i)=>{g.fillStyle=c;g.fillRect(i*W/3,HB+1,W/3+1,5);});
  let y=HB+86;

  // nombre y datos
  y=wrap(patternName()||'—',M,y,IW,50,CF(700,48),INK);
  const info=[`${S.P.bpm} BPM`,S.P.wave>=.5?'SQR':'SAW',`${L} ${u('steps').toUpperCase()}`];
  if(S.snap)info.push(`${NAMES[S.root]} ${SCALES[S.scale][0]}`);
  sp(1);text(info.join('  ·  '),M,y+2,MF(500,18),MUT);sp(0);y+=28;
  let x=M;
  for(const [k,l] of KNOBS){const v=String(k==='tune'?kfmt(k):Math.round(S.P[k]*100));
    sp(1);g.font=CF(700,14);const lw=g.measureText(l).width;sp(0);g.font=MF(600,16);const tw=lw+g.measureText(v).width+36;
    if(x+tw>W-M){x=M;y+=38;}rr(x,y,tw,30,15,'#efe4bf');sp(1);text(l,x+12,y+20,CF(700,14),MUT);sp(0);text(v,x+tw-12,y+21,MF(600,16),INK,'right');x+=tw+6;}
  y+=54;

  // visor
  const used=EV.filter(Boolean).map(e=>e.semi);let lo=used.length?Math.min(...used):0,hi=used.length?Math.max(...used):12;
  if(hi-lo<12){const m=(hi+lo)/2;lo=Math.floor(m-6);hi=Math.ceil(m+6);}lo-=1;hi+=1;
  const RH=Math.min(14,Math.floor(200/(hi-lo+1))),VH=(hi-lo+1)*RH+28,cw=(IW-28)/L,vx=M+14,vy=y+14;
  rr(M,y,IW,VH,16,WELL);
  for(let i=0;i<=L;i++){g.fillStyle=i%4?'#1d3c63':'#35577f';g.fillRect(vx+i*cw,vy,1.5,VH-28);}
  for(let m=lo;m<=hi;m++)if(((m%12)+12)%12===0){const yy=vy+(hi-m)*RH+RH/2;g.strokeStyle=m===0?'#f7efd3':'#2b4a72';g.lineWidth=m===0?2:1;g.setLineDash(m===0?[2,6]:[]);g.beginPath();g.moveTo(vx,yy);g.lineTo(vx+L*cw,yy);g.stroke();g.setLineDash([]);
    if(m===0)text('C',vx-10,yy+5,MF(600,13),'#f7efd3','right');}
  EV.forEach((e,i)=>{if(!e)return;const yy=vy+(hi-e.semi)*RH+1;
    rr(vx+i*cw+2,yy,(e.dur>1?cw:cw-4)-2,RH-2,3,e.acc?COL.acc:'#f7efd3');
    for(let j=i+1;j<i+e.dur;j++)rr(vx+j*cw,yy+2,cw-(j===i+e.dur-1?4:0),RH-6,2,COL.tie);
    if(e.legato){const k=e.end<L?e.end:-1;if(k>=0&&EV[k]){const y2=vy+(hi-EV[k].semi)*RH+RH/2;g.strokeStyle=COL.sl;g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(vx+e.end*cw-cw*.2,yy+RH/2-1);g.lineTo(vx+e.end*cw+cw*.2,y2);g.stroke();}}
  });
  y+=VH+22;

  // 16 pasos
  const sw=(IW-(L-1)*6)/L,TT={note:'DOWN',tie:'UP',rest:'ACCENT'};
  for(let i=0;i<L;i++){const s=st[i],sx=M+i*(sw+6);
    rr(sx,y,sw,108,10,s.type==='rest'?'transparent':'#fff',LO,s.type==='rest'?[5,4]:null);
    text(String(i+1),sx+sw/2,y+22,MF(600,15),MUT,'center');
    const bc=s.type==='note'?(s.acc?COL.acc:WELL):s.type==='tie'?COL.tie:null;
    if(bc){rr(sx+5,y+32,sw-10,32,6,bc);text(s.type==='note'?nm(s):'~',sx+sw/2,y+55,MF(600,s.type==='note'&&nm(s).length>2?14:17),s.type==='tie'?INK:'#fff','center');}
    else text('·',sx+sw/2,y+56,MF(600,20),MUT,'center');
    if(s.type==='note'&&s.slide){rr(sx+sw/2-14,y+70,28,14,4,COL.sl);text('S',sx+sw/2,y+82,MF(700,11),INK,'center');}
    text(TT[s.type],sx+sw/2,y+100,CF(700,13),MUT,'center');
  }
  y+=172;

  // secuencia botón a botón
  const capW=(l,f)=>{g.font=f;return Math.max(44,g.measureText(l).width+24);};
  const cap=(cx,cy,l,kind,sub)=>{const f=MF(600,18),w=capW(l,f),h=44;
    const st={key:['#fff',LO,INK],mod:['#efe4bf',LO,INK],acc:[COL.acc,COL.acc,'#fff'],sl:[COL.sl,COL.sl,INK],tap:[WELL,WELL,'#fff'],fn:[WELL,WELL,'#fff'],n:[WELL,WELL,'#fff'],t:[COL.tie,COL.tie,INK],r:['#fff',LO,INK]}[kind];
    rr(cx,cy,w,h,8,st[0],st[1],kind==='r'?[5,4]:null);text(l,cx+w/2,cy+29,f,st[2],'center');return w;};
  const head=(n,t,y0)=>{text(String(n).padStart(2,'0'),M,y0,MF(600,16),COL.acc);sp(3);text(t,M+48,y0,CF(700,26),INK);g.font=CF(700,26);const tw=g.measureText(t).width;sp(0);g.fillStyle='#d9cda6';g.fillRect(M+48+tw+18,y0-9,W-M-(M+48+tw+18),1);return y0+10;};
  g.fillStyle=INK;g.fillRect(M,y-30,IW,2);sp(4);text(u('seqTitle').toUpperCase(),M,y+6,CF(700,22),INK);sp(0);y+=44;
  y=head(1,'PATTERN WRITE',y+20);y=wrap(u('seqSetup'),M+48,y+14,IW-48,30,'500 22px system-ui,sans-serif',MUT)+14;
  y=head(2,'PITCH MODE',y+20);y=wrap(fmtS(u('seqPitch'),{k:EV.filter(Boolean).length}),M+48,y+14,IW-48,30,'500 22px system-ui,sans-serif',MUT)+4;
  x=M+48;let k=0;
  for(let i=0;i<L;i++){const s=st[i];if(s.type!=='note')continue;k++;
    const parts=[[NAMES[s.pitch],'key']];if(s.oct<0)parts.push(['DOWN','mod']);if(s.oct>0)parts.push(['UP','mod']);if(s.acc)parts.push(['ACCENT','acc']);if(s.slide)parts.push(['SLIDE','sl']);parts.push(['TAP','tap']);
    const lw=34+parts.reduce((a,[l])=>a+capW(l,MF(600,18))+6,0)+10;
    if(x+lw>W-M){x=M+48;y+=58;}
    rr(x,y,lw-6,52,10,'#efe4bf');text(String(k),x+16,y+33,MF(600,15),MUT,'center');
    let cx=x+32;for(const [l,kd] of parts)cx+=cap(cx,y+4,l,kd)+6;x+=lw+4;
  }
  y+=100;
  y=head(3,'TIME MODE',y);y=wrap(fmtS(u('seqTime'),{L}),M+48,y+14,IW-48,30,'500 22px system-ui,sans-serif',MUT)+4;
  const per=8,tw=(IW-48-(per-1)*8)/per;
  for(let i=0;i<L;i++){const s=st[i],cx=M+48+(i%per)*(tw+8),cy=y+Math.floor(i/per)*72,kd={note:'n',tie:'t',rest:'r'}[s.type];
    const c={n:[WELL,'#fff'],t:[COL.tie,INK],r:['#fff',INK]}[kd];
    rr(cx,cy,tw,62,8,c[0],kd==='n'?WELL:kd==='t'?COL.tie:LO,kd==='r'?[5,4]:null);
    text(String(i+1),cx+tw/2,cy+22,MF(600,14),kd==='n'?'#a9b8cc':MUT,'center');text(TT[s.type],cx+tw/2,cy+48,MF(700,17),c[1],'center');}
  y+=Math.ceil(L/per)*72+30;
  y=head(4,'PATTERN PLAY',y+10);y=wrap(u('seqPlay'),M+48,y+14,IW-48,30,'500 22px system-ui,sans-serif',MUT)+20;

  // pie
  g.fillStyle='#d9cda6';g.fillRect(M,y,IW,1);y+=36;
  y=wrap(u('sheetNote'),M,y,IW,24,'500 16px system-ui,sans-serif',MUT);
  y+=14;drawUma(g,M,y-10,40);
  sp(2);text('303 TRAINER',M+50,y+15,CF(700,18),INK);sp(0);text('buenosairesfront.github.io/acid303',W-M,y+15,MF(500,14),MUT,'right');
  y+=52;
  const out=document.createElement('canvas');out.width=W;out.height=Math.ceil(y);out.getContext('2d').drawImage(cv,0,0);
  return new Promise(ok=>out.toBlob(ok,'image/png'));
}
async function busy(btn,fn){btn.disabled=true;try{await fn();}catch(e){console.error(e);}btn.disabled=false;}
$('pngBtn').addEventListener('click',e=>busy(e.currentTarget,async()=>download(await sheetBlob(),fileBase()+'.png')));
$('shareBtn').addEventListener('click',e=>busy(e.currentTarget,async()=>{
  const blob=await sheetBlob(),file=new File([blob],fileBase()+'.png',{type:'image/png'});
  if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'303 Trainer'});}catch(err){}}
  else download(blob,file.name);
}));
$('midBtn').addEventListener('click',()=>download(midiBlob(),fileBase()+'.mid'));
