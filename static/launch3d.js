var canvas = document.getElementById("renderCanvas");
var engine;
var advancedTexture;
var currentScene;
var __topicScene;
var __opinionScene;
var topicCamState;
var opinionCamState;

var myDialogMenu = [];
var currentDialog;
var myDialogsVisible = 'hidden';

var currentTopic;
var currentTopicStr;

var dpt;
var whoami;

var powerSave = false;

function propositionForm(opinionId) {
    console.log('enter proposition');
    jQuery('body').append(`<div id="propositionForm" style="position: absolute;
		padding: 20px; margin-left: 30%; border: #fff; border-style: solid;
		border-width: 1px; color: #000; width: 40%; z-index: 2; font-family: DPTFont;
		font-size: 18px; background-color: #00ccffcc;">Please enter your proposition:
		<br><form id="proposition"><textarea style="font-family: DPTFont;
		font-size: 18px;" name="proposition" cols="64" rows="4" class="proposition"></textarea>
		<input type="hidden" id="opinionId" name="opinionId" value="${opinionId}">
		<br><input style="font-family: DPTFont; font-size: 18px;"
		type="submit" value="Send"></form></div>`);
    jQuery(".proposition").focus();

    jQuery(document).on('keydown', '.proposition', function(event) {
        var n = jQuery('.proposition').val().length;
        if (n >= 512) {
            jQuery('.proposition').css({ "background-color": "#f88" });
            if (event.keyCode != 8 &&
                event.keyCode != 127 &&
                event.keyCode != 37 &&
                event.keyCode != 38 &&
                event.keyCode != 39 &&
                event.keyCode != 40) {
                event.preventDefault();
            }
        } else {
            jQuery('.proposition').css({ "background-color": "#fff" });
        }
        if (event.keyCode == 27) {
            jQuery('#propositionForm').remove();
            focusAtCanvas();
            event.preventDefault();
        }
        /*
        if(event.keyCode == 10 || event.keyCode == 13) {
        	event.preventDefault();
        }
        */
    });

    jQuery(document).on('submit', 'form#proposition', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        var proposition = jQuery('.proposition').val();
        var opinionId = jQuery('#opinionId').val();
        if (proposition) {
            dpt.postDialog(proposition, whoami.dptUUID, opinionId);
        }
        jQuery('#propositionForm').remove();
        focusAtCanvas();
    });
}

function topicForm() {
    console.log('enter topic');
    jQuery('body').append(`<div id="topicForm" style="position: absolute; top: 0px; left: 0px; padding: 20px;
		margin-left: 33%; border: #fff; border-style: solid; border-width: 1px;
		color: #000; width: 33%; z-index: 2; font-family: DPTFont; font-size: 18px;
		background-color: #00ccffcc;">Please enter a new topic:<br><form id="topic">
		<textarea style="font-family: DPTFont; font-size: 18px;" name="topic"
		cols="51" rows="4" class="topic"></textarea><br><input style="font-family: DPTFont;
		font-size: 18px;" type="submit" value="Send"></form></div>`);
    jQuery(".topic").focus();

    jQuery(document).on('keydown', '.topic', function(event) {
        var n = jQuery('.topic').val().length;
        if (n >= 512) {
            jQuery('.topic').css({ "background-color": "#f88" });
            if (event.keyCode != 8 &&
                event.keyCode != 127 &&
                event.keyCode != 37 &&
                event.keyCode != 38 &&
                event.keyCode != 39 &&
                event.keyCode != 40) {
                event.preventDefault();
            }
        } else {
            jQuery('.topic').css({ "background-color": "#fff" });
        }
        if (event.keyCode == 27) {
            jQuery('#topicForm').remove();
            focusAtCanvas();
            event.preventDefault();
        }
        /*
        if(event.keyCode == 10 || event.keyCode == 13) {
        	event.preventDefault();
        }
        */
    });

    jQuery(document).on('submit', 'form#topic', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        var topic = jQuery('.topic').val();
        if (topic) {
            dpt.postTopic(topic);
        }
        jQuery('#topicForm').remove();
        focusAtCanvas();

    });
}

function opinionForm() {
    console.log('enter opinion');
    jQuery('body').append(`<div id="opinionForm" style="position: relative; top: -620px; left: -20px;
		padding: 20px; margin-left: 33%; border: #fff; border-style: solid;
		border-width: 1px; color: #000; width: 33%; z-index: 2; font-family: DPTFont;
		font-size: 18px; background-color: #00ccffcc;">Please enter a new opinion:<br>
		<form id="opinion"><textarea style="font-family: DPTFont; font-size: 18px;"
		name="opinion" cols="64" rows="4" class="opinion"></textarea><br>
		<input style="font-family: DPTFont; font-size: 18px;" type="submit"
		value="Send"></form></div>`);
    jQuery(".opinion").focus();

    jQuery(document).on('keydown', '.opinion', function(event) {
        var n = jQuery('.opinion').val().length;
        if (n >= 512) {
            jQuery('.opinion').css({ "background-color": "#f88" });
            if (event.keyCode != 8 &&
                event.keyCode != 127 &&
                event.keyCode != 37 &&
                event.keyCode != 38 &&
                event.keyCode != 39 &&
                event.keyCode != 40) {
                event.preventDefault();
            }
        } else {
            jQuery('.opinion').css({ "background-color": "#fff" });
        }
        if (event.keyCode == 27) {
            jQuery('#opinionForm').remove();
            event.preventDefault();
        }
        /*
        if(event.keyCode == 10 || event.keyCode == 13) {
        	event.preventDefault();
        }
        */
    });

    jQuery(document).on('submit', 'form#opinion', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        var opinion = jQuery('.opinion').val();
        if (opinion) {
            dpt.postOpinion(currentTopic, opinion);
        }
        jQuery('#opinionForm').remove();
    });
}

