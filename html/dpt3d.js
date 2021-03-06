// global vars


var canvas = document.getElementById("renderCanvas");
var engine;

var currentScene;
var __topicScene;
var __opinionScene;
var topicCamState;
var opinionCamState;

var idleSince = 100000;
var powerSave = false;

var currentTopic;
var currentTopicStr;

var myOpinion;

var currentDialog;
var isMobile = false; //initiate as false
var myDialogMenu = [];

var hamburgerOpen = false;

var myDialogsVisible = 'hidden';
var formVisible = false;

var dpt;
var whoami;

var touchScreen = false;
var dialogFormOpen = 0;

const guidePosition = [];

var DPTGlobal = {
	"COLORS_default": 0,
	"COLORS_dark": 1,
	"COLORS_bright": 2,
	"COLORS_skybox": 3,
};


// from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
function copyToClipboard(str) {
	const el = document.createElement('textarea');  // Create a <textarea> element
	el.value = str;                                 // Set its value to the string that you want copied
	el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
	el.style.position = 'absolute';
	el.style.left = '-9999px';                      // Move outside the screen to make it invisible
	document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
	const selected =
		document.getSelection().rangeCount > 0      // Check if there is any content selected previously
		? document.getSelection().getRangeAt(0)     // Store selection if found
		: false;                                    // Mark as false to know no selection existed before
	el.select();                                    // Select the <textarea> content
	document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
	document.body.removeChild(el);                  // Remove the <textarea> element
	if (selected) {                                 // If a selection existed before copying
		document.getSelection().removeAllRanges();  // Unselect everything on the HTML document
		document.getSelection().addRange(selected); // Restore the original selection
	}
}

function focusAtCanvas() {
	idleSince = BABYLON.Tools.Now;
	powerSave = false;
	document.getElementById('renderCanvas').focus();
}

function onWebSocketUpdate(restObj) {

	idleSince = BABYLON.Tools.Now;
	powerSave = false;

	if(restObj.method == 'post') {

		if(restObj.path == '/info/') {
			jQuery('#messages')
				.append(jQuery('<li>')
				.text(restObj.data.message));

			window.scrollTo(0, document.body.scrollHeight);
		}
	} else if(restObj.method == 'get') {

		if(restObj.path == '/topic/') {
			if(currentScene.name == 'topicScene') {
				dpt.getTopic();
			}
		}
	
		if(restObj.path == '/dialog/list/') {
			dpt.getDialogList();
		}
	
		if(restObj.path.startsWith('/opinion/')
		&& restObj.data.id == currentTopic
		&& currentScene.name == 'opinionScene') {
			dpt.getOpinionByTopic(currentTopic);
		}
	
		if(currentDialog
		&& restObj.path == '/dialog/' + currentDialog.dialog + '/') {
			if(dialogFormOpen == 1) {
				dpt.getDialog(currentDialog.dialog);
			}
			dpt.getDialogList();
		} else if(restObj.path.match('^/dialog/([0-9a-fA-F]{24})/$')) {
			dpt.getDialogList();
		}
	}
	
}

function onWebSocketAPI(restObj) {
	if(!restObj) {
		return;
	}
	if('status' in restObj && restObj.status > 399) {
		alert(restObj.data);
		return;
	}
	if(!restObj.path || !restObj.method) {
		return;
	}

	idleSince = BABYLON.Tools.Now;
	powerSave = false;

	if(restObj.method == 'get') {
		if(currentDialog && restObj.path == '/dialog/' + currentDialog.dialog + '/') {
	
			var old = currentDialog;
			currentDialog = restObj.data[0];
			currentDialog.topic = old.topic;
			currentDialog.initiatorOpinion = old.initiatorOpinion;
			currentDialog.recipientOpinion = old.recipientOpinion;
			dialogForm();
	
		}
		if(currentDialog && restObj.path == '/dialogSet/' + currentDialog.dialog + '/') {
	
			if(Array.isArray(restObj.data)) {
				var old;
				for(var i in currentScene.meshes) {
					if('dpt' in currentScene.meshes[i]
					&& currentScene.meshes[i].dpt.context == 'tubeConnection'
					&& currentScene.meshes[i].dpt.dialogId == restObj.data[0].dialog) {
						old = currentScene.meshes[i].dpt;
						old.topic = currentDialog.topic;
					}
				}
				currentDialog = restObj.data[0];
				currentDialog.topic = old.topic;
				currentDialog.initiatorOpinion = old.initiatorsOpinion;
				currentDialog.recipientOpinion = old.recipientsOpinion;
			}
	
			dialogForm(restObj.data[1]);
		}
		if(restObj.path == '/topic/') {
			if(currentScene.name == 'topicScene') {
				loadTopics(restObj);
			}
		} else if(restObj.path.startsWith('/metadata/search/')) {
			searchResultTopics(restObj);
		} else if(restObj.path == "/opinion/" + currentTopic + "/") {
			if(currentScene.name == 'opinionScene') {
				myOpinion = restObj.data && restObj.data.find(opinion => opinion.user == "mine");
				loadOpinions(restObj);
			}
		} else if(restObj.path == '/opinion/postAllowed/') {
			if(restObj.data.value == true) {
				opinionForm();
			} else {
				opinionEdit();
			}
		} else if(restObj.path == '/dialog/list/') {
			loadDialogList(restObj);
		}	
	} else if(restObj.method == 'post') {
		if(restObj.path == '/dialog/') {
			dpt.getOpinionByTopic(currentTopic);
		}	
	}
}

