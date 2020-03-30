function mapRange(num, in_min, in_max, out_min, out_max) {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

function circlePoints(topics, radius, center) {
  var points = topics.length;
  var slice = (2 * Math.PI) / 30; //points;
  var nodes = [];
  var startAngle = 0;
  var newZ = (points / 30 / 2) * 5;

  //	if(points % 2 == 0) {
  startAngle = -0 * (Math.PI / 360);
  //	}
  for (var i = 0; i < points; i++) {
    var angle = slice * (i % 30) + startAngle;
    var newX = center.X + radius * Math.cos(angle / 2);
    var newY = center.Y + radius * Math.sin(angle / 2);
    if (i % 30 == 0) {
      newZ -= 5;
    }
    nodes.push({ x: newX, y: newZ, z: newY });
  }
  return nodes;
}

function positions(topics) {
  var nodes = [];
  for (var i in topics) {
    var newX = Math.random() * 12 - 6;
    var newY = Math.random() * 12 - 6;
    var newZ = Math.random() * 12 - 6;
    nodes.push({ x: newX, y: newY, z: newZ });
  }
  return nodes;
}

module.exports.calculatePositions = async (topics) => {
  //	nodes = circlePoints(topics,32,{X: 0, Y: 0});
  nodes = positions(topics);
  for (var i in topics) {
    topics[i].position = nodes[i];
    topics[i]._doc.position = nodes[i];
  }
  return topics;
};
