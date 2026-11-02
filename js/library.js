/* Biblioteca: 100 líneas originales generadas al estilo de 10 escenas donde sonó la 303 (10 por escena).
   Son determinísticas (semilla fija) y no son transcripciones de temas. Cada escena trae tempo, onda y perillas. */
const SCENES=[
  {bpm:112,sc:[0,4,7,12,9,5],dens:.7,acc:.1,sl:0,up:.1,dn:.05,tie:.12,root:.45,rep:true,wave:1,k:{cutoff:.55,reso:.3,envmod:.3,decay:.5,accent:.4}},
  {bpm:122,sc:[0,3,5,7,10,12],dens:.75,acc:.3,sl:.25,up:.2,dn:.1,tie:.05,root:.45,rep:false,wave:0,k:{cutoff:.25,reso:.75,envmod:.6,decay:.45,accent:.65}},
  {bpm:125,sc:[0,0,3,7,10,12],dens:.6,acc:.35,sl:.15,up:.25,dn:.05,tie:0,root:.55,rep:true,wave:0,k:{cutoff:.3,reso:.6,envmod:.55,decay:.35,accent:.7}},
  {bpm:120,sc:[0,3,5,7,10],dens:.8,acc:.25,sl:.2,up:.15,dn:.15,tie:.1,root:.4,rep:false,wave:1,k:{cutoff:.35,reso:.65,envmod:.5,decay:.5,accent:.6}},
  {bpm:128,sc:[0,2,3,5,7,8,10,12],dens:.7,acc:.25,sl:.15,up:.15,dn:.1,tie:.1,root:.35,rep:true,wave:0,k:{cutoff:.3,reso:.55,envmod:.45,decay:.6,accent:.55}},
  {bpm:138,sc:[0,1,3,5,7,8,10,12],dens:.9,acc:.3,sl:.35,up:.2,dn:.05,tie:.05,root:.4,rep:false,wave:0,k:{cutoff:.2,reso:.85,envmod:.7,decay:.4,accent:.7}},
  {bpm:132,sc:[0,0,3,7,10],dens:.85,acc:.4,sl:.3,up:.3,dn:.05,tie:0,root:.5,rep:true,wave:0,k:{cutoff:.22,reso:.8,envmod:.75,decay:.3,accent:.75}},
  {bpm:140,sc:[0,1,3,6,7,10,12],dens:.85,acc:.45,sl:.3,up:.3,dn:.1,tie:.05,root:.4,rep:false,wave:1,k:{cutoff:.3,reso:.85,envmod:.8,decay:.35,accent:.85}},
  {bpm:145,sc:[0,1,4,5,7,8,10,12],dens:.95,acc:.2,sl:.4,up:.15,dn:.1,tie:0,root:.35,rep:false,wave:0,k:{cutoff:.3,reso:.7,envmod:.55,decay:.5,accent:.6}},
  {bpm:155,sc:[0,1,3,7,12],dens:.9,acc:.5,sl:.2,up:.35,dn:.1,tie:0,root:.5,rep:true,wave:1,k:{cutoff:.45,reso:.7,envmod:.8,decay:.25,accent:.9}}
];
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function sceneLine(si,k){
  const c=SCENES[si];
  for(let tries=0;;tries++){
    const R=mulberry(si*1000+k*37+tries*7919+1),pick=a=>a[Math.floor(R()*a.length)];
    const n=c.rep?8:16,st=[];
    for(let i=0;i<n;i++){
      const prev=st[i-1];
      if(i&&prev&&prev.type!=='rest'&&R()<c.tie){st.push({type:'tie',pitch:0,oct:0,acc:false,slide:false});continue;}
      if(i&&R()>c.dens){st.push({type:'rest',pitch:0,oct:0,acc:false,slide:false});continue;}
      const r=R();
      st.push({type:'note',pitch:R()<c.root?0:pick(c.sc),oct:r<c.up?1:r<c.up+c.dn?-1:0,acc:R()<c.acc,slide:R()<c.sl});
    }
    if(c.rep){for(let i=0;i<8;i++)st.push({...st[i]});const j=8+Math.floor(R()*8);if(st[j].type==='note'){st[j].pitch=pick(c.sc);st[j].acc=!st[j].acc;}}
    st.forEach(s=>{if(s.type==='note'&&s.pitch===12&&s.oct===1)s.oct=0;});
    if(st.filter(s=>s.type==='note').length>=5||tries>20)return st;
  }
}
const LIBRARY=SCENES.map((c,si)=>Array.from({length:10},(_,k)=>({scene:si,num:k+1,steps:sceneLine(si,k),bpm:c.bpm+(k%3-1)*2,wave:c.wave,k:c.k})));
