

function createBiColorTube(initiatorOpinion, recipientOpinion, opinionDialogConnections, status) {

	status = opinionDialogConnections.dialogStatus;
	var sv = new BABYLON.Vector3(initiatorOpinion.position);
	var ev = new BABYLON.Vector3(recipientOpinion.position);
	sv.x = initiatorOpinion.position.x;
	sv.y = initiatorOpinion.position.y;
	ev.x = recipientOpinion.position.x;
	ev.y = recipientOpinion.position.y;
	
	/*
https://stackoverflow.com/questions/50252070/svg-draw-connection-line-between-two-rectangles

Say you have two rects and you know the center of them (cx1, cy1) and (cx2, cy2).
You also have the width and height divided by 2 (i.e. the distance from the center
to the sides): (w1, h1) and (w2, h2).

The distance between them is:

var dx = cx2 - cx1;
var dy = cy2 - cy1;

Then you can calculate the intersection point for the two rects with:

var p1 = getIntersection(dx, dy, cx1, cy1, w1, h1);
var p2 = getIntersection(-dx, -dy, cx2, cy2, w2, h2);

Where getIntersection is:
	 */

	function getIntersection(dx, dy, cx, cy, w, h) {
		if (Math.abs(dy / dx) < h / w) {
			// Hit vertical edge of box1
			return [cx + (dx > 0 ? w : -w), cy + dy * w / Math.abs(dx)];
		} else {
			// Hit horizontal edge of box1
			return [cx + dx * h / Math.abs(dy), cy + (dy > 0 ? h : -h)];
		}
	};

	var dx = ev.x - sv.x;
	var dy = ev.y - sv.y

	var p1 = getIntersection(dx, dy, sv.x, sv.y, initiatorOpinion.size.x, initiatorOpinion.size.y);
	var p2 = getIntersection(-dx, -dy, ev.x, ev.y, recipientOpinion.size.x, recipientOpinion.size.y);
	
	sv.x = p1[0];
	sv.y = p1[1];
	ev.x = p2[0];
	ev.y = p2[1];
	

	var radius = 0.04;
	var occupacy = 0.85;
	if(status == "CLOSED") {
		radius = 0.08;
		occupacy = 0.95;
	}
	var tube = new BABYLON.MeshBuilder.CreateTube(
		"tube", {
			path: [sv, ev],
			radius: radius,
			updatable: true,
		},
		currentScene);

	tube.dpt = {
		context: 'tubeConnection',
		dialogId: opinionDialogConnections.dialogId,
		initiatorsOpinion: opinionDialogConnections.initiatorsOpinion,
		recipientsOpinion: opinionDialogConnections.recipientsOpinion,
		status: opinionDialogConnections.dialogStatus,
	};

	var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 32, currentScene);
	var ctx = dynamicTexture.getContext();

	var combination = '';
	if(initiatorOpinion.rating == 'negative') {
		combination = 'red-';
		if(recipientOpinion.rating == 'negative') {
			combination += 'red';
		} else if(recipientOpinion.rating == 'neutral') {
			combination += 'blue';
		} else if(recipientOpinion.rating == 'positive') {
			combination += 'green';
		} else if(recipientOpinion.rating == 'unset') {
			combination += 'grey';
		}

	} else if(initiatorOpinion.rating == 'neutral') {
		combination = 'blue-';
		if(recipientOpinion.rating == 'negative') {
			combination += 'red';
		} else if(recipientOpinion.rating == 'neutral') {
			combination += 'blue';
		} else if(recipientOpinion.rating == 'positive') {
			combination += 'green';
		} else if(recipientOpinion.rating == 'unset') {
			combination += 'grey';
		}

	} else if(initiatorOpinion.rating == 'positive') {
		combination = 'green-';
		if(recipientOpinion.rating == 'negative') {
			combination += 'red';
		} else if(recipientOpinion.rating == 'neutral') {
			combination += 'blue';
		} else if(recipientOpinion.rating == 'positive') {
			combination += 'green';
		} else if(recipientOpinion.rating == 'unset') {
			combination += 'grey';
		}

	} else if(initiatorOpinion.rating == 'unset') {
		combination += 'grey-';
		if(recipientOpinion.rating == 'negative') {
			combination += 'red';
		} else if(recipientOpinion.rating == 'neutral') {
			combination += 'blue';
		} else if(recipientOpinion.rating == 'positive') {
			combination += 'green';
		} else if(recipientOpinion.rating == 'unset') {
			combination += 'grey';
		}
	}

	var reverse = 0;
	if(combination == 'green-blue') {
		var reverse = 1;
		combination = 'blue-green';
	} else if(combination == 'green-red') {
		var reverse = 1;
		combination = 'red-green';
	} else if(combination == 'blue-red') {
		var reverse = 1;
		combination = 'red-blue';
	}

	if(combination.indexOf('grey') >= 0) {
		combination = 'grey-grey';
	}

	image = new Image();
	image.src = '/' + combination + '.png';

	image.onload = function() {

		if(reverse || 1) {
			ctx.translate(-16, 16);
			ctx.rotate(-90 * (Math.PI / 180));
			ctx.translate(-16, 16);
		} else {
			ctx.translate(16, -16);
			ctx.rotate(90 * (Math.PI / 180));
			ctx.translate(16, -16);
		}
		ctx.drawImage(this, 0, 0);
		dynamicTexture.update();
	};

	var mat = new BABYLON.StandardMaterial("mat", currentScene);
	//mat.alpha = 0.25;
	mat.alpha = occupacy;
	mat.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
	if(status == 'CLOSED') {
		// mat.alphaMode = BABYLON.Engine.ALPHA_COMBINED;
		// mat.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
		mat.alphaMode = BABYLON.Engine.ALPHA_ADD;
		// mat.alphaMode = BABYLON.Engine.ALPHA_MULTIPLY;
		// mat.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
	}
	mat.diffuseTexture = dynamicTexture;
	//mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
	tube.material = mat;

	//return(tube);
}

