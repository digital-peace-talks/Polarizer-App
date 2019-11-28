var canvas = document.getElementById("renderCanvas");
var engine;
var advancedTexture;
var currentScene;
var __topicScene;
var __opinionScene;
var topicCamState;
var opinionCamState;

var myDialogMenu = [];
var currentDialog;

var myDialogsVisible = 'hidden';
var formVisible = 'hidden';

var currentTopic;
var currentTopicStr;

var dpt;
var whoami;
var idleSince = 100000;

var powerSave = false;
var touchScreen = false;
var dialogFormOpen = 0;

var DPTConst = {
		"COLORS_default": 0,
		"COLORS_dark": 1,
		"COLORS_bright": 2,
};


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
	}

	if(restObj.path == '/topic/' && restObj.method == 'get') {
		if(currentScene.name == 'topicScene') {
			dpt.getTopic();
		}
	}

	if(restObj.path == '/dialog/list/' && restObj.method == 'get') {
		dpt.getDialogList();
	}

	if(restObj.path.startsWith('/opinion/')
	&& restObj.data.id == currentTopic
	&& restObj.method == 'get'
	&& currentScene.name == 'opinionScene') {
		dpt.getOpinionByTopic(currentTopic);
	}

	if(currentDialog
	&& restObj.path == '/dialog/' + currentDialog.dialog + '/'
	&& restObj.method == 'get') {
		if(dialogFormOpen == 1) {
			dpt.getDialog(currentDialog.dialog);
		}
		dpt.getDialogList();
	} else if(restObj.path.match('^/dialog/([0-9a-fA-F]{24})/$')
	&& restObj.method == 'get') {
		dpt.getDialogList();
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

	if(currentDialog
	&& restObj.path == '/dialog/' + currentDialog.dialog + '/'
	&& restObj.method == 'get') {

		var old = currentDialog;
		currentDialog = restObj.data[0];
		currentDialog.topic = old.topic;
		currentDialog.initiatorOpinion = old.initiatorOpinion;
		currentDialog.recipientOpinion = old.recipientOpinion;
		dialogForm();

	}
	if(currentDialog
	&& restObj.path == '/dialogSet/' + currentDialog.dialog + '/'
	&& restObj.method == 'get') {

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

	if(restObj.path == '/topic/'
	&& restObj.method == 'get') {
		if(currentScene.name == 'topicScene') {
			loadTopics(restObj);
		}

	} else if(restObj.path.startsWith('/metadata/search/')) {
		searchResultTopics(restObj);
	} else if(restObj.path == "/opinion/" + currentTopic + "/"
			&& restObj.method == "get") {
		if(currentScene.name == 'opinionScene') {
			loadOpinions(restObj);
		}

	} else if(restObj.path == '/opinion/postAllowed/') {
		if(restObj.data.value == true) {
			opinionForm();
		} else {
			alert('Only one opinion per topic.');
		}
	
	} else if(restObj.path == '/dialog/list/'
			&& restObj.method == 'get') {

		loadDialogList(restObj);
	}	
}

function main() {

	document.addEventListener("DOMContentLoaded", function(event) {
		if('ontouchstart' in window
		|| window.DocumentTouch && document instanceof window.DocumentTouch
		|| navigator.maxTouchPoints > 0
		|| window.navigator.msMaxTouchPoints) {
			touchScreen = true;
		}

		focusAtCanvas();
		//jQuery('canvas#renderCanvas').focus();
		var socket = io.connect(
			window.location.protocol + "//" + window.location.host, {
				transports: ["websocket"],
			}
		);

		dpt = new DPT(socket);
		var restObj = {};
		whoami = {
			dptUUID: "",
			user: {},
		};

		__topicScene = createGenericScene;
		__topicScene.name = 'topicScene';
		__opinionScene = createGenericScene;
		__opinionScene.name = 'opinionScene';

		// Handle the incomming websocket trafic
		socket.on("connect", () => {
			// if needed, we could keep socket.id somewhere
			console.log('we are: '+socket.id);
//			currentScene = createGenericScene("topicScene");
//			currentScene.name = 'topicScene';
			if(document.cookie) {
				dpt.userLogin(document.cookie);
			} else {
				alert('document cookie not set');
			}
		});

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

		socket.on("private", function(restObj) {
			if(restObj.method == "post") {
				if(restObj.path == "/user/login/") {
					whoami.dptUUID = restObj.data.dptUUID;
					if(restObj.data.message == "logged in") {
						whoami.user = restObj.data.user;
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
						currentScene = createGenericScene("topicScene");
						currentScene.name = 'topicScene';
						dpt.getTopic();
						dpt.getDialogList();
								
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

		/*
		jQuery('body').append(`<div id="debug" style="position: absolute;
			color: white; height: 80px; width: 390px; right: 390px; z-index:999; bottom: 80px"></div>
		`);
		*/
		
		engine = new BABYLON.Engine(canvas, true); //, { preserveDrawingBuffer: true, stencil: true });
		//engine.doNotHandleContextLost = true;
		//engine.enableOfflineSupport = false;
		
		engine.runRenderLoop(function() {
			let timeout = BABYLON.Tools.Now - idleSince;
			if(timeout > 3000.0) {
				powerSave = true;
			}
			if(timeout > 600000.0) {
				if(currentScene.name == "topicScene") {
					dpt.getTopic();
				} else if(currentScene.name == "opinionScene" && currentTopic) {
					dpt.getOpinionByTopic(currentTopic);
				}
				powerSave = false;
				idleSince = BABYLON.Tools.Now;
			} else {
				jQuery('#debug').text("");
			}
			if(currentScene && !powerSave) {
//				jQuery('#debug').text(engine.getFps()+"\n"+(BABYLON.Tools.Now - idleSince));
				currentScene.render();
			}
		});
		
		// Resize
		window.addEventListener("resize", function() {
			idleSince = BABYLON.Tools.Now;
			powerSave = false;
			engine.resize();
		});
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
	

}

main();