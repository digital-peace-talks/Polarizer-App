var cacheName = 'dpt-v1';
const filesToCache = [
	'/external/babylon.gui.min.js',
	'/external/babylon.js',
	'/external/babylonjs.materials.min.js',
	'/external/babylonjs.serializers.min.js',
	'/external/jquery-1.11.1.js',
	'/external/pep.js',
	'/external/socket.io.js',
	'/external/socket.io.js.map',
	'/html/dialog.html',
	'/html/dpt3d.html',
	'/html/dptAnleitung.html',
	'/html/dpt-doku.html',
	'/html/babylon-main.js',
	'/html/babylon-misc.js',
	'/html/babylon-opinions.js',
	'/html/babylon-topics.js',
	'/html/dialog.js',
	'/html/dpt3d.js',
	'/html/dpt-client.js',
	'/html/html-forms.js',
	'/html/dpt_bright.css',
	'/html/dpt_classic.css',
	'/html/dpt_dark.css',
	'/html/dpt_linden.css',
	'/html/dpt_love.css',
	'/html/dpt_mc.css',
	'/html/dpt_start.css',
	'/static/bitter.ttf',
	'/static/din.ttf',
	'/static/_fontdin.ttf',
	'/static/_font.ttf',
	'/static/font.ttf',
	'/static/1message_white.png',
	'/static/2message_white.png',
	'/static/about_white.png',
	'/static/blue-blue.png',
	'/static/blue-green.png',
	'/static/button_close.png',
	'/static/button_menu.png',
	'/static/chatbubble_inverted.png',
	'/static/chatbubble.png',
	'/static/copytoclipboard_dark.png',
	'/static/copytoclipboard.png',
	'/static/copytoclipboard_white.png',
	'/static/dialog_white.png',
	'/static/documentation_white.png',
	'/static/dpt_gestures.png',
	'/static/dpt_logo.png',
	'/static/Edit_icon_inverted.png',
	'/static/Edit_icon.png',
	'/static/green-green.png',
	'/static/grey-grey.png',
	'/static/help_white.png',
	'/static/home_white.png',
	'/static/Interrobang.png',
	'/static/joypad_white.png',
	'/static/joystickIcon.png',
	'/static/logo_dpt.png',
	'/static/logo_globe_256x256.png',
	'/static/message_big_white.png',
	'/static/message_small_white.png',
	'/static/moods_white.png',
	'/static/nav-top-logo.png',
	'/static/opinion_white.png',
	'/static/pitch-line.png',
	'/static/red-blue.png',
	'/static/red-green.png',
	'/static/red-red.png',
	'/static/scale_white.png',
	'/static/search.png',
	'/static/settings_white.png',
	'/static/sleep.png',
	'/static/sleep_white.png',
	'/static/smiley_negative.png',
	'/static/smiley_neutral.png',
	'/static/smiley_positive.png',
	'/static/survey2_white.png',
	'/static/survey_white.png',
	'/static/temp-topic-logo.png',
	'/static/topic_white.png',
	'/static/touch_white.png'
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
