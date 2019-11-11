var cacheName = 'dpt-v1';
const filesToCache = [
	
	'/external/babylon.js',
	'/external/jquery-1.11.1.js',
	'/external/babylon.gui.min.js',
	'/external/babylonjs.materials.min.js',
	'/external/socket.io.js',
	'/external/babylonjs.serializers.min.js',
	'/external/pep.js'
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
self.addEventListener('activate',  (event) => {
	event.waitUntil(self.clients.claim());
});

// beforeinstall event
// to present an install button
window.addEventListener("beforeinstallprompt", (event) => {
	// Suppress automatic prompting.
	event.preventDefault();
  
	// Show the (disabled-by-default) install button. This button
	// resolves the installButtonClicked promise when clicked.
	installButton.disabled = false;
  
	// Wait for the user to click the button.
	installButton.addEventListener("click", async (e) => {
	  // The prompt() method can only be used once.
	  installButton.disabled = true;
  
	  // Show the prompt.
	  const { userChoice } = await event.prompt();
	  console.info(`user choice was: ${userChoice}`);
	});
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
