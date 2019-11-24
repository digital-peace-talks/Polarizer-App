
function positions(topics) {
	var nodes = [];
	for(var i in topics) {
		var newX = Math.random() * 12 - 6; 
		var newY = Math.random() * 12 - 6; 
		var newZ = Math.random() * 12 - 6; 
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