function setHtmlScheme() {
	var htmlScheme = '';
	switch(whoami.user.preferences.htmlScheme) {
		case 1:
			htmlScheme = "dpt_bright.css";
			break;
		case 2:
			htmlScheme = "dpt_dark.css";
			break;
		case 3:
			htmlScheme = "dpt_linden.css";
			break;
		case 4:
			htmlScheme = "dpt_love.css";
			break;
		case 5:
			htmlScheme = "dpt_mc.css";
			break;
		case 0:
		default:
			htmlScheme = "dpt_classic.css";
			break;
	}
	//document.getElementById('theme_css').href = htmlScheme;
	setTimeout(function() {
		document.getElementById('theme_css').href = htmlScheme;
	}, 300);
}

function main() {

	if('ontouchstart' in window
	|| window.DocumentTouch && document instanceof window.DocumentTouch
	|| navigator.maxTouchPoints > 0
	|| window.navigator.msMaxTouchPoints) {
		touchScreen = true;
	}

	focusAtCanvas();

	// open a websocket connection to the server
	var socket = io.connect(
		window.location.protocol + "//" + window.location.host, {
			transports: ["websocket"],
		}
	);

	// get DPT api class instance
	dpt = new DPT(socket);

	// initialize global vars
	var restObj = {};
	whoami = {
		dptUUID: "",
		user: {},
		developer: false
	};

	// assign the generic scene function to some globals
	// with special name
	__topicScene = createGenericScene;
	__topicScene.name = 'topicScene';
	__opinionScene = createGenericScene;
	__opinionScene.name = 'opinionScene';

	// Handle the incomming websocket trafic
	socket.on("connect", () => {

		// if needed, we could keep socket.id somewhere
		console.log('we are: '+socket.id);
		if(document.cookie) {
			dpt.userLogin(document.cookie);
		} else {
			alert('document cookie not set');
		}

	});

	// this function get called when we work with 3d avatars
	socket.on("3d", function(update) {
		if(update.event == 'connect'
		&& update.avatar != socket.id) {
			createAvatar(update, false);
		} else if(update.event == 'disconnect') {
			disposeAvatar(update);
		} else if(update.event == 'update') {
			updateAvatar(update);
		}
		console.log(update);
	});

	// special call for login procedure, we keep it a bit separate.
	socket.on("private", function(restObj) {
		if(restObj.method == "post") {
			if(restObj.path == "/user/login/") {
				whoami.dptUUID = restObj.data.dptUUID;
				whoami.developer = restObj.data.developer;
				if(restObj.data.message == "logged in") {

					whoami.user = restObj.data.user;
					setHtmlScheme();

					currentScene = createGenericScene("topicScene");
					currentScene.name = 'topicScene';
					dpt.getTopic();
					dpt.getDialogList();

					if(whoami.user.preferences.guidedTour) {
						window.setTimeout(function(){tour.start()}, 1000);
					} else {
						jQuery('.tutorialBorder').remove();
						jQuery('.animated-circle').remove();
						jQuery('.fb_gd_wrap').remove();
					}
							
				} else if(restObj.data.message == "user unknown") {
					alert(`User unknown.
						Please go back to the start page,
						delete your cookie. You can try to get your
						phrase recovered or get a new phrase.

						maybe cookies are disable?`);
					whoami.user = {};
				}
			}
		}
	});

	socket.on("error", function(e) {
		console.log("System", e ? e : "A unknown error occurred");
		document.location.reload(true);
		window.location.reload(true);
	});

	// server says it has some updates for client
	socket.on('update', function(restObj) {
		onWebSocketUpdate(restObj);
	});

	socket.on("api", function(restObj) {
		onWebSocketAPI(restObj);
	});

	// this is for create a on-screen debug div for debugging purposes
	/*
	jQuery('body').append(`<div id="debug" style="position: absolute;
		color: white; height: 80px; width: 390px; right: 390px; z-index:999; bottom: 80px"></div>
	`);
	*/
	
	// Resize
	window.addEventListener("resize", function() {
		idleSince = BABYLON.Tools.Now;
		powerSave = false;
		engine.resize();
	});

	jQuery(window).blur(function() {
		idleSince = BABYLON.Tools.Now;
		powerSave = true;
	});
	
	jQuery(window).focus(function() {
		focusAtCanvas();
		idleSince = BABYLON.Tools.Now;
		powerSave = false;
	});

	// get 3D.
	startBabylonEngine();
	
}



// hooray! we start our javascript in main().

document.addEventListener("DOMContentLoaded", function() {
	main();
});
