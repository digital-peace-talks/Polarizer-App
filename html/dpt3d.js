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

var currentTopic;
var currentTopicStr;

var dpt;
var whoami;

var powerSave = false;


function focusAtCanvas() {
	document.getElementById('renderCanvas').focus();
}

function onWebSocketUpdate(restObj) {

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
	&& restObj.method == 'get'
	&& dialogFormOpen == 1) {
		dpt.getDialog(currentDialog.dialog);
	}
}

function onWebSocketAPI(restObj) {
	if(!restObj || !restObj.path || !restObj.method) {
		return;
	}

	if('status' in restObj && restObj.status > 399) {

		alert(restObj.data);
		return;

	} else if(currentDialog
			&& restObj.path == '/dialog/' + currentDialog.dialog + '/'
			&& restObj.method == 'get') {

		var old = currentDialog;
		currentDialog = restObj.data;
		currentDialog.topic = old.topic;
		currentDialog.initiatorOpinion = old.initiatorOpinion;
		currentDialog.recipientOpinion = old.recipientOpinion;
		dialogForm();

	}
	if(restObj.path == '/topic/'
	&& restObj.method == 'get') {
		if(currentScene.name == 'topicScene') {
			loadTopics(restObj);
		}

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
			currentScene = createGenericScene("topicScene");
			currentScene.name = 'topicScene';
			if(document.cookie) {
				dpt.userLogin(document.cookie);
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
						dpt.getTopic();
						dpt.getDialogList();
					}
					if(restObj.data.message == "user unknown") {
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

		engine = new BABYLON.Engine(canvas, true); //, { preserveDrawingBuffer: true, stencil: true });
		//engine.doNotHandleContextLost = true;
		//engine.enableOfflineSupport = false;
		
		engine.runRenderLoop(function() {
			if(currentScene && !powerSave) {
				currentScene.render();
			}
		});

		// Resize
		window.addEventListener("resize", function() {
			engine.resize();
		});
	});

	jQuery(window).blur(function() {
		powerSave = true;
	});
	
	jQuery(window).focus(function() {
		focusAtCanvas();
		powerSave = false;
	});
}

main();