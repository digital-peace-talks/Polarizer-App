function mapRange(num, in_min, in_max, out_min, out_max) {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

function circlePoints(opinions, radius, center) {
  var points = opinions.length;
  var slice = (2 * Math.PI) / points;
  var nodes = [];
  var startAngle = 0;

  if (points % 2 == 0) {
    startAngle = (1 / 2) * Math.PI * 45;
  }
  for (var i = 0; i < points; i++) {
    var angle = slice * i + startAngle;
    var newX = center.X + radius * Math.cos(angle);
    var newY = center.Y + radius * Math.sin(angle);
    var newZ = Math.sin((1 / Math.PI) * mapRange(i, 0, points, 0, 359)) * 7 - 8;
    nodes.push({ x: newX, y: newY, z: newZ });
  }
  return nodes;
}

module.exports.calculatePositions = async (opinions) => {
  nodes = circlePoints(opinions, 8, { X: 0, Y: 0 });
  for (var i in opinions) {
    opinions[i].topic = opinions[i].topic._id;
    opinions[i].position = nodes[i];
    opinions[i]._doc.position = nodes[i];
  }
  return opinions;
};
