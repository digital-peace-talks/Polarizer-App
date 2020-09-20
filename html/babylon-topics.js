function loadTopics(restObj) {

	var len = restObj.data.length;
	var cols = Math.ceil(Math.sqrt(len));

	var xstart = -cols*4.8/2 + 4.8/2;
	var ystart = cols*3.2/2 + 3.2/2;

	if(currentScene.name == 'topicScene') {
		for(var i = currentScene.meshes.length - 1; i >= 0; i--) {
			if('dpt' in currentScene.meshes[i]
			&& currentScene.meshes[i].dpt.context == 'topicScene') {
				currentScene.meshes[i].dispose();
			}
				document.querySelectorAll(".textBox").forEach(function(e){e.remove()});
		}
	}
	x = xstart;
	y = ystart;

	var planes = [];
	var divs = [];

	for(var i in restObj.data) {

		var plane = textBlock(
			restObj.data[i].position.x,
			restObj.data[i].position.y,
			restObj.data[i].position.z,
			JSON.stringify({
				"name": "texttexture",
				"context": "topicScene",
				"topicId": restObj.data[i]._id,
				"content": restObj.data[i].content,
				"topic": restObj.data[i].content,
				"canEdit": (restObj.data[i].user == 'mine') ? true : false,
			}),
			`${restObj.data[i].content} [${restObj.data[i].opinions.length}]`,
		);
		camera = currentScene.cameras[0];
		var htmlDiv = document.createElement("div");
		htmlDiv.className = "textBox";
		document.querySelector("#renderCanvas").insertAdjacentElement("afterend", htmlDiv);
		var needsUpdate = true;
		var defStyle = `background: #f0f0;
						top:${plane.position.y};
						left:${plane.position.x};
						pointer-events:none;
						width:50px; height:50px;
						z-index: 1; position: absolute;
						transform: translate(-50%, -50%);`;
		htmlDiv.style = defStyle;

		planes.push(plane);
		divs.push(htmlDiv);
	}
		camera.onProjectionMatrixChangedObservable.add(() => {
			needsUpdate = true;
		});

		camera.onViewMatrixChangedObservable.add(() => {
			needsUpdate = true;
		});
		currentScene.registerAfterRender(() => {
			if (needsUpdate) {
			planes.forEach(function (plane, i){ 

				// update text node position            
				const pos = BABYLON.Vector3.Project(
					plane.getAbsolutePosition(),
					BABYLON.Matrix.IdentityReadOnly,
					currentScene.getTransformMatrix(),
					camera.viewport.toGlobal(
						engine.getRenderWidth(),
						engine.getRenderHeight(),
					),
				);
				divs[i].style = `${defStyle} left: ${pos.x}px; top: ${pos.y}px;`;

				needsUpdate = false;
			}
			)}
		});
}

function searchResultTopics(restObj) {
	var cols = Math.ceil(Math.sqrt(restObj.data.length));

	var xstart = -cols*4.8/2 + 4.8/2;
	var ystart = cols*3.2/2 + 3.2/2;

	if(currentScene.name == 'topicScene') {
		for(var i = currentScene.meshes.length - 1; i >= 0; i--) {
			if('dpt' in currentScene.meshes[i]
			   && currentScene.meshes[i].dpt.context == 'topicScene') {
				currentScene.meshes[i].dispose();
			}
		}
	}
	if(restObj.data.length) {
		x = xstart;
		y = ystart;
		for(var i in restObj.data) {
			if(i % cols == 0) {
				x = xstart;
				y -= 3.2;
			} else {
				x += 4.8;
			}
			var plane = textBlock(
				x, y, 0,
				JSON.stringify({
					"context": "topicScene",
					"topicId": restObj.data[i].topicId,
					"topic": restObj.data[i].topic
				}),
				`${restObj.data[i].topic} ${restObj.data[i].count}`);
		}
		
	} else {
		var plane = textBlock(0,0,0, `{"context": "topicScene"}`, `Nothing found.`);
	}
}
