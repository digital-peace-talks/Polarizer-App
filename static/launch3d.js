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



var isMobile = false; //initiate as false
// device detection

if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
    isMobile = true;
}

function hideMenu() {
    jQuery('#button-menu').fadeOut();
    jQuery('#overlay').css("background-image", "url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1200px-Hamburger_icon.svg.png')");

}

function propositionForm(opinionId) {

    console.log('enter proposition');
    jQuery('body').append(`<div id="propositionForm" style="position: absolute; top:0; left: 0px;
		padding: 20px; margin-left: 300px; border: #fff; border-style: solid;
		border-width: 1px; color: #F0F3F5; z-index: 30; font-family: DPTFont;
		font-size: 18px; background-color: #005B9888;">Please enter your proposition:
		<br><form id="proposition"><textarea style="font-family: DPTFont;
		font-size: 18px;" name="proposition" cols="64" rows="4"   width= "500px";
		height="150px";class="proposition"></textarea>
		<input type="hidden" id="opinionId" name="opinionId" value="${opinionId}">
		<br><input style="font-family: DPTFont; font-size: 18px;"

		type="submit" value="Send">
		<input type="button" value="close window" name="close window" id="ClosePropositionForm"></form></div>`);
    jQuery(".proposition").focus();

    jQuery(document).one('click', "#ClosePropositionForm", function(event) {
        propositionFormOpen = 0;
        jQuery('#propositionForm').remove();
        focusAtCanvas();
        event.preventDefault();
    });

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

    if (isMobile) {
        jQuery('body').append(`<div id="topicForm" style="position: fixed; top: 0px; left: 0px; padding: 0px;  margin-left: 5%;
		margin-top: 25%; 
		color: #000; width: 33%; z-index: 2; font-family: DPTFont; font-size: 18px;
		background-color: #005B9888;">New topic:<br><form id="topic">
		<textarea style="font-family: DPTFont; font-size: 18px;" name="topic"
		 cols="43" rows="12" class="topic"   margin: 0 auto;></textarea><br><input style="font-family: DPTFont;
		font-size: 18px;" type="submit"  value="Send"></form></div>`);


    } else {
        jQuery('body').append(`<div id="topicForm" style="position: absolute; top: 0px; left: 0px; padding: 20px;
		margin-left: 300px; border: #fff; border-style: solid; border-width: 1px;
		color: #F0F3F5; z-index: 2; font-family: DPTFont; font-size: 18px;
		background-color: #005B9888;">Please enter a new topic:<br><form id="topic">
		<textarea style="font-family: DPTFont; font-size: 18px;" name="topic"
		cols="51" rows="4" class="topic"></textarea><br><input style="font-family: DPTFont;
		font-size: 18px;" type="submit" value="Send">
		<input type="button" value="close window" name="close window" id="CloseTopicForm"></form></div>`);
    }
    jQuery(".topic").focus();

    jQuery(document).one('click', "#CloseTopicForm", function(event) {
        topicFormOpen = 0;
        jQuery('#topicForm').remove();
        focusAtCanvas();
        event.preventDefault();
    });

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
    jQuery('body').append(`<div id="opinionForm" style="position: absolute; top: 0px; left: 0px;
		padding: 20px; margin-left: 300px; border: #fff; border-style: solid;
		border-width: 1px; color: #F0F3F5; z-index: 2; font-family: DPTFont;
		font-size: 18px; background-color: #005B9888;">Please enter a new opinion:<br>
		<form id="opinion"><textarea style="font-family: DPTFont; font-size: 18px;"
		name="opinion" cols="52" rows="4" class="opinion"></textarea><br>
		<input style="font-family: DPTFont; font-size: 18px;" type="submit"

		value="Send">
		<input type="button" value="close window" name="close window" id="CloseOpinionForm"></form></div>`);
    jQuery(".opinion").focus();

    jQuery(document).one('click', "#CloseOpinionForm", function(event) {
        opinionFormOpen = 0;
        jQuery('#opinionForm').remove();
        focusAtCanvas();
        event.preventDefault();
    });

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


    jQuery('body').append(`<div id="dialogMenu"></div>`);

    jQuery('#dialogMenu').empty();

    for (var i = 0; i < dialogs.length; i++) {

        menuEntry = `<span class="myDialogs" id="${dialogs[i].dialog}"><i>proposition:</i>
		<h2>${dialogs[i].opinionProposition}</h2></span>`;

        dialog = `<u style="font-size: 32px">Dialog Info</u><br><br><i>proposition:</i>
				<br><h2>${dialogs[i].opinionProposition}<h2>
				<i>topic:</i><br>${dialogs[i].topic}<br><br>`;

        if (dialogs[i].initiator == 'me') {

            dialog += `<i>my opinion:</i><br>${dialogs[i].initiatorOpinion}<br><br>
					<i>other's opinion:</i><br><h2>${dialogs[i].recipientOpinion}<h2>
					<i>initiator:</i> me<br><br>`;

        } else {


            dialog += `<i>my opinion:</i><br>${dialogs[i].recipientOpinion}<br><br>
					 <i>other's opinion:</i><br><h2>${dialogs[i].initiatorOpinion}<h2>
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

    if (currentScene.name == 'topicScene') {
        for (var i in currentScene.meshes) {
            if ('dpt' in currentScene.meshes[i] &&
                currentScene.meshes[i].dpt.context == 'topicScene') {
                currentScene.meshes[i].dispose();
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
            JSON.stringify({
                "context": "topicScene",
                "topicId": restObj.data[i]._id,
                "topic": restObj.data[i].content
            }),
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

function createBiColorTube(initiatorOpinion, recipientOpinion, opinionDialogConnections) {

    var sv = new BABYLON.Vector3(initiatorOpinion.position);
    var ev = new BABYLON.Vector3(recipientOpinion.position);
    sv.x = initiatorOpinion.position.x - 2.4;
    sv.y = initiatorOpinion.position.y + 1.2;
    ev.x = recipientOpinion.position.x - 2.4;
    ev.y = recipientOpinion.position.y + 1.2;

    var tube = new BABYLON.MeshBuilder.CreateTube(
        "tube", {
            path: [sv, ev],
            radius: 0.1,
            updatable: true,
        },
        currentScene);

    tube.dpt = {
        context: 'tubeConnection',
        dialogId: opinionDialogConnections[initiatorOpinion.opinionId].dialogId,
        initiatorsOpinion: opinionDialogConnections[initiatorOpinion.opinionId].initiatorsOpinion,
        recipientsOpinion: opinionDialogConnections[initiatorOpinion.opinionId].recipientsOpinion,
    };

    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 32, currentScene);
    var ctx = dynamicTexture.getContext();

    var combination = '';
    if (initiatorOpinion.rating == 'negative') {
        combination = 'red-';
        if (recipientOpinion.rating == 'negative') {
            combination += 'red';
        } else if (recipientOpinion.rating == 'neutral') {
            combination += 'blue';
        } else if (recipientOpinion.rating == 'positive') {
            combination += 'green';
        } else if (recipientOpinion.rating == 'unset') {
            combination += 'grey';
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

    if (combination.indexOf('grey') >= 0) {
        combination = 'grey-grey';
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
    mat.alpha = 0.25;
    //mat.alphaMode = BABYLON.Engine.ALPHA_MAXIMIZED;
    mat.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
    mat.diffuseTexture = dynamicTexture;
    mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    tube.material = mat;

    //return(tube);
}

function dialogRelations(opinionDialogConnections) {
    var initiatorOpinion = {};
    var recipientOpinion = {};
    for (var i in opinionDialogConnections) {
        for (var j in currentScene.meshes) {
            if ('dpt' in currentScene.meshes[j] &&
                currentScene.meshes[j].dpt.context == 'opinionScene' &&
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
                        currentScene.meshes[k].dpt.context == 'opinionScene' &&
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
                        currentScene.meshes[k].dpt.context == 'opinionScene' &&
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
                        currentScene.meshes[k].dpt.context == 'opinionScene' &&
                        currentScene.meshes[k].dpt.opinionId == opinionId) {
                        recipientOpinion.position = currentScene.meshes[k].position;
                        recipientOpinion.opinionId = opinionId;
                        recipientOpinion.rating = 'positive';
                    }
                }
            }
        }
        /*
        for(var j in opinionDialogConnections[i].leafs.unset) {
        	var opinionId = opinionDialogConnections[i].leafs.unset[j];
        	if(opinionId != i) {
        		for(var k in currentScene.meshes) {
        			if('dpt' in currentScene.meshes[k] &&
        				currentScene.meshes[k].dpt.context == 'opinionScene' &&
        				currentScene.meshes[k].dpt.opinionId == opinionId) {
        				recipientOpinion.position = currentScene.meshes[k].position;
        				recipientOpinion.opinionId = opinionId;
        				recipientOpinion.rating = 'unset';
        			}
        		}
        	}
        }
        */

        /*
        initiatorOpinion.position.x -= 2.4;
        initiatorOpinion.position.y += 1.2;
        recipientOpinion.position.x -= 2.4;
        recipientOpinion.position.y += 1.2;
        */

        if ('position' in initiatorOpinion &&
            'position' in recipientOpinion &&
            opinionDialogConnections[initiatorOpinion.opinionId].dialogStatus == 'CLOSED') {
            createBiColorTube(initiatorOpinion, recipientOpinion, opinionDialogConnections);
        }
        //		return(createBiColorTube(currentScene.meshes[k].dpt.opinionId, sv, ev));
    }
}

function loadOpinions(restObj) {
    var i;
    var options = '';
    var canInvite = false;

    if (currentScene.name == 'opinionScene') {
        for (var i in currentScene.meshes) {
            /*
            if('dpt' in currentScene.meshes[i]) {
            	if(currentScene.meshes[i].dpt.context == 'opinionScene'
            	|| currentScene.meshes[i].name == 'tube'
            	|| currentScene.meshes[i].name == 'icon') {
            	*/
            if (currentScene.meshes[i] != 'collisionBox') {
                currentScene.meshes[i].dispose();
            }
            /*
				}
			}
				*/
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
            JSON.stringify({ "context": "opinionScene", "opinionId": restObj.data[i]._id }),
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


        if (canInvite && restObj.data[i].user != 'mine' && restObj.data[i].blocked == 0) {
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

    var lines = text.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var words = lines[i].split(' ');
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
        y += lineHeight;
    }
};



function cropImage(ctx, canvas) {

    var w = canvas.width;
    var h = canvas.height;
    var pix = { x: [], y: [] };
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var x;
    var y;
    var index;

    for (y = 0; y < h; y++) {
        for (x = 0; x < w; x++) {
            index = (y * w + x) * 4;
            if (imageData.data[index + 3] > 0) {
                pix.x.push(x);
                pix.y.push(y);

            }
        }
    }
    pix.x.sort(function(a, b) { return a - b });
    pix.y.sort(function(a, b) { return a - b });
    var n = pix.x.length - 1;

    w = pix.x[n] - pix.x[0];
    h = pix.y[n] - pix.y[0];
    var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(cut, 0, 0);
    return (ctx);
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
    dynamicTexture.hasAlpha = true;

    textureContext = dynamicTexture.getContext();
    textureContext.font = "22px DPTFont";
    textureContext.save();
    textureContext.fillStyle = "#00ccff";

    wrapText(textureContext, text, 5, 20, 479, 22);
    //	textureContext = cropImage(textureContext, textureContext.canvas);

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
        currentScene.name = "topicScene";
        dpt.getTopic();
        event.stopImmediatePropagation();
        event.preventDefault();
        jQuery('#opinionForm').remove();
        jQuery('#topicForm').remove();

        if (isMobile) {
            console.log("mobile behavior!")
            hideMenu();
        }
        focusAtCanvas();

    });


    //create topic button 
    if (dptMode == 'topicScene') {
        jQuery('#new-opinion-btn').hide();
        var newTopicBtn = jQuery('#new-topic-btn');
        newTopicBtn.show();

        newTopicBtn.html(`<img class="btn-icon" src="/topic_white.png">New-Topic`);

        newTopicBtn.on('click touch', function(event) {
                jQuery('#topicForm').remove();

                topicForm();
                event.stopImmediatePropagation();
                event.preventDefault();
                if (isMobile) {
                    console.log("mobile behavior!")
                    hideMenu();
                }


            })
            //create opinion button 
    } else if (dptMode == 'opinionScene') {

        jQuery('#new-topic-btn').hide();
        var newOpinionBtn = jQuery('#new-opinion-btn');
        newOpinionBtn.show();

        newOpinionBtn.html(`<img class="btn-icon" src="/opinion_white.png">New-Opinion`);
        newOpinionBtn.on('click touch', function(event) {
            jQuery('#opinionForm').remove();

            dpt.opinionPostAllowed(currentTopic);
            // alert(dpt.opinionPostAllowed(currentTopic)) <- returns undefined

            event.stopImmediatePropagation();
            event.preventDefault();
            if (isMobile) {
                console.log("mobile behavior!")
                hideMenu();
            }

        });
    }
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
        if (isMobile) {
            console.log("mobile behavior!")
            hideMenu();
        }

    });

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
            btn.src = "/touch_white.png";
        } else {
            BABYLON.VirtualJoystick.Canvas.style.zIndex = "-1";
            btn.src = "/joypad_white.png";
            btn.background = "transparent";
        }
    }
}


var createGenericScene = function(dptMode) {

    var genericScene = new BABYLON.Scene(engine);
    BABYLON.Scene.DoubleClickDelay = 500;

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

                if ('dpt' in pointerInfo.pickInfo.pickedMesh) {
                    if (pointerInfo.pickInfo.pickedMesh.dpt.context == "dialogInvitation") {
                        propositionForm(pointerInfo.pickInfo.pickedMesh.dpt.opinionId);
                    } else if (pointerInfo.pickInfo.pickedMesh.dpt.context == "tubeConnection") {

                        currentDialog = {
                            dialog: pointerInfo.pickInfo.pickedMesh.dpt.dialogId,
                            topic: currentTopicStr,
                            initiatorOpinion: pointerInfo.pickInfo.pickedMesh.dpt.initiatorsOpinion,
                            recipientOpinion: pointerInfo.pickInfo.pickedMesh.dpt.recipientsOpinion,
                        };
                        dpt.getDialog(currentDialog.dialog);

                    }
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
                    pointerInfo.pickInfo.pickedMesh.dpt.context == "topicScene") {
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
                    currentScene.name = "opinionScene";
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
                if(kbInfo.event.key == 'PageUp') {
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
        __topicScene.name = 'topicScene';
        __opinionScene = createGenericScene;
        __opinionScene.name = 'opinionScene';
        currentScene = createGenericScene("topicScene");
        currentScene.name = 'topicScene';

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
                if (currentScene.name == 'topicScene') {
                    dpt.getTopic();
                }
            }

            if (restObj.path == '/dialog/list/' && restObj.method == 'get') {
                dpt.getDialogList();
            }

            if (restObj.path.startsWith('/opinion/') &&
                restObj.data.id == currentTopic &&
                restObj.method == 'get' &&
                currentScene.name == 'opinionScene') {
                dpt.getOpinionByTopic(currentTopic);
            }

            if (currentDialog &&
                restObj.path == '/dialog/' + currentDialog.dialog + '/' &&
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
                if (currentScene.name == 'topicScene') {
                    loadTopics(restObj);
                }

            } else if (restObj.path == "/opinion/" + currentTopic + "/" &&
                restObj.method == "get") {
                if (currentScene.name == 'opinionScene') {
                    loadOpinions(restObj);
                }

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

        /*
        		jQuery(document).on("mouseenter touchstart", "span.myDialogs", function(event) {
        			jQuery('body').append(`<div id="dialogInfo" style="position: absolute;
        				padding: 20px; margin-left: 25%; border: #fff; border-style: solid;
        				border-width: 1px; color: #000; width: 50%; z-index: 2;
        				font-family: DPTFont; font-size: 18px; background-color: #00ccffcc;">
        				${myDialogMenu[event.currentTarget.id].description}</div>`);
        			event.stopImmediatePropagation();
        			event.preventDefault();
        		});
        		jQuery(document).on("mouseleave touchend", "span.myDialogs", function(event) {
        			jQuery('#dialogInfo').remove();
        			focusAtCanvas();
        			event.stopImmediatePropagation();
        			event.preventDefault();
        		});
        */
        jQuery(document).on("click touch", "span.myDialogs", function(event) {
            jQuery('#dialogInfo').remove();
            jQuery('#dialogForm').remove();
            focusAtCanvas();
            currentDialog = myDialogMenu[event.currentTarget.id];
            dpt.getDialog(currentDialog.dialog);
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

        //mobile version menu details

        jQuery('#overlay').on('click touch', function() {
            if (jQuery('#button-menu').is(":hidden")) {
                jQuery('#button-menu').fadeIn();
                jQuery('#overlay').css("background-image", "url()");
                jQuery('#topicForm').remove();
            }

        })
    });
}

main();