function loadDialogList(restObj) {
    var dialog = '';
    var menuEntry = '';
    var dialogs = restObj.data.data;

    jQuery('body').append(`<div id="dialogMenu" style="position: relative;
		padding: 10px; top: 170px; border: #fff; border-style: solid;
		border-width: 1px; color: #fff; width: 258px; height: 100%;
		overflow-y: auto; z-index: 2; font-family: DPTFontDin; font-size: 16px;
		background-color: #002C4B88; visibility: hidden;"></div>`);

    for (var i = 0; i < dialogs.length; i++) {

        menuEntry = `<span class="myDialogs" id="${dialogs[i].dialog}"><i>proposition:</i>
			${dialogs[i].opinionProposition}<br><br></span>`;

        dialog = `<u style="font-size: 32px">Dialog Info</u><br><br><i>proposition:</i>
				<br>${dialogs[i].opinionProposition}<br><br>
				<i>topic:</i><br>${dialogs[i].topic}<br><br>`;

        if (dialogs[i].initiator == 'me') {

            dialog += `<i>my opinion:</i><br>${dialogs[i].initiatorOpinion}<br><br>
					<i>other's opinion:</i><br>${dialogs[i].recipientOpinion}<br><br>
					<i>initiator:</i> me<br><br>`;

        } else {

            dialog += `<i>my opinion:</i><br>${dialogs[i].recipientOpinion}<br><br>
					 <i>other's opinion:</i><br>${dialogs[i].initiatorOpinion}<br><br>
					 <i>initiator:</i> other<br><br>`;

        }

        dialog += `<i>status:</i> ${dialogs[i].status}`;

        myDialogMenu[dialogs[i].dialog] = {
            dialog: dialogs[i].dialog,
            topic: dialogs[i].topic,
            initiatorOpinion: dialogs[i].initiatorOpinion,
            recipientOpinion: dialogs[i].recipientOpinion,
            menuEntry: menuEntry,
            description: dialog
        };
        jQuery('#dialogMenu').append(menuEntry);
    }
}