function dialogRelations(opinionDialogConnections) {
	var initiatorOpinion = {};
	var i;
	var recipientOpinion = {};
	for(var h in opinionDialogConnections) {
		var odc = opinionDialogConnections[h];
		for(i in odc) {
			for(var j in currentScene.meshes) {
				if('dpt' in currentScene.meshes[j]
				&& currentScene.meshes[j].dpt.context == 'opinionScene'
				&& currentScene.meshes[j].dpt.opinionId == h) {
					initiatorOpinion.position = currentScene.meshes[j].position;
					initiatorOpinion.opinionId = h;
					var bla = currentScene.meshes[j].getBoundingInfo();
					initiatorOpinion.size = currentScene.meshes[j].bjs;
					if(odc[i].leafs.negative.includes(h)) {
						initiatorOpinion.rating = 'negative';
					} else if(odc[i].leafs.neutral.includes(h)) {
						initiatorOpinion.rating = 'neutral';
					} else if(odc[i].leafs.positive.includes(h)) {
						initiatorOpinion.rating = 'positive';
					} else if(odc[i].leafs.unset.includes(h)) {
						initiatorOpinion.rating = 'unset';
					}
				}
			}
	
			for(var j in odc[i].leafs.negative) {
				var opinionId = odc[i].leafs.negative[j];
				if(opinionId != h) {
					for(var k in currentScene.meshes) {
						if('dpt' in currentScene.meshes[k]
						&& currentScene.meshes[k].dpt.context == 'opinionScene'
						&& currentScene.meshes[k].dpt.opinionId == opinionId) {
							recipientOpinion.position = currentScene.meshes[k].position;
							recipientOpinion.opinionId = opinionId;
							recipientOpinion.size = currentScene.meshes[k].bjs;
							recipientOpinion.rating = 'negative';
						}
					}
				}
			}
			for(var j in odc[i].leafs.neutral) {
				var opinionId = odc[i].leafs.neutral[j];
				if(opinionId != h) {
					for(var k in currentScene.meshes) {
						if('dpt' in currentScene.meshes[k]
						&& currentScene.meshes[k].dpt.context == 'opinionScene'
						&& currentScene.meshes[k].dpt.opinionId == opinionId) {
							recipientOpinion.position = currentScene.meshes[k].position;
							recipientOpinion.opinionId = opinionId;
							recipientOpinion.size = currentScene.meshes[k].bjs;
							recipientOpinion.rating = 'neutral';
						}
					}
				}
			}
			for(var j in odc[i].leafs.positive) {
				var opinionId = odc[i].leafs.positive[j];
				if(opinionId != h) {
					for(var k in currentScene.meshes) {
						if('dpt' in currentScene.meshes[k]
						&& currentScene.meshes[k].dpt.context == 'opinionScene'
						&& currentScene.meshes[k].dpt.opinionId == opinionId) {
							recipientOpinion.position = currentScene.meshes[k].position;
							recipientOpinion.opinionId = opinionId;
							recipientOpinion.size = currentScene.meshes[k].bjs;
							recipientOpinion.rating = 'positive';
						}
					}
				}
			}
			/*
			if('position' in initiatorOpinion && 'position' in recipientOpinion) {
				createBiColorTube(initiatorOpinion, recipientOpinion, opinionDialogConnections, opinionDialogConnections[initiatorOpinion.opinionId].dialogStatus);
			}
			*/
			for(var j in odc[i].leafs.unset) {
				var opinionId = odc[i].leafs.unset[j];
				if(opinionId != h) {
					for(var k in currentScene.meshes) {
						if('dpt' in currentScene.meshes[k]
						&& currentScene.meshes[k].dpt.context == 'opinionScene'
						&& currentScene.meshes[k].dpt.opinionId == opinionId) {
							recipientOpinion.position = currentScene.meshes[k].position;
							recipientOpinion.opinionId = opinionId;
							recipientOpinion.size = currentScene.meshes[k].bjs;
							recipientOpinion.rating = 'unset';
						}
					}
				}
			}
	
			if('position' in initiatorOpinion
			&& 'position' in recipientOpinion) {
			//&&	opinionDialogConnections[initiatorOpinion.opinionId].dialogStatus == 'CLOSED') {
				createBiColorTube(initiatorOpinion, recipientOpinion, odc[i], h);
			}
			//		return(createBiColorTube(currentScene.meshes[k].dpt.opinionId, sv, ev));
		}
	}
}




