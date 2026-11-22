const CACHE='darts-manager-v6';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./README.md','./INSTALLATION.txt'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('darts-manager-')&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 const isPage=event.request.mode==='navigate'||new URL(event.request.url).pathname.endsWith('/index.html');
 if(isPage){event.respondWith((async()=>{try{const fresh=await fetch(event.request,{cache:'no-store'});const cache=await caches.open(CACHE);cache.put('./index.html',fresh.clone());return fresh}catch(error){return (await caches.match('./index.html'))||Response.error()}})());return;}
 event.respondWith((async()=>{const cached=await caches.match(event.request);if(cached)return cached;try{const response=await fetch(event.request);if(response.ok){const cache=await caches.open(CACHE);cache.put(event.request,response.clone())}return response}catch(error){return Response.error()}})());
});
