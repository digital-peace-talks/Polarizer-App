
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
		height: 60,
		depth: 80,
		sideOrientation: 1
	}, currentScene);

	box.position = new BABYLON.Vector3(0, 0, -39.85);
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

	var camera = new BABYLON.ArcRotateCamera(
			"Camera",
			-Math.PI/2,
			Math.PI/2,
			35,
			new BABYLON.Vector3(0, 0, 0),
			currentScene);

	// camera
	camera.wheelPrecision = 30;
	camera.panningSensibility = 300;
	camera.pinchDeltaPercentage = 0.001;
	camera.pinchToPanMaxDistance = 124;

	camera.lowerRadiusLimit = 1;
	camera.upperRadiusLimit = 250;
		
	camera.lowerAlphaLimit = 0.0174533 * -179;
	camera.upperAlphaLimit = 0.0174533 * 180;
	camera.lowerBetaLimit = 0.0174533 * 0;
	camera.upperBetaLimit = 0.0174533 * 179;
	
	camera.panningDistanceLimit = 35;

	camera.panningAxis = new BABYLON.Vector3(1, 1, 0);
	//camera.setTarget(BABYLON.Vector3.Zero());

	if(currentScene.dptMode == "topicScene") {
		camera.radius = 15;
		if(topicCamState) {
			camera.setPosition(topicCamState.position);
			camera.setTarget(topicCamState.target);
			camera.alpha = topicCamState.alpha;
			camera.beta = topicCamState.beta;
			camera.radius = topicCamState.radius;
		}

	} else if(currentScene.dptMode == "opinionScene") {
		//camera.setPosition(new BABYLON.Vector3(0,0,-20));
		if(opinionCamState) {
			camera.setPosition(opinionCamState.position);
			camera.setTarget(opinionCamState.target);
			camera.alpha = opinionCamState.alpha;
			camera.beta = opinionCamState.beta;
			camera.radius = opinionCamState.radius;
		}
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

function createPitchLines() {
	var mat = new BABYLON.StandardMaterial("pitchline", currentScene);
	mat.diffuseTexture = new BABYLON.Texture("/pitch-line.png", currentScene);
	/*
	*/
	mat.alpha = .95;
	mat.alphaMode = BABYLON.Engine.ALPHA_ADD;
	mat.diffuseTexture.hasAlpha = true;
	mat.diffuseTexture.uScale=256;
	mat.diffuseTexture.vScale=1;
	mat.diffuseTexture.wrapU=1;
	mat.diffuseTexture.wrapV=1;
	mat.specularColor = new BABYLON.Color3.Black;
	mat.emissiveColor = new BABYLON.Color3(0.8, 0.8, 0.8);
	mat.backFaceCulling = false;
	
	//	var icon = BABYLON.MeshBuilder.CreatePlane("icon", { width: 0.35, height: 0.25 }, currentScene);
	var pitchLine = BABYLON.MeshBuilder.CreatePlane(
		"pitchline",
		{
			width: 1024,
			height: 1024,
		}, currentScene);

	pitchLine.position.x = 0;
	pitchLine.position.y = 0;
	pitchLine.position.z = 0;

	pitchLine.material = mat;
	
	var pitchLine = BABYLON.MeshBuilder.CreatePlane(
			"pitchline",
			{
				width: 1024,
				height: 1024,
			}, currentScene);

		pitchLine.position.x = 0;
		pitchLine.position.y = 0;
		pitchLine.position.z = 0;
		pitchLine.rotation.y = Math.PI / 180 * 90;

		pitchLine.material = mat;
		
		var pitchLine = BABYLON.MeshBuilder.CreatePlane(
				"pitchline",
				{
					width: 1024,
					height: 1024,
				}, currentScene);

		pitchLine.position.x = 0;
		pitchLine.position.y = 0;
		pitchLine.position.z = 0;
		pitchLine.rotation.z = Math.PI / 180 * 90;

		pitchLine.material = mat;
		
		var pitchLine = BABYLON.MeshBuilder.CreatePlane(
				"pitchline",
				{
					width: 1024,
					height: 1024,
				}, currentScene);

		pitchLine.position.x = 0;
		pitchLine.position.y = 0;
		pitchLine.position.z = 0;
		pitchLine.rotation.y = Math.PI / 180 * 90;
		pitchLine.rotation.z = Math.PI / 180 * 90;

		pitchLine.material = mat;
		
		var pitchLine = BABYLON.MeshBuilder.CreatePlane(
				"pitchline",
				{
					width: 1024,
					height: 1024,
				}, currentScene);

		pitchLine.position.x = 0;
		pitchLine.position.y = 0;
		pitchLine.position.z = 0;
		pitchLine.rotation.x = Math.PI / 180 * 90;
		pitchLine.rotation.z = Math.PI / 180 * 90;

		pitchLine.material = mat;
		
		var pitchLine = BABYLON.MeshBuilder.CreatePlane(
				"pitchline",
				{
					width: 1024,
					height: 1024,
				}, currentScene);

		pitchLine.position.x = 0;
		pitchLine.position.y = 0;
		pitchLine.position.z = 0;
		pitchLine.rotation.x = Math.PI / 180 * 90;
		pitchLine.rotation.y = Math.PI / 180 * 90;
		pitchLine.rotation.z = Math.PI / 180 * 90;

		pitchLine.material = mat;
}

var createGenericScene = function(dptMode) {

	var genericScene = new BABYLON.Scene(engine);
	BABYLON.Scene.DoubleClickDelay = 500;

	currentScene = genericScene;
	currentScene.dptMode = dptMode;

	// lights - no light!!
	var light = new BABYLON.HemisphericLight(
			"light1",
			new BABYLON.Vector3(0, 0, -1),
			genericScene);

	light.radius = 10;
	light.diffuse = new BABYLON.Color3(1, 0.8, 0.8);
	light.intensity = 0.5;

	switch(whoami.user.preferences.colorScheme) {
		case DPTConst.COLORS_dark:
			genericScene.clearColor = new BABYLON.Color3(0, 0.1, 0.2);
			break;
		case DPTConst.COLORS_bright:
			genericScene.clearColor = new BABYLON.Color3(.7, 0.9, 1.0);
			break;
		case DPTConst.COLORS_default:
		default:
			genericScene.clearColor = new BABYLON.Color3(10 / 255, 80 / 255, 119 / 255);
	}

	var camera = getCamera();
	camera.attachControl(canvas, true);

	//initVirtJoysticks();
	//pauseEngine();

	// Enable Collisions
	//var box = getCollisionBox();
	//box.checkCollisions = true;

	if(whoami.user.preferences.colorScheme == DPTConst.COLORS_skybox) {
		var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, currentScene);
		var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", currentScene);
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/skybox/space2", currentScene);
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		skyboxMaterial.backFaceCulling = false;
		skyboxMaterial.disableLighting = true;
		skybox.material = skyboxMaterial;
	}

	camera.checkCollisions = true;
	genericScene.collisionsEnabled = true;

//	createPitchLines();
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

					// catch the icon button on the canvas
					// "To get the axis aligned version of your picked
					// coordinates, you need to transform it by the inverse of
					// the mesh world matrix. discussed on here:
					// https://forum.babylonjs.com/t/how-to-calculate-the-rotation-from-the-billboard-picked-point-position/6667/11
					var inverse = BABYLON.Matrix.Invert(pointerInfo.pickInfo.pickedMesh.getWorldMatrix());
					// click point
					var click = BABYLON.Vector3.TransformCoordinates(pointerInfo.pickInfo.pickedPoint, inverse)
					click.x = pointerInfo.pickInfo.pickedMesh._geometry.extend.maximum.x + click.x;
					click.y = pointerInfo.pickInfo.pickedMesh._geometry.extend.maximum.y - click.y;

					if(click.y < .36) {
						if(click.x >=0 && click.x < .36) {
							// invite to chat via proposition
							if('opinionId' in pointerInfo.pickInfo.pickedMesh.dpt
							&& pointerInfo.pickInfo.pickedMesh.dpt.context == "opinionScene"
							&& pointerInfo.pickInfo.pickedMesh.name == "texttexture"
							&& pointerInfo.pickInfo.pickedMesh.dpt.canInvite == true) {

								propositionForm(pointerInfo.pickInfo.pickedMesh.dpt.opinionId, currentTopic);
								return;
							}
						} else if(click.x >= .36 && click.x < .72) {
							// edit either the opinion or the topic
							if('opinionId' in pointerInfo.pickInfo.pickedMesh.dpt
							&& pointerInfo.pickInfo.pickedMesh.dpt.context == "opinionScene"
							&& pointerInfo.pickInfo.pickedMesh.name == "texttexture"
							&& pointerInfo.pickInfo.pickedMesh.dpt.canEdit == true) {
								opinionEdit(pointerInfo.pickInfo.pickedMesh.dpt);
								return;
							}
							if('topicId' in pointerInfo.pickInfo.pickedMesh.dpt
							&& pointerInfo.pickInfo.pickedMesh.dpt.context == "topicScene"
							&& pointerInfo.pickInfo.pickedMesh.name == "texttexture"
							&& pointerInfo.pickInfo.pickedMesh.dpt.canEdit == true) {
								topicEdit(pointerInfo.pickInfo.pickedMesh.dpt);
								return;
							}
						}
					}
					if(pointerInfo.pickInfo.pickedMesh.dpt.context == "tubeConnection") {

						if(pointerInfo.pickInfo.pickedMesh.dpt.status == "CLOSED") {
							for(var i in currentScene.meshes) {
								if('dpt' in currentScene.meshes[i]
								&& currentScene.meshes[i].dpt.context == "tubeConnection"
								&& currentScene.meshes[i].dpt.initiatorOpinion == pointerInfo.pickInfo.pickedMesh.dpt.recipientsOpinion
								&& currentScene.meshes[i].dpt.recipientOpinion == pointerInfo.pickInfo.pickedMesh.dpt.initiatorOpinion) {
									alert("found one second dialog between both.");
								}
							}
							currentDialog = {
								dialog: pointerInfo.pickInfo.pickedMesh.dpt.dialogId,
								topic: currentTopicStr,
								initiatorOpinion: pointerInfo.pickInfo.pickedMesh.dpt.initiatorsOpinion,
								recipientOpinion: pointerInfo.pickInfo.pickedMesh.dpt.recipientsOpinion,
							};
							dpt.getDialogSet(currentDialog.dialog);
						}

					} else if(pointerInfo.pickInfo.pickedMesh.dpt.context == "topicScene") {

						//console.log("hit topicId: "+pointerInfo.pickInfo.pickedMesh.dpt.topicId);
						jQuery("#form").remove();
						formVisible = false;

						topicCamState = currentScene.cameras[0].storeState();
						currentTopic = pointerInfo.pickInfo.pickedMesh.dpt.topicId;
						currentTopicStr = pointerInfo.pickInfo.pickedMesh.dpt.topic;
						currentScene.dispose();
						currentScene = __opinionScene("opinionScene");
						currentScene.name = "opinionScene";
						dpt.getOpinionByTopic(currentTopic);

					} else if(pointerInfo.pickInfo.pickedMesh.dpt.context == "opinionScene") {
							
						opinionContext(pointerInfo.pickInfo.pickedMesh.dpt);
						
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
				/*
				switch(kbInfo.event.code) {
					case "KeyF":
						requestSearch();
						break;
					case "KeyH":
						switchToTopics();
						break;
					case "KeyL":
						toggleDialogList();
						break;
					case "KeyO":
						if(currentScene.name == "opinionScene") {
							jQuery('#form').remove();
							dpt.opinionPostAllowed(currentTopic);
						}
						break;
					case "KeyT":
						if(currentScene.name == "topicScene") {
							jQuery('#form').remove();
							topicForm();
						}
						break;
				}
				*/
		}
	});


	//var gl = new BABYLON.GlowLayer("glow", currentScene);
	
	//genericScene.autoClear = false; // Color buffer
	//genericScene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
	//genericScene.getAnimationRatio();
	//genericScene.clearCachedVertexData();
	//genericScene.cleanCachedTextureBuffer();
	
	return genericScene;
}