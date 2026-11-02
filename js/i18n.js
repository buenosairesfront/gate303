/* Idioma: ?lang=xx > última elección guardada > español. Carga lang/es.js (base) y el idioma elegido encima. */
const LANGS=[['es','ES','Español'],['en','EN','English'],['de','DE','Deutsch'],['ja','日本','日本語'],['zh','中文','中文'],['hi','हिं','हिन्दी']];
const ACID_I18N={};
const VER=location.hostname==='localhost'?String(Date.now()):'10';
const LANG=(()=>{
  const ok=c=>LANGS.some(l=>l[0]===c);
  const u=new URLSearchParams(location.search).get('lang');
  if(u&&ok(u)){try{localStorage.setItem('uma303-lang',u)}catch(e){}return u;}
  let s=null;try{s=localStorage.getItem('uma303-lang')}catch(e){}
  return ok(s)?s:'es';
})();
let T;
function setLang(c){const u=new URL(location.href);u.searchParams.set('lang',c);try{localStorage.setItem('uma303-lang',c)}catch(e){}location.href=u.toString();}
function applyStatic(){
  document.documentElement.lang=LANG;
  document.title=T.ui.docTitle;
  document.querySelector('meta[name=description]').content=T.ui.metaDesc;
  document.querySelectorAll('[data-i18n]').forEach(e=>{e.innerHTML=T.ui[e.dataset.i18n];});
  document.querySelectorAll('[data-i18n-ph]').forEach(e=>{e.placeholder=T.ui[e.dataset.i18nPh];});
  document.querySelectorAll('[data-i18n-aria]').forEach(e=>{e.setAttribute('aria-label',T.ui[e.dataset.i18nAria]);});
  document.querySelectorAll('[data-langs]').forEach(g=>{
    g.innerHTML=LANGS.map(([c,ab,nm])=>`<option value="${c}" title="${nm}"${c===LANG?' selected':''}>${ab}</option>`).join('');
    g.addEventListener('change',()=>setLang(g.value));
  });
}
(function boot(){
  const load=src=>new Promise((ok,ko)=>{const s=document.createElement('script');s.src=src+'?v='+VER;s.onload=ok;s.onerror=ko;document.head.appendChild(s);});
  const files=['lang/es.js'];if(LANG!=='es')files.push('lang/'+LANG+'.js');
  Promise.all(files.map(load)).then(()=>{
    const B=ACID_I18N.es,X=ACID_I18N[LANG]||{};
    T={...B,...X,ui:{...B.ui,...X.ui}};
    applyStatic();
    return load('js/engine.js').then(()=>load('js/scales.js')).then(()=>load('js/library.js')).then(()=>load('js/app.js')).then(()=>load('js/export.js'));
  }).catch(e=>{document.getElementById('main').textContent='Error: '+e;});
})();
