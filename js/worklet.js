/* Voz monofónica estilo 303 y secuenciador de 16 pasos dentro del hilo de audio, así el tiempo es exacto.
   Oscilador polyBLEP → filtro escalera de 4 polos con saturación (2x sobremuestreo) → VCA.
   Reglas de la 303: slide = la nota (y sus ligados) se sostiene y la siguiente se desliza sin re-ataque; tie = sigue la nota anterior. */
const ft=x=>x<-3?-1:x>3?1:x*(27+x*x)/(27+9*x*x);
const blep=(t,dt)=>{if(t<dt){t/=dt;return t+t-t*t-1;}if(t>1-dt){t=(t-1)/dt;return t*t+t+t+1;}return 0;};

class V303 extends AudioWorkletProcessor{
  constructor(){
    super();
    this.P={tune:.5,cutoff:.42,reso:.62,envmod:.55,decay:.4,accent:.65,wave:0,vol:.75,bpm:124};
    this.pat=[];this.run=false;this.i=-1;this.c=0;this.k=0;
    this.ph=0;this.sm=0;this.ts=0;
    this.gate=false;this.goff=-1;this.slide=false;this.acc=false;
    this.amp=0;this.vd=1;this.fe=0;this.ac=0;
    this.s1=this.s2=this.s3=this.s4=0;this.xp=0;this.hx=0;this.hy=0;
    this.port.onmessage=e=>{
      const d=e.data;
      if(d.params)Object.assign(this.P,d.params);
      if(d.pattern)this.pat=d.pattern;
      if(d.play===true){this.run=true;this.i=-1;this.c=0;this.gate=false;this.slide=false;}
      if(d.play===false){this.run=false;this.gate=false;this.goff=-1;}
      if(d.audition&&!this.run){this.note(d.audition,true);this.goff=Math.round(sampleRate*.2);}
    };
  }
  note(st,attack){
    this.ts=st.n+12*st.o;this.acc=!!st.a;
    if(attack){this.sm=this.ts;this.fe=1;this.vd=1;}
    this.gate=true;
  }
  tick(L){
    const N=this.pat.length;if(!N)return;
    this.i=(this.i+1)%N;
    const st=this.pat[this.i],nx=this.pat[(this.i+1)%N];
    let snd=false;
    if(st.t==='n'){this.note(st,!(this.gate&&this.slide));snd=true;}
    else if(st.t==='t'&&this.gate)snd=true;
    if(snd){if(st.t==='n')this.slide=st.s;const hold=this.slide||nx.t==='t';this.goff=hold?-1:Math.round(L*.5);}
    else{this.gate=false;this.slide=false;this.goff=-1;}
    this.port.postMessage({step:this.i,at:currentTime+this.k/sampleRate});
  }
  process(_,outs){
    const o=outs[0][0];if(!o)return true;
    const P=this.P,sr=sampleRate,L=sr*15/P.bpm;
    const fd=Math.exp(-4.6/(sr*(this.acc?.2:.12*Math.pow(2,P.decay*4.3))));
    const ka=1-Math.exp(-1/(sr*.002)),kr=1-Math.exp(-1/(sr*.008)),gk=1-Math.exp(-1/(sr*.04));
    const vdk=Math.exp(-1/(sr*3)),ak=1-Math.exp(-1/(sr*(.015+.12*P.reso)));
    const kq=P.reso*4.1,tune=(P.tune-.5)*24,comp=1+P.reso*1.2,accG=P.accent*1.1;
    for(let k=0;k<o.length;k++){
      this.k=k;
      if(this.run){if(this.c<=0){this.tick(L);this.c+=L;}this.c--;}
      if(this.goff>0&&--this.goff===0)this.gate=false;
      this.sm+=(this.ts-this.sm)*gk;
      const dt=65.406*Math.pow(2,(this.sm+tune)/12)/sr;
      this.ph+=dt;if(this.ph>=1)this.ph-=1;
      let x;
      if(P.wave<.5)x=2*this.ph-1-blep(this.ph,dt);
      else{const p2=this.ph<.5?this.ph+.5:this.ph-.5;x=(this.ph<.5?1:-1)+blep(this.ph,dt)-blep(p2,dt);}
      this.fe*=fd;
      this.amp+=((this.gate?1:0)-this.amp)*(this.gate?ka:kr);this.vd*=vdk;
      this.ac+=((this.acc?this.fe*P.accent:0)-this.ac)*ak;
      const fc=Math.min(sr*.8,18000,110*Math.pow(2,P.cutoff*5.5+this.fe*P.envmod*4+this.ac*(2+2*P.reso)));
      const g=1-Math.exp(-Math.PI*fc/sr),xin=x*.85;
      for(let j=0;j<2;j++){
        const u=ft((j?xin:(xin+this.xp)*.5)-kq*this.s4);
        this.s1+=g*(u-ft(this.s1));const a1=ft(this.s1);
        this.s2+=g*(a1-ft(this.s2));const a2=ft(this.s2);
        this.s3+=g*(a2-ft(this.s3));const a3=ft(this.s3);
        this.s4+=g*(a3-ft(this.s4));
      }
      this.xp=xin;
      const y=this.s4*comp*this.amp*this.vd*(1+(this.acc?accG:0));
      this.hy=y-this.hx+.996*this.hy;this.hx=y;
      o[k]=ft(this.hy*1.4)*P.vol*.75;
    }
    return true;
  }
}
registerProcessor('v303',V303);
