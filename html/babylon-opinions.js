function moveConnection(plane1, plane2, edge) {
  return BABYLON.MeshBuilder.CreateTube(name, {
    path: [plane1.position, plane2.position],
    instance: edge,
  });
}

function makePlanesDragable(opinion1, opinion2, edge) {
  var plane1;
  var plane2;

  // find the text meshes
  for (var i in currentScene.meshes) {
    if (currentScene.meshes[i].id != "texttexture") {
      continue;
    }
    if (currentScene.meshes[i].dpt.opinionId == opinion1) {
      plane1 = currentScene.meshes[i];
    }
    if (currentScene.meshes[i].dpt.opinionId == opinion2) {
      plane2 = currentScene.meshes[i];
    }
  }

  // make them dragable
  plane1.pointerDragBehavior = new BABYLON.PointerDragBehavior({
    name: "drag1",
    dragPlaneNormal: new BABYLON.Vector3(0, 0, 1),
  });
  plane1.pointerDragBehavior.onDragObservable.add((event, b, c) => {
    moveConnection(plane1, plane2, edge);
  });
  plane1.addBehavior(plane1.pointerDragBehavior);

  plane2.pointerDragBehavior = new BABYLON.PointerDragBehavior({
    name: "drag2",
    dragPlaneNormal: new BABYLON.Vector3(0, 0, 1),
  });
  plane2.pointerDragBehavior.onDragObservable.add((event, b, c) => {
    moveConnection(plane1, plane2, edge);
  });
  plane2.addBehavior(plane2.pointerDragBehavior);
}

function recipientRating(rating) {
  switch (rating) {
    case "negative":
      return "red";
    case "neutral":
      return "blue";
    case "positive":
      return "green";
    case "unset":
    default:
      return "grey";
  }
}

