!function(){"use strict";const e=1615638023504,t=`cache${e}`,n=["/client/client.2ff90238.js","/client/inject_styles.5607aec6.js","/client/index.83bb4d8c.js","/client/index.61020cb9.js","/client/about.c3e75c67.js","/client/index.b261626f.js","/client/[slug].df662d2b.js","/client/[slug].e2e2ded5.js"].concat(["/service-worker-index.html","/azure-blob-storage-amazon-s3.png","/favicon.png","/global.css","/logo-192.png","/logo-512.png","/manifest.json","/sapper-svelte-github-pages-custom-domain.png"]),s=new Set(n);self.addEventListener("install",(e=>{e.waitUntil(caches.open(t).then((e=>e.addAll(n))).then((()=>{self.skipWaiting()})))})),self.addEventListener("activate",(e=>{e.waitUntil(caches.keys().then((async e=>{for(const n of e)n!==t&&await caches.delete(n);self.clients.claim()})))})),self.addEventListener("fetch",(t=>{if("GET"!==t.request.method||t.request.headers.has("range"))return;const n=new URL(t.request.url),c=n.protocol.startsWith("http"),a=n.hostname===self.location.hostname&&n.port!==self.location.port,i=n.host===self.location.host&&s.has(n.pathname),o="only-if-cached"===t.request.cache&&!i;!c||a||o||t.respondWith((async()=>i&&await caches.match(t.request)||async function(t){const n=await caches.open(`offline${e}`);try{const e=await fetch(t);return n.put(t,e.clone()),e}catch(e){const s=await n.match(t);if(s)return s;throw e}}(t.request))())}))}();