function loadTopics(restObj) {
    var options = '';

    var n = Math.floor((Math.sqrt(restObj.data.length)));
    var x = 0 - Math.floor(n / 2) * 4.8,
        xstart = x;
    xmax = (n / 2) * 4.8;
    var y = ymax = (n - 1) * 3.2;
    ystart = ymax;
    y = ystart;

    if (currentScene == 'topicMap') {
        for (var i in currentScene.meshes) {
            if ('dpt' in currentScene.meshes[i] &&
                currentScene.meshes[i].dpt.context == 'topicMap') {
                currentScene.meshes[i].remove();
            }
        }
    }
    for (var i in restObj.data) {
        if (restObj.data[i].user == 'mine') {
            options = '<span class="editTopic" id="' +
                restObj.data[i]._id +
                '">&#128393;</span>';
        } else {
            options = '';
        }
        var plane = textBlock(
            x, y, 0,
            `{"context": "topicMap", "topicId": "${restObj.data[i]._id}",
				"topic": "${restObj.data[i].content}"}`,
            `${restObj.data[i].content} [ ${restObj.data[i].opinions.length} ]`);
        x += 4.8;
        if (x > xmax) {
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

function circleText(ctx, text, x, y, radius, angle) {
    var numRadsPerLetter = 2 * Math.PI / text.length;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    for (var i = 0; i < text.length; i++) {
        ctx.save();
        ctx.rotate(i * numRadsPerLetter);

        ctx.fillText(text[i], 0, -radius);
        ctx.restore();
    }
    ctx.restore();
}

function circleTextPlane(x, y, z, name, text) {
    //Set width an height for plane
    var planeWidth = 12;
    var planeHeight = 12; //10;

    //Create plane
    var plane = BABYLON.MeshBuilder.CreatePlane(name, { width: planeWidth, height: planeHeight }, currentScene);
    plane.dpt = JSON.parse('{"context": "topicCircle"}');

    //Set width and height for dynamic texture using same multiplier
    var DTWidth = planeWidth * 100; //64;
    var DTHeight = planeHeight * 100; //64

    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", { width: DTWidth, height: DTHeight }, currentScene);

    //Check width of text for given font type at any size of font
    var ctx = dynamicTexture.getContext();

    dynamicTexture.hasAlpha = true;
    ctx.fillStyle = 'transparent';

    textureContext = dynamicTexture.getContext();
    textureContext.font = "28px DPTFont";
    textureContext.save();
    textureContext.fillStyle = "#00ccff";

    circleText(textureContext, text, 600, 600, 550, -Math.PI / 3)
        //			textureContext.scale(3, 3);
    textureContext.restore();

    dynamicTexture.update();

    //create material
    var mat = new BABYLON.StandardMaterial("mat", currentScene);
    mat.diffuseTexture = dynamicTexture;
    mat.emissiveColor = new BABYLON.Color3(1, 1, 1);

    //apply material
    plane.material = mat;
    //mat.freeze();

    // set the position
    plane.position.x = x + 2;
    plane.position.y = y;
    plane.position.z = z;

    plane.scaling.x *= 1.5;
    plane.scaling.y *= 1.5;
    //plane.doNotSyncBoundingInfo = true
    //plane.freezeWorldMatrix();
    return (plane);
}

function createBiColorTube(initiatorOpinion, recipientOpinion) {
    var sv = new BABYLON.Vector3(initiatorOpinion.position);
    var ev = new BABYLON.Vector3(recipientOpinion.position);
    sv.x = initiatorOpinion.position.x - 2.4;
    sv.y = initiatorOpinion.position.y + 1.2;
    ev.x = recipientOpinion.position.x - 2.4;
    ev.y = recipientOpinion.position.y + 1.2;

    var tube = new BABYLON.MeshBuilder.CreateTube("tube", { path: [sv, ev], radius: 0.1, updatable: true, }, currentScene);

    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 32, currentScene);
    var ctx = dynamicTexture.getContext();

    var combination = '';
    if (initiatorOpinion.rating == 'negative') {
        combination = 'red-';
        if (recipientOpinion.rating == 'negative') {
            combination = 'red';
        } else if (recipientOpinion.rating == 'neutral') {
            combination = 'blue';
        } else if (recipientOpinion.rating == 'positive') {
            combination = 'green';
        } else if (recipientOpinion.rating == 'unset') {
            combination = 'grey';
        }

    } else if (initiatorOpinion.rating == 'neutral') {
        combination = 'blue-';
        if (recipientOpinion.rating == 'negative') {
            combination += 'red';
        } else if (recipientOpinion.rating == 'neutral') {
            combination += 'blue';
        } else if (recipientOpinion.rating == 'positive') {
            combination += 'green';
        } else if (recipientOpinion.rating == 'unset') {
            combination += 'grey';
        }

    } else if (initiatorOpinion.rating == 'positive') {
        combination = 'green-';
        if (recipientOpinion.rating == 'negative') {
            combination += 'red';
        } else if (recipientOpinion.rating == 'neutral') {
            combination += 'blue';
        } else if (recipientOpinion.rating == 'positive') {
            combination += 'green';
        } else if (recipientOpinion.rating == 'unset') {
            combination += 'grey';
        }

    } else if (initiatorOpinion.rating == 'unset') {
        combination += 'grey-';
        if (recipientOpinion.rating == 'negative') {
            combination += 'red';
        } else if (recipientOpinion.rating == 'neutral') {
            combination += 'blue';
        } else if (recipientOpinion.rating == 'positive') {
            combination += 'green';
        } else if (recipientOpinion.rating == 'unset') {
            combination += 'grey';
        }
    }

    console.log('image is : ' + combination);
    var reverse = 0;
    if (combination == 'green-blue') {
        var reverse = 1;
        combination = 'blue-green';
    } else if (combination == 'green-red') {
        var reverse = 1;
        combination = 'red-green';
    } else if (combination == 'blue-red') {
        var reverse = 1;
        combination = 'red-blue';
    }

    console.log('image is : ' + combination);
    image = new Image();
    image.src = '/' + combination + '.png';

    image.onload = function() {

        if (reverse || 1) {
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
    mat.alpha = 0.95;
    mat.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
    mat.diffuseTexture = dynamicTexture;
    //	mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    tube.material = mat;

    //return(tube);
}

function dialogRelations(opinionDialogConnections) {
    var initiatorOpinion = {};
    var recipientOpinion = {};
    for (var i in opinionDialogConnections) {
        for (var j in currentScene.meshes) {
            if ('dpt' in currentScene.meshes[j] &&
                currentScene.meshes[j].dpt.context == 'opinionMap' &&
                currentScene.meshes[j].dpt.opinionId == i) {
                initiatorOpinion.position = currentScene.meshes[j].position;
                initiatorOpinion.opinionId = i;
                if (jQuery.inArray(i, opinionDialogConnections[i].leafs.negative) >= 0) {
                    initiatorOpinion.rating = 'negative';
                } else if (jQuery.inArray(i, opinionDialogConnections[i].leafs.neutral) >= 0) {
                    initiatorOpinion.rating = 'neutral';
                } else if (jQuery.inArray(i, opinionDialogConnections[i].leafs.positive) >= 0) {
                    initiatorOpinion.rating = 'positive';
                } else if (jQuery.inArray(i, opinionDialogConnections[i].leafs.unset) >= 0) {
                    initiatorOpinion.rating = 'unset';
                }
            }
        }

        for (var j in opinionDialogConnections[i].leafs.negative) {
            var opinionId = opinionDialogConnections[i].leafs.negative[j];
            if (opinionId != i) {
                for (var k in currentScene.meshes) {
                    if ('dpt' in currentScene.meshes[k] &&
                        currentScene.meshes[k].dpt.context == 'opinionMap' &&
                        currentScene.meshes[k].dpt.opinionId == opinionId) {
                        recipientOpinion.position = currentScene.meshes[k].position;
                        recipientOpinion.opinionId = opinionId;
                        recipientOpinion.rating = 'negative';
                    }
                }
            }
        }
        for (var j in opinionDialogConnections[i].leafs.neutral) {
            var opinionId = opinionDialogConnections[i].leafs.neutral[j];
            if (opinionId != i) {
                for (var k in currentScene.meshes) {
                    if ('dpt' in currentScene.meshes[k] &&
                        currentScene.meshes[k].dpt.context == 'opinionMap' &&
                        currentScene.meshes[k].dpt.opinionId == opinionId) {
                        recipientOpinion.position = currentScene.meshes[k].position;
                        recipientOpinion.opinionId = opinionId;
                        recipientOpinion.rating = 'neutral';
                    }
                }
            }
        }
        for (var j in opinionDialogConnections[i].leafs.positive) {
            var opinionId = opinionDialogConnections[i].leafs.positive[j];
            if (opinionId != i) {
                for (var k in currentScene.meshes) {
                    if ('dpt' in currentScene.meshes[k] &&
                        currentScene.meshes[k].dpt.context == 'opinionMap' &&
                        currentScene.meshes[k].dpt.opinionId == opinionId) {
                        recipientOpinion.position = currentScene.meshes[k].position;
                        recipientOpinion.opinionId = opinionId;
                        recipientOpinion.rating = 'positive';
                    }
                }
            }
        }
        for (var j in opinionDialogConnections[i].leafs.unset) {
            var opinionId = opinionDialogConnections[i].leafs.unset[j];
            if (opinionId != i) {
                for (var k in currentScene.meshes) {
                    if ('dpt' in currentScene.meshes[k] &&
                        currentScene.meshes[k].dpt.context == 'opinionMap' &&
                        currentScene.meshes[k].dpt.opinionId == opinionId) {
                        recipientOpinion.position = currentScene.meshes[k].position;
                        recipientOpinion.opinionId = opinionId;
                        recipientOpinion.rating = 'unset';
                    }
                }
            }
        }

        /*
        initiatorOpinion.position.x -= 2.4;
        initiatorOpinion.position.y += 1.2;
        recipientOpinion.position.x -= 2.4;
        recipientOpinion.position.y += 1.2;
        */

        if ('position' in initiatorOpinion && 'position' in recipientOpinion) {
            createBiColorTube(initiatorOpinion, recipientOpinion);
        }
        //		return(createBiColorTube(currentScene.meshes[k].dpt.opinionId, sv, ev));
    }
}

function loadOpinions(restObj) {
    var i;
    var options = '';
    var canInvite = false;

    if (currentScene == 'opinionMap') {
        for (var i in currentScene.meshes) {
            if ('dpt' in currentScene.meshes[i] &&
                currentScene.meshes[i].dpt.context == 'opinionMap') {
                currentScene.meshes[i].remove();
            } else if (currentScene.meshes[i].name == 'tube') {
                currentScene.meshes[i].remove();
            }
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
    for (var i = 0; i < restObj.data.length; i++) {
        opinionDialogConnections[restObj.data[i].topo.opinionId] = restObj.data[i].topo;
    }
    for (var i = 0; i < restObj.data.length; i++) {
        if (restObj.data[i].user == 'mine') {
            canInvite = true;
        }
    }

    var nodes = circlePoints(restObj.data.length, 5, { X: 4, Y: 0 });
    for (var i = 0; i < restObj.data.length; i++) {
        options = '';
        if (restObj.data[i].user == 'mine') {
            options = '<span class="editOpinion" id="' +
                restObj.data[i]._id +
                '">&#128393;</span>';
        } else {
            if (restObj.data[i].blocked == 0 &&
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
            `{"context": "opinionMap", "opinionId": "${restObj.data[i]._id}"}`,
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


        if (canInvite && restObj.data[i].user != 'mine' &&
            restObj.data[i].blocked == 0) {
            var mat = new BABYLON.StandardMaterial("icon", currentScene);
            mat.diffuseTexture = new BABYLON.Texture("/chatbubble.png", currentScene);
            //			mat.diffuseTexture = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Rpb_dialog_icon.svg/120px-Rpb_dialog_icon.svg.png", currentScene);
            mat.emissiveColor = new BABYLON.Color3(0.0, 0.8, 1);
            //			mat.alpha = .95;
            mat.alphaMode = BABYLON.Engine.ALPHA_ADD;
            mat.opacityTexture = mat.diffuseTexture;

            //			var icon = BABYLON.MeshBuilder.CreatePlane("icon", { width: 0.35, height: 0.25 }, currentScene);
            var icon = BABYLON.MeshBuilder.CreatePlane("icon", { width: 0.35, height: 0.35 }, currentScene);
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


    if (restObj.data.length > 0) {
        //				dpt.opinionPostAllowed(restObj.data[0].topic);
    } else {
        //				opinionForm();
    }
    //			opinionEdit();

    //			circleTextPlane(1.5, 1.2, 0, 'bla', currentTopicStr + " * ");
    dialogRelations(opinionDialogConnections);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function textBlock(x, y, z, name, text) {
    //Set width an height for plane
    var planeWidth = 4.8;
    var planeHeight = 3.2; //10;

    //Create plane
    var plane = BABYLON.MeshBuilder.CreatePlane(name, { width: planeWidth, height: planeHeight }, currentScene);
    plane.dpt = JSON.parse(name);

    //Set width and height for dynamic texture using same multiplier
    var DTWidth = planeWidth * 100; //64;
    var DTHeight = planeHeight * 100; //64

    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", { width: DTWidth, height: DTHeight }, currentScene);

    //Check width of text for given font type at any size of font
    var ctx = dynamicTexture.getContext();

    dynamicTexture.hasAlpha = true;
    ctx.fillStyle = 'transparent';

    textureContext = dynamicTexture.getContext();
    textureContext.font = "22px DPTFont";
    textureContext.save();
    textureContext.fillStyle = "#00ccff";

    wrapText(textureContext, text, 5, 20, 479, 22);
    textureContext.restore();

    dynamicTexture.update();

    //create material
    var mat = new BABYLON.StandardMaterial("mat", currentScene);
    mat.diffuseTexture = dynamicTexture;
    mat.emissiveColor = new BABYLON.Color3(1, 1, 1);

    //apply material
    plane.material = mat;
    //mat.freeze();

    // set the position
    plane.position.x = x;
    plane.position.y = y;
    plane.position.z = z;
    plane.showBoundingBox = false;
    //plane.doNotSyncBoundingInfo = true
    //plane.freezeWorldMatrix();
    return (plane);
}

function getCollisionBox() {
    //Simple box
    var box = new BABYLON.MeshBuilder.CreateBox("collisionBox", {
        width: 100,
        height: 30,
        depth: 40,
        sideOrientation: 1
    }, currentScene);

    box.position = new BABYLON.Vector3(7.5, 2.5, -19.99);
    //create material
    var mat = new BABYLON.StandardMaterial("mat", currentScene);
    mat.diffuseColor = new BABYLON.Color3(10 / 255, 80 / 255, 119 / 255);
    mat.emissiveColor = new BABYLON.Color3(10 / 255, 80 / 255, 119 / 255);

    //apply material
    box.material = mat;
    //mat.freeze();

    return (box);
}

function getCamera() {
    // camera
    if (currentScene.dptMode == "topicScene") {
        console.log('ts cam');
        var camera = new BABYLON.FlyCamera("FlyCamera",
            new BABYLON.Vector3(2.5, 4.5, -15), currentScene);

        if (topicCamState) {
            camera.position = topicCamState.position;
            camera.rotation = topicCamState.rotation;
            camera.direction = topicCamState.direction;
        }
    }
    if (currentScene.dptMode == "opinionScene") {
        console.log('os cam');
        var camera = new BABYLON.FlyCamera("FlyCamera",
            new BABYLON.Vector3(4.5, 1.0, -15), currentScene);

        if (opinionCamState) {
            camera.position = opinionCamState.position;
            camera.rotation = opinionCamState.rotation;
            camera.direction = opinionCamState.direction;
        }
    }

    camera.inputs.add(new BABYLON.FreeCameraTouchInput());

    camera.keysForward.push(33);
    camera.keysBackward.push(34);

    camera.keysLeft.push(37);
    camera.keysUp.push(38);
    camera.keysRight.push(39);
    camera.keysDown.push(40);
    /*
     */
    /*
    			camera.rollCorrect = 10;
    			camera.bankedTurn = true;
    			camera.bankedTurnLimit = Math.PI / 8;
    			camera.bankedTurnMultiplier = 1;
    */
    camera.acceleration = 0.01;
    camera.speed = 0.5;

    return (camera);
}

function circlePoints(points, radius, center) {
    var slice = 2 * Math.PI / points;
    var nodes = [];
    for (var i = 0; i < points; i++) {
        var angle = slice * i;
        var newX = center.X + radius * Math.cos(angle);
        var newY = center.Y + radius * Math.sin(angle);
        nodes.push({ x: newX, y: newY });
        /*
        			var box = new BABYLON.MeshBuilder.CreateBox("box", {
        				width: 0.1,
        				height: 0.1,
        				depth: 0.1,
        				sideOrientation: 1
        			}, currentScene);
        			box.position = new BABYLON.Vector3(newX, newY, -1);
        			//create material
        			var mat = new BABYLON.StandardMaterial("mat", currentScene);
        			mat.diffuseColor = new BABYLON.Color3(1,.5,0);
        			mat.emissiveColor = new BABYLON.Color3(1,.5,0);

        			//apply material
        			box.material = mat;
        			mat.freeze();
        */
    }
    return (nodes);
}

var createGUIScene = function(dptMode) {


    //create home button
    var homeBtn = jQuery('#home-btn');
    homeBtn.show();
    homeBtn.on('click touch', function(event) {
        opinionCamState = currentScene.cameras[0].storeState();
        currentScene.dispose();
        currentScene = __topicScene("topicScene");
        dpt.getTopic();
        event.stopImmediatePropagation();
        event.preventDefault();
        jQuery('#opinionForm').remove();
        jQuery('#topicForm').remove();


    });

    //create dialogue button
    var dialoguesBtn = jQuery('#dialogues-btn');
    dialoguesBtn.show();
    dialoguesBtn.on('click touch', function(event) {
        // alert('test')
        if (myDialogsVisible == 'visible') {
            myDialogsVisible = 'hidden';
        } else {
            myDialogsVisible = 'visible';
        }
        jQuery('#dialogMenu').css({ visibility: myDialogsVisible });
        event.stopImmediatePropagation();
        event.preventDefault();
    });
    //create topic button 
    if (dptMode == 'topicScene') {
        jQuery('#new-opinion-btn').hide();
        var newTopicBtn = jQuery('#new-topic-btn');
        newTopicBtn.show();

        newTopicBtn.html(`<img class="btn-icon" src="/Interrobang.png">New-Topic`);

        newTopicBtn.on('click touch', function(event) {
            jQuery('#topicForm').remove();

            topicForm();
            event.stopImmediatePropagation();
            event.preventDefault();

        })

    } else if (dptMode == 'opinionScene') {

        jQuery('#new-topic-btn').hide();
        var newOpinionBtn = jQuery('#new-opinion-btn');
        newOpinionBtn.show();

        newOpinionBtn.html(`<img class="btn-icon" src="/Interrobang.png">New-Opinion`);
        newOpinionBtn.on('click touch', function(event) {
            jQuery('#opinionForm').remove();

            dpt.opinionPostAllowed(currentTopic);
            // alert(dpt.opinionPostAllowed(currentTopic)) <- returns undefined

            event.stopImmediatePropagation();
            event.preventDefault();

        });
    }
}

function pauseEngine() {
    var btn = document.createElement("input");
    //			btn.innerText = "Enable/Disable Joystick";
    btn.style.zIndex = 10;
    btn.style.position = "absolute";
    btn.style.bottom = "50px";
    btn.style.right = "150px";
    btn.width = "50";
    btn.height = "50";
    btn.type = "image";
    btn.src = "/sleep_white.png";
    btn.style.color = "#f00";
    document.body.appendChild(btn);

    // Button toggle logic
    btn.onclick = () => {
        powerSave = !powerSave;
    }
}

function initVirtJoysticks() {
    var leftJoystick = new BABYLON.VirtualJoystick(false);
    var rightJoystick = new BABYLON.VirtualJoystick(true);
    leftJoystick.setJoystickColor("#ff7f003f");
    rightJoystick.setJoystickColor("#ff007f3f");
    BABYLON.VirtualJoystick.Canvas.style.zIndex = "-1";

    // Game/Render loop
    var movespeed = 5;
    var camVec = currentScene.cameras[0].position;
    currentScene.onBeforeRenderObservable.add(() => {
        if (leftJoystick.pressed) {
            camVec.z += leftJoystick.deltaPosition.y *
                (engine.getDeltaTime() / (1000 - 2 * camVec.z * camVec.z)) *
                movespeed;
            if (camVec.z > 0) {
                camVec.z = -15;
            }
            if (camVec.z < -20) {
                camVec.z = -1;
            }
        }
        if (rightJoystick.pressed) {
            camVec.x += rightJoystick.deltaPosition.x *
                (engine.getDeltaTime() / (2000 - camVec.z * camVec.z)) *
                movespeed;
            camVec.y += rightJoystick.deltaPosition.y *
                (engine.getDeltaTime() / (2000 - camVec.z * camVec.z)) *
                movespeed;
        }
    })
    var btn = document.createElement("input");
    //			btn.innerText = "Enable/Disable Joystick";
    btn.style.zIndex = 10;
    btn.style.position = "absolute";
    btn.style.bottom = "50px";
    btn.style.right = "50px";
    btn.width = "50";
    btn.height = "50";
    btn.type = "image";
    btn.src = "/joypad_white.png";
    btn.style.color = "#f00";
    document.body.appendChild(btn);

    // Button toggle logic
    btn.onclick = () => {
        if (BABYLON.VirtualJoystick.Canvas.style.zIndex == "-1") {
            BABYLON.VirtualJoystick.Canvas.style.zIndex = "4";
            btn.background = "green";
        } else {
            BABYLON.VirtualJoystick.Canvas.style.zIndex = "-1";
            btn.background = "transparent";
        }
    }
}


var createGenericScene = function(dptMode) {
    var genericScene = new BABYLON.Scene(engine);

    currentScene = genericScene;
    currentScene.dptMode = dptMode;

    // lights - no light!!
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 0, -1), genericScene);
    light.intensity = 0.1;

    genericScene.clearColor = new BABYLON.Color3(10 / 255, 80 / 255, 119 / 255);

    var camera = getCamera();
    camera.attachControl(canvas, true);

    initVirtJoysticks();
    pauseEngine();

    // Enable Collisions
    var box = getCollisionBox();
    box.checkCollisions = true;
    camera.checkCollisions = true;
    genericScene.collisionsEnabled = true;

    createGUIScene(dptMode);


    genericScene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                //console.log("POINTER DOWN");
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                //console.log("POINTER UP");

                if ('dpt' in pointerInfo.pickInfo.pickedMesh &&
                    pointerInfo.pickInfo.pickedMesh.dpt.context == "dialogInvitation") {
                    propositionForm(pointerInfo.pickInfo.pickedMesh.dpt.opinionId);
                }

                break;
            case BABYLON.PointerEventTypes.POINTERMOVE:
                /*
                for(i in currentScene.meshes) {
                	if(pointerInfo.pickInfo.ray.intersectsMesh(currentScene.meshes[i])
                	&& 'dpt' in currentScene.meshes[i]) {
                		var bla = currentScene.meshes[i];
                		console.log('hit');
                	}
                }
                */
                //console.log("POINTER MOVE");
                //if('dpt' in pointerInfo.pickInfo.pickedMesh) {
                //	console.log("POINTER MOVE");
                //}
                break;
            case BABYLON.PointerEventTypes.POINTERWHEEL:
                //console.log("POINTER WHEEL");
                break;
            case BABYLON.PointerEventTypes.POINTERPICK:
                //console.log("POINTER PICK");
                break;
            case BABYLON.PointerEventTypes.POINTERTAP:
                //console.log("POINTER TAP");
                break;
            case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                //console.log("POINTER DOUBLE-TAP");

                if ('dpt' in pointerInfo.pickInfo.pickedMesh &&
                    pointerInfo.pickInfo.pickedMesh.dpt.context == "topicMap") {
                    //console.log("hit topicId: "+pointerInfo.pickInfo.pickedMesh.dpt.topicId);

                    pointerInfo.pickInfo.pickedMesh.showBoundingBox = true;
                    setTimeout(function() {
                        pointerInfo.pickInfo.pickedMesh.showBoundingBox = false;
                    }, 250);

                    topicCamState = currentScene.cameras[0].storeState();
                    currentTopic = pointerInfo.pickInfo.pickedMesh.dpt.topicId;
                    currentTopicStr = pointerInfo.pickInfo.pickedMesh.dpt.topic;
                    currentScene.dispose();
                    currentScene = __opinionScene("opinionScene");
                    dpt.getOpinionByTopic(currentTopic);
                    jQuery('#topicForm').remove();
                }

                break;
        }
    });

    genericScene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                /*
                console.log("KEY DOWN: ", kbInfo.event.key);
                var speed = camera._computeLocalCameraSpeed() * 20;
                if (kbInfo.event.key == 'PageUp') {
                	camera._localDirection.copyFromFloats(0, 0, speed);
                	camera.position.z += speed;
                	console.log('fuck: '+speed);
                }
                */
                break;
            case BABYLON.KeyboardEventTypes.KEYUP:
                //console.log("KEY UP: ", kbInfo.event.keyCode);
                break;
        }
    });


    //genericScene.autoClear = false; // Color buffer
    //genericScene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
    //genericScene.getAnimationRatio();
    //genericScene.clearCachedVertexData();
    //genericScene.cleanCachedTextureBuffer();
    return genericScene;
}

function focusAtCanvas() {
    document.getElementById('renderCanvas').focus();
}

function main() {
    document.addEventListener("DOMContentLoaded", function(event) {
        focusAtCanvas();
        //jQuery('canvas#renderCanvas').focus();
        var socket = io.connect(
            window.location.protocol + "//" + window.location.host, {
                transports: ["websocket"],
            }
        );

        dpt = new DPT(socket);
        var restObj = {};
        whoami = {
            dptUUID: "",
            user: {},
        };

        engine = new BABYLON.Engine(canvas, true); //, { preserveDrawingBuffer: true, stencil: true });
        //engine.doNotHandleContextLost = true;
        //engine.enableOfflineSupport = false;

        __topicScene = createGenericScene;
        __topicScene.name = 'topicMap';
        __opinionScene = createGenericScene;
        __opinionScene.name = 'opinionMap';
        currentScene = createGenericScene("topicScene");
        currentScene.name = 'topicMap';

        // Handle the incomming websocket trafic
        socket.on("connect", () => {
            // if needed, we could keep socket.id somewhere
            if (document.cookie) {
                dpt.userLogin(document.cookie);
            }
        });

        socket.on("private", function(restObj) {
            if (restObj.method == "post") {
                if (restObj.path == "/user/login/") {
                    whoami.dptUUID = restObj.data.dptUUID;
                    if (restObj.data.message == "logged in") {
                        whoami.user = restObj.data.user;
                        dpt.getTopic();
                        dpt.getDialogList();
                    }
                    if (restObj.data.message == "user unknown") {
                        whoami.user = {};
                    }
                }
            }
        });

        socket.on("error", function(e) {
            console.log("System", e ? e : "A unknown error occurred");
            document.location.reload(true);
            window.location.reload(true);
        });

        // server says it has some updates for client
        socket.on('update', function(restObj) {

            if (restObj.method == 'post') {

                if (restObj.path == '/info/') {
                    jQuery('#messages')
                        .append(jQuery('<li>')
                            .text(restObj.data.message));

                    window.scrollTo(0, document.body.scrollHeight);
                }
            }

            if (restObj.path == '/topic/' && restObj.method == 'get') {
                dpt.getTopic();
            }

            if (restObj.path == '/dialog/list/' && restObj.method == 'get') {
                dpt.getDialogList();
            }

            if (restObj.path.startsWith('/opinion/') &&
                restObj.data.id == currentTopic &&
                restObj.method == 'get') {
                dpt.getOpinionByTopic(currentTopic);
            }

            if (currentDialog && restObj.path == '/dialog/' + currentDialog.dialog + '/' &&
                restObj.method == 'get' &&
                dialogFormOpen == 1) {
                dpt.getDialog(currentDialog.dialog);
            }
        });

        socket.on("api", function(restObj) {
            if (!restObj || !restObj.path || !restObj.method) {
                return;
            }

            if ('status' in restObj && restObj.status > 399) {

                alert(restObj.data);
                return;

            } else if (currentDialog &&
                restObj.path == '/dialog/' + currentDialog.dialog + '/' &&
                restObj.method == 'get') {

                var old = currentDialog;
                currentDialog = restObj.data;
                currentDialog.topic = old.topic;
                currentDialog.initiatorOpinion = old.initiatorOpinion;
                currentDialog.recipientOpinion = old.recipientOpinion;
                dialogForm();

            }
            if (restObj.path == '/topic/' &&
                restObj.method == 'get') {

                loadTopics(restObj);

            } else if (restObj.path == "/opinion/" + currentTopic + "/" &&
                restObj.method == "get") {

                loadOpinions(restObj);

            } else if (restObj.path == '/opinion/postAllowed/') {
                if (restObj.data.value == true) {
                    opinionForm();
                } else {
                    alert('Only one opinion per topic.');
                }
            } else if (restObj.path == '/dialog/list/' &&
                restObj.method == 'get') {

                loadDialogList(restObj);

            }
        });

        //circlePoints(4, 2, {X: 0, Y: 0});

        engine.runRenderLoop(function() {
            if (currentScene && !powerSave) {
                currentScene.render();
            }
        });

        // Resize
        window.addEventListener("resize", function() {
            engine.resize();
        });

        jQuery(document).on("mouseenter touchstart", "span.myDialogs", function(event) {
            jQuery('body').append(`<div id="dialogInfo" style="position: absolute;
				padding: 20px; margin-left: 25%; border: #fff; border-style: solid;
				border-width: 1px; color: #000; width: 50%; z-index: 2;
				font-family: DPTFont; font-size: 18px; background-color: #00ccffcc;">
				${myDialogMenu[event.currentTarget.id].description}</div>`);
            event.stopImmediatePropagation();
            event.preventDefault();
        });
        jQuery(document).on("click", "span.myDialogs", function(event) {
            jQuery('#dialogInfo').remove();
            jQuery('#dialogForm').remove();
            focusAtCanvas();
            currentDialog = myDialogMenu[event.currentTarget.id];
            dpt.getDialog(currentDialog.dialog);
            event.stopImmediatePropagation();
            event.preventDefault();
        });
        jQuery(document).on("mouseleave touchend", "span.myDialogs", function(event) {
            jQuery('#dialogInfo').remove();
            focusAtCanvas();
            event.stopImmediatePropagation();
            event.preventDefault();
        });
        jQuery(window).blur(function() {
            console.log('window inactive');
            powerSave = true;
        });
        jQuery(window).focus(function() {
            console.log('window active');
            focusAtCanvas();
            powerSave = false;
        });
    });
}

main();