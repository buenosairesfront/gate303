/* Puente con el AudioWorklet: crea el audio con el primer gesto y le pasa patrón, perillas y transporte.
   El worklet avisa cada paso con su hora de audio; step() devuelve el que está sonando ahora. */
const Engine={ctx:null,node:null,an:null,p:null,q:[],cur:null,last:{},
  init(){
    if(this.p)return this.p;
    this.p=(async()=>{
      const C=window.AudioContext||window.webkitAudioContext;
      const ctx=new C({latencyHint:'interactive'});
      ctx.resume();
      await ctx.audioWorklet.addModule('js/worklet.js?v='+VER);
      const node=new AudioWorkletNode(ctx,'v303',{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[1]});
      const an=ctx.createAnalyser();an.fftSize=2048;
      node.connect(an);an.connect(ctx.destination);
      node.port.onmessage=e=>{this.q.push(e.data);if(this.q.length>32)this.q.shift();};
      Object.assign(this,{ctx,node,an});
      node.port.postMessage(this.last);
      if(ctx.state!=='running')await ctx.resume();
    })();
    this.p.catch(()=>{this.p=null;});
    return this.p;
  },
  set(m){Object.assign(this.last,m);if(this.node)this.node.port.postMessage(m);},
  send(m){if(this.node)this.node.port.postMessage(m);},
  now(){const c=this.ctx;return c?c.currentTime-(c.outputLatency||c.baseLatency||0):0;},
  step(){const t=this.now();while(this.q.length&&this.q[0].at<=t)this.cur=this.q.shift();return this.cur;},
  reset(){this.q=[];this.cur=null;}
};
