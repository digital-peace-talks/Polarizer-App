function loadTopics(restObj) {

	var options = '';

	var n = Math.floor((Math.sqrt(restObj.data.length)));
	var x = 0 - Math.floor(n / 2) * 4.8,
		xstart = x;
	xmax = (n / 2) * 4.8;
	var y = ymax = (n - 1) * 3.2;
	ystart = ymax;
	y = ystart;

	if(currentScene.name == 'topicScene') {
		for(var i in currentScene.meshes) {
			if('dpt' in currentScene.meshes[i]
			&& currentScene.meshes[i].dpt.context == 'topicScene') {
				currentScene.meshes[i].dispose();
			}
		}
	}
	for(var i in restObj.data) {
		if(restObj.data[i].user == 'mine') {
			options = '<span class="editTopic" id="' +
				restObj.data[i]._id +
				'">&#128393;</span>';
		} else {
			options = '';
		}
		var plane = textBlock(
			x, y, 0,
			JSON.stringify({
				"context": "topicScene",
				"topicId": restObj.data[i]._id,
				"topic": restObj.data[i].content
			}),
			`${restObj.data[i].content} [ ${restObj.data[i].opinions.length} ]`);
		x += 4.8;
		if(x > xmax) {
			y -= 3.2;
			x = xstart;
		}
		/*
			jQuery('div.col.left').append(
				'<li> <a class="opinionlist" id="'
				+ restObj.data[i]._id
				+ '" href="#">'
				+ restObj.data[i].content
				+ "</a>"
				+ ' [' + restObj.data[i].opinions.length + '] '
				+ options+"</li><br>");
		*/
	}
	//topicEdit();
	//topicForm();
}
