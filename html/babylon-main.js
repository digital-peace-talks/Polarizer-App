function createAvatar(avatarInfo, camera) {
	var name;
	if(!avatarInfo && camera) {
		var name = dpt.getSocketId();
	} else {
		name = avatarInfo.avatar;
	}
	var avatar = BABYLON.MeshBuilder.CreateBox(
		name,
		{
			width: 0.35,
			height: 0.35,
			depth: 0.35
		}, currentScene);
	if(camera) {
		avatar.position = new BABYLON.Vector3(0,0,0);
		avatar.parent = camera;
		avatar.position.z = camera.position.z - 1.3;
//		avatar.position.z = camera.position.y + 1.3;
		var socket = dpt.getSocket();
		socket.emit('3d', { event: 'connect', avatar: name, avatarPos: avatar.position });
		setInterval(() => {
			socket.emit('3d', { event: 'update', avatar: name, avatarPos: currentScene.cameras[0].position });
		}, 1000);
	} else {
		avatar.position = avatarInfo.avatarPos;
	}
//	avatar.position = camera.position;
	var mat = new BABYLON.StandardMaterial("avatar", currentScene);
	mat.diffuseColor = new BABYLON.Color3(1,1,0);
	mat.emissiveColor = new BABYLON.Color3(1,1,0);
	avatar.material = mat;
}

function disposeAvatar(avatarInfo) {
	for(var i in currentScene.meshes) {
		if(currentScene.meshes[i].name == avatarInfo.avatar) {
			currentScene.meshes[i].dispose();
			break;
		}
	}
}

function updateAvatar(avatarInfo) {
	var mySocketId = dpt.getSocketId();
	var done = false;
	if(avatarInfo.avatar != mySocketId) {
		for(var i in currentScene.meshes) {
			if(currentScene.meshes[i].name == avatarInfo.avatar) {
				currentScene.meshes[i].position = avatarInfo.avatarPos;
				done = true;
				break;
			}
		}
		if(!done) {
			createAvatar(avatarInfo);
		}
	}
}

function getCollisionBox() {
	//Simple box
	var box = new BABYLON.MeshBuilder.CreateBox("collisionBox", 
	{
		width: 100,
		height: 30,
		depth: 40,
		sideOrientation: 1
	}, currentScene);

	box.position = new BABYLON.Vector3(7.5, 2.5, -19.85);
	//create material
	var mat = new BABYLON.StandardMaterial("mat", currentScene);
	mat.diffuseColor = new BABYLON.Color3(10 / 255, 80 / 255, 119 / 255);
	mat.specularColor = new BABYLON.Color3(10 / 255, 80 / 255, 119 / 255);
	//mat.Color = new BABYLON.Color3(10 / 255, 80 / 255, 119 / 255);
	mat.emissiveColor = new BABYLON.Color3(10 / 255, 80 / 255, 119 / 255);
	mat.alpha = 0.45;
	
	//mat.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
	

	//apply material
	box.material = mat;
	//mat.freeze();

	return (box);
}

function getCamera(rotate) {

	var camera;
	// camera
	if(currentScene.dptMode == "topicScene") {
		console.log('ts cam');
		if(touchScreen) {
			
			camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/2, 0, new BABYLON.Vector3(0, 0, 0), currentScene);

		    // This positions the camera
		    camera.setPosition(new BABYLON.Vector3(0, 0, -15));
		    
			camera.panningSensibility = 300;
		    camera.pinchDeltaPercentage = 0.001;
		    camera.pinchToPanMaxDistance = 124;

			camera.lowerRadiusLimit = 1;
			camera.upperRadiusLimit = 35;
				
			camera.lowerAlphaLimit = 0.0174533 * -115;
			camera.upperAlphaLimit = 0.0174533 * -65;
			camera.lowerBetaLimit = 0.0174533 * 65;
			camera.upperBetaLimit = 0.0174533 * 115;

			camera.panningAxis = new BABYLON.Vector3(1, 1, 0);

			// This targets the camera to scene origin
		    camera.setTarget(BABYLON.Vector3.Zero());
			
			
		} else {
			camera = new BABYLON.FlyCamera("FlyCamera",
				new BABYLON.Vector3(2.5, 4.5, -15), currentScene);
		}

		if(topicCamState) {
			camera.position = topicCamState.position;
			camera.rotation = topicCamState.rotation;
			camera.direction = topicCamState.direction;
		}
	}
	if(currentScene.dptMode == "opinionScene") {
		console.log('os cam');
		if(touchScreen) {
			
			camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI/2, 0, new BABYLON.Vector3(0, 0, 0), currentScene);

		    // This positions the camera
		    camera.setPosition(new BABYLON.Vector3(0, 0, -15));
		    
			camera.panningSensibility = 300;
		    camera.pinchDeltaPercentage = 0.001;
		    camera.pinchToPanMaxDistance = 124;

			camera.lowerRadiusLimit = 1;
			camera.upperRadiusLimit = 35;
				
			camera.lowerAlphaLimit = 0.0174533 * -115;
			camera.upperAlphaLimit = 0.0174533 * -65;
			camera.lowerBetaLimit = 0.0174533 * 65;
			camera.upperBetaLimit = 0.0174533 * 115;

			camera.panningAxis = new BABYLON.Vector3(1, 1, 0);

			// This targets the camera to scene origin
		    camera.setTarget(BABYLON.Vector3.Zero());

		} else {
			camera = new BABYLON.FlyCamera("FlyCamera",
				new BABYLON.Vector3(4.5, 1.0, -15), currentScene);
		}

		if(opinionCamState) {
			camera.position = opinionCamState.position;
			camera.rotation = opinionCamState.rotation;
			camera.direction = opinionCamState.direction;
		}
	}

	if(!touchScreen) {
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
	
	}
	
	// createAvatar(false, camera);

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
				(engine.getDeltaTime() / (1000 - 1 * camVec.z * camVec.z)) * movespeed;
//				(engine.getDeltaTime() / (1000 - 2 * camVec.z * camVec.z)) * movespeed;
			if(camVec.z > 0) {
				camVec.z = -30;
			} else if(camVec.z < -35) {
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

	//initVirtJoysticks();
	//pauseEngine();

	// Enable Collisions
	var box = getCollisionBox();
	box.checkCollisions = true;
	camera.checkCollisions = true;
	genericScene.collisionsEnabled = true;

	createGUIScene(dptMode);


	genericScene.onPointerObservable.add((pointerInfo) => {
		idleSince = BABYLON.Tools.Now;
		powerSave = false;
		switch (pointerInfo.type) {
			case BABYLON.PointerEventTypes.POINTERDOWN:
				//console.log("POINTER DOWN");
				break;
			case BABYLON.PointerEventTypes.POINTERTAP:
				//console.log("POINTER TAP");

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

					} else if(pointerInfo.pickInfo.pickedMesh.dpt.context == "topicScene") {

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
			case BABYLON.PointerEventTypes.POINTERUP:
				//console.log("POINTER UP");
				break;
			case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
				//console.log("POINTER DOUBLE-TAP");
				break;
		}
	});

	genericScene.onKeyboardObservable.add((kbInfo) => {
		idleSince = BABYLON.Tools.Now;
		powerSave = false;
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
				/*
				var socket = dpt.getSocket();
				socket.emit('3d', { event: 'update', avatar: socket.id, avatarPos: currentScene.cameras[0].position });
				console.log('sended');
				*/
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