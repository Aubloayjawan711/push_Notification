self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open('pwa-v1').then(cache => {
      return cache.addAll([
        '/push_Notification/index.html',
        '/push_Notification/style.css',
        '/push_Notification/manifest.json',
        '/push_Notification/icons/icon-192x192.png',
        '/push_Notification/icons/icon-512x512.png'
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
    clients.openWindow(event.notification.data?.url || '/push_Notification/')
  );
});
