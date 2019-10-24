var cacheName = 'dpt-v1';
const filesToCache = [
	'/'
];

// install event
self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Install');
	e.waitUntil(
		caches.open(cacheName)
		.then(function(cache) {
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
		caches.match(event.request, {ignoreSearch: true})
		.then(response => {
			var path = event.request.url.replace(location.origin, '');
			if(path == "/") {
				return(fetch(event.request));
			} else {
				return(response || fetch(event.request));
			}
		})
	);
});
