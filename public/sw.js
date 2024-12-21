const CACHE_NAME = 'ai-blog-cache-v1';

// Add list of files to cache here
const urlsToCache = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch new
        return response || fetch(event.request)
          .catch(() => {
            // If offline and page not in cache, show offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/offline');
            }
            return null;
          });
      })
  );
});

// Listen for push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100]
  };

  event.waitUntil(
    self.registration.showNotification('Modern AI Blog', options)
  );
});