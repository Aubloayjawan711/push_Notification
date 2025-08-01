
self.addEventListener('install', event => {
    console.log('[Service Workwe] Installing...');
  event.waitUntil( 

    caches.open('paw-v1').then(cache => {
      return cache.addAll([
        './index.html',
        './style.css',
        './manifest.json',
        './notify.js',
        './icons/icon-192x192.png',
        './icons/icon-512x512.png'

      ]);
    })
  );
});
 
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data?.url || '/')
    );
});

