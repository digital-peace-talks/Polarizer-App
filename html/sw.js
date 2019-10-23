var cacheName = 'dpt-v1';
const filesToCache = [
  '/',
  'babylon-main.js',
  'babylon-misc.js',
  'babylon-opinions.js',
  'babylon-topics.js',
  'dpt3d.html',
  'dpt3d.js',
  'dialog.html',
  'dialog.js',
  'dpt-client.js',
  'dpt_start.css',
  'dpt_classic.css',
  'dpt_classic.css.map',
  'dpt_classic.scss',
  'html-forms.js',
  'icons/icon-192x192.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});
