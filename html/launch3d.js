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


function getCollisionBox() {
	//Simple box
	var box = new BABYLON.MeshBuilder.CreateBox("collisionBox", 
	{
		width: 100,
		height: 30,
		depth: 40,
		sideOrientation: 1
	}, currentScene);

	box.position = new BABYLON.Vector3(7.5, 2.5, -19.99);
	//create material
	var mat = new BABYLON.StandardMaterial("mat", currentScene);
	mat.diffuseColor = new BABYLON.Color3(10 / 255, 80 / 255, 119 / 255);
	mat.specularColor = new BABYLON.Color3(10 / 255, 80 / 255, 119 / 255);
	//mat.Color = new BABYLON.Color3(10 / 255, 80 / 255, 119 / 255);
	mat.emissiveColor = new BABYLON.Color3(10 / 255, 80 / 255, 119 / 255);
	mat.alpha = 0.25;
	
	//mat.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
	

	//apply material
	box.material = mat;
	//mat.freeze();

	return (box);
}

function getCamera() {

	// camera
	if(currentScene.dptMode == "topicScene") {
		console.log('ts cam');
		var camera = new BABYLON.FlyCamera("FlyCamera",
			new BABYLON.Vector3(2.5, 4.5, -15), currentScene);

		if(topicCamState) {
			camera.position = topicCamState.position;
			camera.rotation = topicCamState.rotation;
			camera.direction = topicCamState.direction;
		}
	}
	if(currentScene.dptMode == "opinionScene") {
		console.log('os cam');
		var camera = new BABYLON.FlyCamera("FlyCamera",
			new BABYLON.Vector3(4.5, 1.0, -15), currentScene);

		if(opinionCamState) {
			camera.position = opinionCamState.position;
			camera.rotation = opinionCamState.rotation;
			camera.direction = opinionCamState.direction;
		}
	}

	camera.inputs.add(new BABYLON.FreeCameraTouchInput());

	camera.keysForward.push(33);
	camera.keysBackward.push(34);

	camera.keysLeft.push(37);
	camera.keysUp.push(38);
	camera.keysRight.push(39);
	camera.keysDown.push(40);

	/**/
	camera.rollCorrect = 10;
	camera.bankedTurn = true;
	camera.bankedTurnLimit = Math.PI / 8;
	camera.bankedTurnMultiplier = 1;
	/**/

	camera.acceleration = 0.01;
	camera.speed = 0.5;

	return (camera);
}

function initVirtJoysticks() {

	var leftJoystick = new BABYLON.VirtualJoystick(false);
	var rightJoystick = new BABYLON.VirtualJoystick(true);
	leftJoystick.setJoystickColor("#ff7f003f");
	rightJoystick.setJoystickColor("#ff007f3f");
	BABYLON.VirtualJoystick.Canvas.style.zIndex = "-1";

	// Game/Render loop

	var movespeed = 5;
	var camVec = currentScene.cameras[0].position;
	currentScene.onBeforeRenderObservable.add(() => {
		if(leftJoystick.pressed) {
			camVec.z += leftJoystick.deltaPosition.y *
				(engine.getDeltaTime() / (1000 - 2 * camVec.z * camVec.z)) *
				movespeed;
			if(camVec.z > 0) {
				camVec.z = -15;
			}
			if(camVec.z < -20) {
				camVec.z = -1;
			}
		}
		if(rightJoystick.pressed) {
			camVec.x += rightJoystick.deltaPosition.x *
				(engine.getDeltaTime() / (2000 - camVec.z * camVec.z)) *
				movespeed;
			camVec.y += rightJoystick.deltaPosition.y *
				(engine.getDeltaTime() / (2000 - camVec.z * camVec.z)) *
				movespeed;
		}
	})
	var btn = document.createElement("input");
	//			btn.innerText = "Enable/Disable Joystick";
	btn.style.zIndex = 10;
	btn.style.position = "absolute";
	btn.style.bottom = "50px";
	btn.style.right = "50px";
	btn.width = "50";
	btn.height = "50";
	btn.type = "image";
	btn.src = "/joypad_white.png";
	btn.style.color = "#f00";
	document.body.appendChild(btn);

	// Button toggle logic
	btn.onclick = () => {
		if(BABYLON.VirtualJoystick.Canvas.style.zIndex == "-1") {
			BABYLON.VirtualJoystick.Canvas.style.zIndex = "4";
			btn.src = "/touch_white.png";
		} else {
			BABYLON.VirtualJoystick.Canvas.style.zIndex = "-1";
			btn.src = "/joypad_white.png";
			btn.background = "transparent";
		}
	}
}


