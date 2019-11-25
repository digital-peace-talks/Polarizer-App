var cacheName = 'dpt-v1';
const filesToCache = [
	'/',
];
const XfilesToCache = [
	'/',
	'/external/babylon.gui.min.js',
	'/external/babylon.js',
	'/external/babylonjs.materials.min.js',
	'/external/babylonjs.serializers.min.js',
	'/external/jquery-1.11.1.js',
	'/external/pep.js',
	'/external/socket.io.js',
	'/external/socket.io.js.map',
	'/dialog.html',
	'/dpt3d.html',
	'/dptAnleitung.html',
	'/dpt-doku.html',
	'/babylon-main.js',
	'/babylon-misc.js',
	'/babylon-opinions.js',
	'/babylon-topics.js',
	'/dialog.js',
	'/dpt3d.js',
	'/dpt-client.js',
	'/html-forms.js',
	'/dpt_bright.css',
	'/dpt_classic.css',
	'/dpt_dark.css',
	'/dpt_linden.css',
	'/dpt_love.css',
	'/dpt_mc.css',
	'/dpt_start.css',
	'/bitter.ttf',
	'/din.ttf',
	'/_fontdin.ttf',
	'/_font.ttf',
	'/font.ttf',
	'/1message_white.png',
	'/2message_white.png',
	'/about_white.png',
	'/blue-blue.png',
	'/blue-green.png',
	'/button_close.png',
	'/button_menu.png',
	'/chatbubble_inverted.png',
	'/chatbubble.png',
	'/copytoclipboard_dark.png',
	'/copytoclipboard.png',
	'/copytoclipboard_white.png',
	'/dialog_white.png',
	'/documentation_white.png',
	'/dpt_gestures.png',
	'/dpt_logo.png',
	'/Edit_icon_inverted.png',
	'/Edit_icon.png',
	'/green-green.png',
	'/grey-grey.png',
	'/help_white.png',
	'/home_white.png',
	'/Interrobang.png',
	'/joypad_white.png',
	'/joystickIcon.png',
	'/logo_dpt.png',
	'/logo_globe_256x256.png',
	'/message_big_white.png',
	'/message_small_white.png',
	'/moods_white.png',
	'/nav-top-logo.png',
	'/opinion_white.png',
	'/pitch-line.png',
	'/red-blue.png',
	'/red-green.png',
	'/red-red.png',
	'/scale_white.png',
	'/search.png',
	'/settings_white.png',
	'/sleep.png',
	'/sleep_white.png',
	'/smiley_negative.png',
	'/smiley_neutral.png',
	'/smiley_positive.png',
	'/survey2_white.png',
	'/survey_white.png',
	'/temp-topic-logo.png',
	'/topic_white.png',
	'/touch_white.png',
];

// install event
/*
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
*/
// activate event
self.addEventListener('activate',  (event) => {
	event.waitUntil(self.clients.claim());
});

// beforeinstall event
// to present an install button
/*
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
*/


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
