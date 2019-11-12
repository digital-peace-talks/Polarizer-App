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
		}
	}
	x = xstart;
	y = ystart;
	for(var i in restObj.data) {
		if(i % cols == 0) {
			x = xstart;
			y -= 3.2;
		} else {
			x += 4.8;
		}
		var l = len - 1 - i;
		var plane = textBlock(
			x, y, -2,
			JSON.stringify({
				"name": "texttexture",
				"context": "topicScene",
				"topicId": restObj.data[l]._id,
				"content": restObj.data[l].content,
				"topic": restObj.data[l].content,
				"canEdit": (restObj.data[l].user == 'mine') ? true : false
			}),
			`${restObj.data[l].content} [${restObj.data[l].opinions.length}]`,
			);
		/*
		if(restObj.data[l].user == 'mine') {
			var mat = new BABYLON.StandardMaterial("icon", currentScene);
			mat.diffuseTexture = new BABYLON.Texture("/Edit_icon.png", currentScene);
			mat.emissiveColor = new BABYLON.Color3(0, 0.5, 1);
			mat.opacityTexture = mat.diffuseTexture;

			var icon = BABYLON.MeshBuilder.CreatePlane(
				"icon",
				{
					width: 0.35,
					height: 0.35
				}, currentScene);

			icon.parent = plane;
			icon.position.x -= plane.geometry.extend.maximum.x + 0.2;
			icon.position.y += plane.geometry.extend.maximum.y - 0.4;

			icon.material = mat;
			icon.dpt = { context: 'editTopic', topicId: restObj.data[l]._id, content: restObj.data[l].content };
		}
		*/
	}
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
				`${restObj.data[i].topic} [${restObj.data[i].count}]`);
		}
	} else {
		var plane = textBlock(0,0,0, `{"context": "topicScene"}`, `Nothing found.`);
	}
}
