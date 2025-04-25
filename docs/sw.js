const CACHE_NAME = "controlatucoche-cache-v1";
const archivosParaCache = [
  "/index.html",
  "/main.js",
  "/style.css",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/xlsx.min.js"  // Só se o usas
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Cache aberta");
        return cache.addAll(archivosParaCache);
      })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
