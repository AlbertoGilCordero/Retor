// Rétor: caché de la app para abrir sin conexión. Los modelos y las librerías los cachea el navegador por su cuenta.
const C='retor-v1', SHELL=['./','index.html','manifest.webmanifest','art/casco.png','art/icon-192.png','art/orador-entrenar.jpg','art/escena-tecnicas.jpg','art/plaza.jpg'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).catch(()=>{})); self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ const r=e.request, u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin||u.pathname.endsWith('kb.json')) return;
  const page=r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html');
  if(page){ e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)); return res; }).catch(()=>caches.match(r).then(m=>m||caches.match('index.html')))); return; }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{ if(res.ok){ const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp)); } return res; })));
});