var createGenericScene = function(dptMode) {

	var genericScene = new BABYLON.Scene(engine);
	BABYLON.Scene.DoubleClickDelay = 500;

	currentScene = genericScene;
	currentScene.dptMode = dptMode;

	// lights - no light!!
	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, -1), genericScene);
	light.radius = 10;
	light.intensity = 0.3;

	genericScene.clearColor = new BABYLON.Color3(10 / 255, 80 / 255, 119 / 255);

	var camera = getCamera();
	camera.attachControl(canvas, true);

	initVirtJoysticks();
	pauseEngine();

	// Enable Collisions
	var box = getCollisionBox();
	box.checkCollisions = true;
	camera.checkCollisions = true;
	genericScene.collisionsEnabled = true;

	createGUIScene(dptMode);


	genericScene.onPointerObservable.add((pointerInfo) => {
		switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERDOWN:
				//console.log("POINTER DOWN");
				break;
			case BABYLON.PointerEventTypes.POINTERUP:
				//console.log("POINTER UP");

				if(pointerInfo.pickInfo.pickedMesh
				&& 'dpt' in pointerInfo.pickInfo.pickedMesh) {
					if(pointerInfo.pickInfo.pickedMesh.dpt.context == "dialogInvitation") {
						propositionForm(pointerInfo.pickInfo.pickedMesh.dpt.opinionId);
					} else if(pointerInfo.pickInfo.pickedMesh.dpt.context == "tubeConnection") {

						if(pointerInfo.pickInfo.pickedMesh.dpt.status == "CLOSED") {
							currentDialog = {
								dialog: pointerInfo.pickInfo.pickedMesh.dpt.dialogId,
								topic: currentTopicStr,
								initiatorOpinion: pointerInfo.pickInfo.pickedMesh.dpt.initiatorsOpinion,
								recipientOpinion: pointerInfo.pickInfo.pickedMesh.dpt.recipientsOpinion,
							};
							dpt.getDialog(currentDialog.dialog);
						}

					}
				}

				break;
			case BABYLON.PointerEventTypes.POINTERMOVE:
				/*
				for(i in currentScene.meshes) {
					if(pointerInfo.pickInfo.ray.intersectsMesh(currentScene.meshes[i])
					&& 'dpt' in currentScene.meshes[i]) {
						var bla = currentScene.meshes[i];
						console.log('hit');
					}
				}
				*/
				//console.log("POINTER MOVE");
				//if('dpt' in pointerInfo.pickInfo.pickedMesh) {
				//	console.log("POINTER MOVE");
				//}
				break;
			case BABYLON.PointerEventTypes.POINTERWHEEL:
				//console.log("POINTER WHEEL");
				break;
			case BABYLON.PointerEventTypes.POINTERPICK:
				//console.log("POINTER PICK");
				break;
			case BABYLON.PointerEventTypes.POINTERTAP:
				//console.log("POINTER TAP");
				break;
			case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
				//console.log("POINTER DOUBLE-TAP");

				if('dpt' in pointerInfo.pickInfo.pickedMesh
				&& pointerInfo.pickInfo.pickedMesh.dpt.context == "topicScene") {
					//console.log("hit topicId: "+pointerInfo.pickInfo.pickedMesh.dpt.topicId);

					pointerInfo.pickInfo.pickedMesh.showBoundingBox = true;
					setTimeout(function() {
						pointerInfo.pickInfo.pickedMesh.showBoundingBox = false;
					}, 250);

					topicCamState = currentScene.cameras[0].storeState();
					currentTopic = pointerInfo.pickInfo.pickedMesh.dpt.topicId;
					currentTopicStr = pointerInfo.pickInfo.pickedMesh.dpt.topic;
					currentScene.dispose();
					currentScene = __opinionScene("opinionScene");
					currentScene.name = "opinionScene";
					dpt.getOpinionByTopic(currentTopic);
					jQuery('#topicForm').remove();
				}

				break;
		}
	});

	genericScene.onKeyboardObservable.add((kbInfo) => {
		switch (kbInfo.type) {
			case BABYLON.KeyboardEventTypes.KEYDOWN:
				/*
				console.log("KEY DOWN: ", kbInfo.event.key);
				var speed = camera._computeLocalCameraSpeed() * 20;
				if(kbInfo.event.key == 'PageUp') {
					camera._localDirection.copyFromFloats(0, 0, speed);
					camera.position.z += speed;
					console.log('fuck: '+speed);
				}
				*/
				break;
			case BABYLON.KeyboardEventTypes.KEYUP:
				//console.log("KEY UP: ", kbInfo.event.keyCode);
				break;
		}
	});


	//genericScene.autoClear = false; // Color buffer
	//genericScene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
	//genericScene.getAnimationRatio();
	//genericScene.clearCachedVertexData();
	//genericScene.cleanCachedTextureBuffer();
	return genericScene;
}

function focusAtCanvas() {
	document.getElementById('renderCanvas').focus();
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

		engine = new BABYLON.Engine(canvas, true); //, { preserveDrawingBuffer: true, stencil: true });
		//engine.doNotHandleContextLost = true;
		//engine.enableOfflineSupport = false;

		__topicScene = createGenericScene;
		__topicScene.name = 'topicScene';
		__opinionScene = createGenericScene;
		__opinionScene.name = 'opinionScene';
		currentScene = createGenericScene("topicScene");
		currentScene.name = 'topicScene';

		// Handle the incomming websocket trafic
		socket.on("connect", () => {
			// if needed, we could keep socket.id somewhere
			if(document.cookie) {
				dpt.userLogin(document.cookie);
			}
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
		});

		socket.on("api", function(restObj) {
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
		});

		//circlePoints(4, 2, {X: 0, Y: 0});

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
		console.log('window inactive');
		powerSave = true;
	});
	
	jQuery(window).focus(function() {
		console.log('window active');
		focusAtCanvas();
		powerSave = false;
	});
}

main();