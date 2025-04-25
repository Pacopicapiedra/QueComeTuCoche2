const CACHE_NAME = 'controlatucoche-cache-v1';
const archivosParaCache = [
  './',
  './index.html',
  './main.js',
  './style.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './xlsx.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(archivosParaCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cacheRes => {
        // Se está no caché, devólveo; se non, faino fetch e gardao
        return cacheRes || fetch(event.request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request.url, fetchRes.clone());
            return fetchRes;
          });
        });
      })
      .catch(() => {
        // Se todo falla (por ex. ruta non encontrada), serve index.html
        return caches.match('./index.html');
      })
  );
});