function loadOpinions(restObj) {
	var i;
	var options = '';
	var canInvite = false;

	if(currentScene.name == 'opinionScene') {
		for(var i in currentScene.meshes) {
			/*
			if('dpt' in currentScene.meshes[i]) {
				if(currentScene.meshes[i].dpt.context == 'opinionScene'
				|| currentScene.meshes[i].name == 'tube'
				|| currentScene.meshes[i].name == 'icon') {
				*/
			if(currentScene.meshes[i].name != 'collisionBox') {
				currentScene.meshes[i].dispose();
			}
			/*
				}
			}
				*/
		}
	}

	var n = Math.floor((Math.sqrt(restObj.data.length)));
	var x = 0 - Math.floor(n / 2) * 10,
		xstart = x;
	xmax = (n - 1) * 10;
	var y = ymax = (n - 1) * 2.5;
	ystart = ymax;
	y = ystart;

	var opinionDialogConnections = {};
	for(var i = 0; i < restObj.data.length; i++) {
		if('topos' in restObj.data[i]) {
			opinionDialogConnections[restObj.data[i]._id] = restObj.data[i].topos;
		}
	}
	for(var i = 0; i < restObj.data.length; i++) {
		if(restObj.data[i].user == 'mine') {
			canInvite = true;
		}
	}

	var nodes = circlePoints(restObj.data.length, 5, { X: 4, Y: 0 });
	for(var i = 0; i < restObj.data.length; i++) {
		options = '';
		if(restObj.data[i].user == 'mine') {
			canInvite = true;
		}
		if(restObj.data[i].user == 'mine') {
			options = '<span class="editOpinion" id="' +
				restObj.data[i]._id +
				'">&#128393;</span>';
		} else {
			if(restObj.data[i].blocked == 0 &&
				canInvite) {
				options = '<span class="inviteToDialog" id="' +
					restObj.data[i]._id +
					'">' +
					'&#128172;' +
					'</span>';
			}
		}

		var plane = textBlock(
			nodes[i].x, nodes[i].y, 0,
			JSON.stringify({ "context": "opinionScene", "opinionId": restObj.data[i]._id }),
			`${restObj.data[i].content}`);

		plane.actionManager = new BABYLON.ActionManager(currentScene);

		//ON MOUSE ENTER
		plane.actionManager.registerAction(
			new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger,
				function(ev) {
					var meshLocal = ev.meshUnderPointer;
					meshLocal.scaling.x *= 1.5;
					meshLocal.scaling.y *= 1.5;
					//meshLocal.position.y += 2;
					canvas.style.cursor = "move";
				}, false));

		//ON MOUSE EXIT
		plane.actionManager.registerAction(
			new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger,
				function(ev) {
					var meshLocal = ev.meshUnderPointer;
					meshLocal.scaling.x /= 1.5;
					//meshLocal.position.y -= 2;
					meshLocal.scaling.y /= 1.5;
					canvas.style.cursor = "default";
				}, false));


		if(canInvite && restObj.data[i].user != 'mine'
		&& restObj.data[i].blocked == 1) {
			var mat = new BABYLON.StandardMaterial("icon", currentScene);
			mat.diffuseTexture = new BABYLON.Texture("/chatbubble.png", currentScene);
			mat.emissiveColor = new BABYLON.Color3(0.0, 0.8, 1);
			//	mat.alpha = .95;
			mat.alphaMode = BABYLON.Engine.ALPHA_ADD;
			mat.opacityTexture = mat.diffuseTexture;

			//	var icon = BABYLON.MeshBuilder.CreatePlane("icon", { width: 0.35, height: 0.25 }, currentScene);
			var icon = BABYLON.MeshBuilder.CreatePlane(
				"icon",
				{
					width: 0.35,
					height: 0.35
				}, currentScene);
			icon.parent = plane;
			icon.position.x -= plane.geometry.extend.maximum.x + 0.2;
			icon.position.y += plane.geometry.extend.maximum.y - 0.4;
			icon.position.z = plane.position.z - 0.10;
			icon.material = mat;
			icon.dpt = { context: 'dialogInvitation', opinionId: restObj.data[i]._id };
		}

		/*
		x+=10;
		if(x > xmax) {
			y -= 2.5;
			x=xstart;
		}
		jQuery('div.col.mid').append('<li class="connector" id="'+ restObj.data[i]._id +'"><span class="text">'
			+ restObj.data[i].content
			+ "</span> " +options+ ' <span class="connector" id="'+ restObj.data[i]._id +'"></span></li><br>');
		*/
	}


	if(restObj.data.length > 0) {
		//				dpt.opinionPostAllowed(restObj.data[0].topic);
	} else {
		//				opinionForm();
	}
	//			opinionEdit();

	//			circleTextPlane(1.5, 1.2, 0, 'bla', currentTopicStr + " * ");
	var plane = textBlock(
			12.8/3, -19.2/8, 3.001,
			JSON.stringify({ "context": "opinionTopic" }),
			currentTopicStr, {fontSize: 128, width: 19.2, height: 12.8, color: "#550033"});
	dialogRelations(opinionDialogConnections);
}