function createBiColorTube(
  initiatorOpinion,
  recipientOpinion,
  opinionDialogConnections
) {
  var status = opinionDialogConnections.dialogStatus;
  var emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
  var distance = 0;

  if (status == "PENDING") {
    //		return;
  }
  var sv = new BABYLON.Vector3(initiatorOpinion.position);
  var ev = new BABYLON.Vector3(recipientOpinion.position);
  sv.x = initiatorOpinion.position.x;
  sv.y = initiatorOpinion.position.y;
  sv.z = initiatorOpinion.position.z;
  ev.x = recipientOpinion.position.x;
  ev.y = recipientOpinion.position.y;
  ev.z = recipientOpinion.position.z;

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
      return [cx + (dx > 0 ? w : -w), cy + (dy * w) / Math.abs(dx)];
    } else {
      // Hit horizontal edge of box1
      return [cx + (dx * h) / Math.abs(dy), cy + (dy > 0 ? h : -h)];
    }
  }

  var dx = ev.x - sv.x;
  var dy = ev.y - sv.y;

  var p1 = getIntersection(
    dx,
    dy,
    sv.x,
    sv.y,
    initiatorOpinion.size.x / 2,
    initiatorOpinion.size.y / 2
  );
  var p2 = getIntersection(
    -dx,
    -dy,
    ev.x,
    ev.y,
    recipientOpinion.size.x / 2,
    recipientOpinion.size.y / 2
  );

  sv.x = p1[0];
  sv.y = p1[1];
  //sv.z += 0.4;
  ev.x = p2[0];
  ev.y = p2[1];
  //ev.z += 0.4;

  distance = Math.sqrt(
    Math.pow(sv.x - ev.x, 2) +
      Math.pow(sv.y - ev.y, 2) +
      Math.pow(sv.z - ev.z, 2)
  );

  var radius = 0.04;
  var occupacy = 0.85;
  if (status == "CLOSED") {
    radius = 0.08;
    occupacy = 0.99;
  }
  var tube = new BABYLON.MeshBuilder.CreateTube(
    "tube",
    {
      path: [sv, ev],
      radius: radius,
      tessellation: 3,
      cap: BABYLON.Mesh.CAP_ALL,
      updatable: true,
    },
    currentScene
  );

  tube.dpt = {
    context: "tubeConnection",
    dialogId: opinionDialogConnections.dialogId,
    initiatorsOpinion: opinionDialogConnections.initiatorsOpinion,
    recipientsOpinion: opinionDialogConnections.recipientsOpinion,
    status: opinionDialogConnections.dialogStatus,
    emissiveColor: emissiveColor,
  };

  var dynamicTexture = new BABYLON.DynamicTexture(
    "DynamicTexture",
    32,
    currentScene
  );
  var ctx = dynamicTexture.getContext();

  var combination = "";
  if (initiatorOpinion.rating == "negative") {
    combination = "red-" + recipientRating(recipientOpinion.rating);
  } else if (initiatorOpinion.rating == "neutral") {
    combination = "blue-" + recipientRating(recipientOpinion.rating);
  } else if (initiatorOpinion.rating == "positive") {
    combination = "green-" + recipientRating(recipientOpinion.rating);
  } else if (initiatorOpinion.rating == "unset") {
    combination = "grey-" + recipientRating(recipientOpinion.rating);
  }

  var reverse = 0;
  if (combination == "green-blue") {
    var reverse = 1;
    combination = "blue-green";
  } else if (combination == "green-red") {
    var reverse = 1;
    combination = "red-green";
    emmisiveColor = new BABYLON.Vector3(0.5, 0.5, 0.5);
  } else if (combination == "blue-red") {
    var reverse = 1;
    combination = "red-blue";
    emmisiveColor = new BABYLON.Vector3(0.2, 0.2, 0.2);
  }

  if (combination.indexOf("grey") >= 0) {
    combination = "grey-grey";
    if (status == "PENDING") {
      combination = "brown-brown";
    }
  }

  // dominant color scheme
  if (1) {
    if (combination.indexOf("red") >= 0) {
      combination = "red-red";
      emmisiveColor = new BABYLON.Vector3(0.6, 0.6, 0.6);
    }
    if (combination.indexOf("green") >= 0) {
      combination = "green-green";
    }
  }

  tube.dpt.emissiveColor = emissiveColor;
  image = new Image();
  image.src = "/" + combination + ".png";

  image.onload = function () {
    if (reverse || 1) {
      ctx.translate(-16, 16);
      ctx.rotate(-1.57079632679489661922); // -pi/2
      ctx.translate(-16, 16);
    } else {
      ctx.translate(16, -16);
      ctx.rotate(1.57079632679489661922); // pi/2
      ctx.translate(16, -16);
    }
    ctx.drawImage(this, 0, 0);
    dynamicTexture.update();
  };

  var mat = new BABYLON.StandardMaterial("mat", currentScene);
  //mat.alpha = 0.25;
  mat.alpha = occupacy;
  mat.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
  if (status == "CLOSED") {
    // mat.alphaMode = BABYLON.Engine.ALPHA_COMBINED;
    // mat.alphaMode = BABYLON.Engine.ALPHA_ONEONE;
    mat.alphaMode = BABYLON.Engine.ALPHA_ADD;
    // mat.alphaMode = BABYLON.Engine.ALPHA_MULTIPLY;
    // mat.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
  }
  mat.diffuseTexture = dynamicTexture;
  mat.diffuseTexture.uScale = 4;
  mat.diffuseTexture.vScale = distance * 8;
  mat.diffuseTexture.wrapU = 1;
  mat.diffuseTexture.wrapV = 1;
  mat.specularColor = new BABYLON.Color3.Black();
  //mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
  mat.emissiveColor = emissiveColor;
  tube.material = mat;

  tube.actionManager = new BABYLON.ActionManager(currentScene);

  // bold ON MOUSE ENTER
  tube.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOverTrigger,
      function (ev) {
        var meshLocal = ev.meshUnderPointer;
        meshLocal.material.emissiveColor = new BABYLON.Color3(0.79, 0.79, 0.79);
        canvas.style.cursor = "move";
      },
      false
    )
  );

  // normal ON MOUSE EXIT
  tube.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOutTrigger,
      function (ev) {
        var meshLocal = ev.meshUnderPointer;
        meshLocal.material.emissiveColor = meshLocal.dpt.emissiveColor;
        canvas.style.cursor = "default";
      },
      false
    )
  );

  if (0) {
    makePlanesDragable(
      initiatorOpinion.opinionId,
      recipientOpinion.opinionId,
      tube
    );
  }
}

