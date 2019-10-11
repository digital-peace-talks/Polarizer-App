function loadTopics(restObj) {

	var len = restObj.data.length;
	var cols = Math.ceil(Math.sqrt(len));

	var xstart = -cols*4.8/2;
	var ystart = cols*3.2/2;
	console.log(`xstart: ${xstart} - ystart ${ystart}`);
var box = new BABYLON.MeshBuilder.CreateBox("box", {width: 1, height: 1, depth: 1,}, currentScene);
box.position = new BABYLON.Vector3(0,0,0);

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
			x, y, 0,
			JSON.stringify({
				"context": "topicScene",
				"topicId": restObj.data[l]._id,
				"topic": restObj.data[l].content
			}),
			`${restObj.data[l].content} [ ${restObj.data[l].opinions.length} ]`);
	}
}
