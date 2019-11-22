function mapRange(num, in_min, in_max, out_min, out_max) {
	return ((num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
}

function positions(topics) {
	var nodes = [];
	for(var i in topics) {
		var newX = Math.random() * 8 - 4; 
		var newY = Math.random() * 8 - 4; 
		var newZ = Math.random() * 8 - 4; 
		nodes.push({ "x": newX, "y": newY, "z": newZ });
	}
	return (nodes);
}

module.exports.calculatePositions = async (topics) => {
	nodes = positions(topics);
	for(var i in topics) {
		topics[i].position = nodes[i];
		topics[i]._doc.position = nodes[i];
	}
	return(topics);
}