/* Sona works in airplane mode:
   - the app itself comes from the phone's cache and is refreshed in the background
     (pull-to-refresh gets the newest version right away);
   - the Firebase code and the book covers are kept after the first visit;
   - books you download are served from the phone instead of the internet. */
const CACHE = "sona-v16";
const AUDIO = "sona-audio";   // filled by the app when you tap "Descarcă"
const SHELL = ["./", "index.html", "manifest.json", "firebase-config.js", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
const KEEP_FOREVER = ["www.gstatic.com", "cms-imgp.jw-cdn.org"];

self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== AUDIO).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);

  // downloaded audio and texts
  if (u.hostname === "firebasestorage.googleapis.com" || (u.origin === location.origin && u.pathname.includes("/__text/"))) {
    e.respondWith(caches.open(AUDIO).then(c => c.match(e.request.url)).then(r => r || fetch(e.request)));
    return;
  }
  // Firebase code and covers: keep them once seen
  if (KEEP_FOREVER.includes(u.hostname)) {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(e.request);
      if (hit) return hit;
      const r = await fetch(e.request);
      if (r.ok || r.type === "opaque") c.put(e.request, r.clone());
      return r;
    }));
    return;
  }
  if (u.origin !== location.origin) return;

  // the app: instant from cache, refreshed in the background
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request, {ignoreSearch: true});
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