function dialogRelations(opinionDialogConnections) {
  var initiatorOpinion = {};
  var i;
  var recipientOpinion = {};
  for (var h in opinionDialogConnections) {
    var odc = opinionDialogConnections[h];
    for (i in odc) {
      for (var j in currentScene.meshes) {
        if (
          "dpt" in currentScene.meshes[j] &&
          currentScene.meshes[j].dpt.context == "opinionScene" &&
          currentScene.meshes[j].dpt.opinionId == h
        ) {
          initiatorOpinion.position = currentScene.meshes[j].position;
          initiatorOpinion.opinionId = h;
          initiatorOpinion.size = currentScene.meshes[j].bjs;
          if (odc[i].leafs.negative.includes(h)) {
            initiatorOpinion.rating = "negative";
          } else if (odc[i].leafs.neutral.includes(h)) {
            initiatorOpinion.rating = "neutral";
          } else if (odc[i].leafs.positive.includes(h)) {
            initiatorOpinion.rating = "positive";
          } else if (odc[i].leafs.unset.includes(h)) {
            initiatorOpinion.rating = "unset";
          }
        }
      }

      for (var j in odc[i].leafs.negative) {
        var opinionId = odc[i].leafs.negative[j];
        if (opinionId != h) {
          for (var k in currentScene.meshes) {
            if (
              "dpt" in currentScene.meshes[k] &&
              currentScene.meshes[k].dpt.context == "opinionScene" &&
              currentScene.meshes[k].dpt.opinionId == opinionId
            ) {
              recipientOpinion.position = currentScene.meshes[k].position;
              recipientOpinion.opinionId = opinionId;
              recipientOpinion.size = currentScene.meshes[k].bjs;
              recipientOpinion.rating = "negative";
            }
          }
        }
      }
      for (var j in odc[i].leafs.neutral) {
        var opinionId = odc[i].leafs.neutral[j];
        if (opinionId != h) {
          for (var k in currentScene.meshes) {
            if (
              "dpt" in currentScene.meshes[k] &&
              currentScene.meshes[k].dpt.context == "opinionScene" &&
              currentScene.meshes[k].dpt.opinionId == opinionId
            ) {
              recipientOpinion.position = currentScene.meshes[k].position;
              recipientOpinion.opinionId = opinionId;
              recipientOpinion.size = currentScene.meshes[k].bjs;
              recipientOpinion.rating = "neutral";
            }
          }
        }
      }
      for (var j in odc[i].leafs.positive) {
        var opinionId = odc[i].leafs.positive[j];
        if (opinionId != h) {
          for (var k in currentScene.meshes) {
            if (
              "dpt" in currentScene.meshes[k] &&
              currentScene.meshes[k].dpt.context == "opinionScene" &&
              currentScene.meshes[k].dpt.opinionId == opinionId
            ) {
              recipientOpinion.position = currentScene.meshes[k].position;
              recipientOpinion.opinionId = opinionId;
              recipientOpinion.size = currentScene.meshes[k].bjs;
              recipientOpinion.rating = "positive";
            }
          }
        }
      }

      for (var j in odc[i].leafs.unset) {
        var opinionId = odc[i].leafs.unset[j];
        if (opinionId != h) {
          for (var k in currentScene.meshes) {
            if (
              "dpt" in currentScene.meshes[k] &&
              currentScene.meshes[k].dpt.context == "opinionScene" &&
              currentScene.meshes[k].dpt.opinionId == opinionId
            ) {
              recipientOpinion.position = currentScene.meshes[k].position;
              recipientOpinion.opinionId = opinionId;
              recipientOpinion.size = currentScene.meshes[k].bjs;
              recipientOpinion.rating = "unset";
            }
          }
        }
      }

      if ("position" in initiatorOpinion && "position" in recipientOpinion) {
        createBiColorTube(initiatorOpinion, recipientOpinion, odc[i]);
      }
    }
  }
}

function loadOpinions(restObj) {
  var canInvite = false;

  if (currentScene.name == "opinionScene") {
    for (var i = currentScene.meshes.length - 1; i >= 0; i--) {
      if ("dpt" in currentScene.meshes[i]) {
        console.log("dispose: " + currentScene.meshes[i].dpt.context);
        currentScene.meshes[i].dispose();
      }
    }
  } else {
    return;
  }

  var opinionDialogConnections = {};
  for (var i = 0; i < restObj.data.length; i++) {
    if ("topos" in restObj.data[i]) {
      opinionDialogConnections[restObj.data[i]._id] = restObj.data[i].topos;
    }
    if (restObj.data[i].user == "mine") {
      canInvite = true;
      var myOpinion = restObj.data[i]._id;
    }
  }

  //var nodes = circlePoints(restObj.data.length, 5, { X: 4, Y: 0 });
  for (var i = 0; i < restObj.data.length; i++) {
    // check, if the opinion owner already lead a discussion with the other opinion
    var exists = false;
    for (var j in restObj.data[i].topos) {
      if (restObj.data[i]._id == restObj.data[i].topos[j].opinionId) {
        var leafs = restObj.data[i].topos[j].leafs;
        if (
          leafs.negative.includes(myOpinion) ||
          leafs.positive.includes(myOpinion) ||
          leafs.neutral.includes(myOpinion) ||
          leafs.unset.includes(myOpinion)
        ) {
          exists = true;
        }
      }
    }

    // paint the opinion
    var plane = textBlock(
      restObj.data[i].position.x,
      restObj.data[i].position.y,
      restObj.data[i].position.z,
      JSON.stringify({
        context: "opinionScene",
        opinionId: restObj.data[i]._id,
        content: restObj.data[i].content,
        opinionContext: restObj.data[i].context,
        isOnline: restObj.data[i].isOnline,
        canEdit: restObj.data[i].user == "mine" ? true : false,
        canInvite:
          canInvite == true &&
          restObj.data[i].user != "mine" &&
          restObj.data[i].blocked == 1 &&
          exists == false
            ? true
            : false,
      }),
      `${restObj.data[i].content}`
    );

    /*
	    var minion0 = BABYLON.MeshBuilder.CreateSphere("minion0", {diameter: 0.5}, currentScene);
	    minion0.position = new BABYLON.Vector3(1,1,1);
	    plane.onUpdateTextPos.add(function(value) {       
	        minion0.position.x = value.x;
	        minion0.position.y = value.y;
	    })
	    */
  }

  // paint the topic
  var plane = textBlock(
    19.2 / 6,
    12.8 / 6,
    8.001,
    JSON.stringify({ context: "opinionTopic" }),
    currentTopicStr,
    { fontSize: 128, width: 19.2, height: 12.8, color: "#550033" }
  );

  dialogRelations(opinionDialogConnections);
}
