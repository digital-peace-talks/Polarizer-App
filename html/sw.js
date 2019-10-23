var cacheName = 'dpt-v1';
const filesToCache = [
  '/',
  '/dpt3d.html',
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
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'dpt_logo.png',
  '/search.png',
  'https://code.jquery.com/pep/0.4.3/pep.js',
  'https://preview.babylonjs.com/babylon.js',
  'https://preview.babylonjs.com/materialsLibrary/babylonjs.materials.min.js',
  'https://preview.babylonjs.com/serializers/babylonjs.serializers.min.js',
  'https://preview.babylonjs.com/gui/babylon.gui.min.js'
];

// install event
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

// activate event
self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});

// fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});
