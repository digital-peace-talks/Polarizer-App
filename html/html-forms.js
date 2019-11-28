var isMobile = false; //initiate as false
// device detection

if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
	/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
	isMobile = false;
}

function hideMenu() {
	//jQuery('#button-menu').fadeOut();
	//jQuery('#overlay').css("background-image", "url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/1200px-Hamburger_icon.svg.png')");
}

function settingsForm(opinionId, topicId) {

	console.log('settings/preferences');

	var theme = 0;
	var colors = "Color scheme:<br>";
	var stealthMode = 'checked';
	
	if(!whoami.user.preferences.stealthMode) {
		stealthMode = '';
	}
	for(var i = 0; i <= 2; i++) {
		if(whoami.user.preferences.colorScheme == i) {
			colors += `<label><input type="radio" name="colorScheme" value="${i}" checked>`;
		} else {
			colors += `<label><input type="radio" name="colorScheme" value="${i}">`;
		}
		switch(i) {
			case DPTConst.COLORS_bright:
				colors += " Bright</label>";
				break
			case DPTConst.COLORS_dark:
				colors += " Dark</label>";
				break
			case DPTConst.COLORS_default:
			default:
				colors += " Default</label>";
				break
		}
		colors += "<br>";
	}
	
	jQuery('body').append(`
		<div id="form" class="helpframe" style="visibility: ${settingsVisible};"><h1>Settings:</h1>
		<hr>
		Your passphrase:
		<br>
		${whoami.user.phrase}
		<input type="image" class="copyToClip" src="/copytoclipboard_dark.png" onClick="copyToClipboard('${whoami.user.phrase}');"/>
		<br>
		<hr>
		<b>Change UI-Theme:</b>
		<div>
		<input class="button" type="button" value="MC" id="changetheme6">
		<input class="button" type="button" value="Love" id="changetheme5">
		<input class="button" type="button" value="Thx" id="changetheme4">
		<input class="button" type="button" value="Dark" id="changetheme3">
		<input class="button" type="button" value="Bright" id="changetheme2">
		<input class="button" type="button" value="DPT" id="changetheme1">
		</div>
		<br>
		<br>
		<hr>
		Change 3D-Theme:
		<form id="settings">
		${colors}
		<hr>
		Do you like to be visible to other Users? Then uncheck the checkbox.
		<br>
		Stealth-Mode: <input type="checkbox" name="stealthMode" ${stealthMode}>
		<br>
		<input class="button" type="submit" value="Apply">
		<input class="closeButton" type="button" value="&#10005;" name="close" id="closeSettingsForm">
		</form></div>
	`);

	jQuery(document).on('click touch', "#changetheme1", function(event) {
		document.getElementById('theme_css').href = 'dpt_classic.css';
		theme = 0;
	});

	jQuery(document).on('click touch', "#changetheme2", function(event) {
		document.getElementById('theme_css').href = 'dpt_bright.css';
		theme = 1;
	});

	jQuery(document).on('click touch', "#changetheme3", function(event) {
		document.getElementById('theme_css').href = 'dpt_dark.css';
		theme = 2;
	});

	jQuery(document).on('click touch', "#changetheme4", function(event) {
		document.getElementById('theme_css').href = 'dpt_linden.css';
		theme = 3;
	});

	jQuery(document).on('click touch', "#changetheme5", function(event) {
		document.getElementById('theme_css').href = 'dpt_love.css';
		theme = 4;
	});

	jQuery(document).on('click touch', "#changetheme6", function(event) {
		document.getElementById('theme_css').href = 'dpt_mc.css';
		theme = 5;
	});

	jQuery(document).on('click touch', "#closeSettingsForm", function(event) {
		settingsVisible = 'hidden';
		jQuery('#form').remove();
		event.preventDefault();
	});
	
	jQuery(document).on('submit', 'form#settings', function(event) {
		settingsVisible = 'hidden';
		event.stopImmediatePropagation();
		event.preventDefault();
		whoami.user.preferences.colorScheme = jQuery('input[name=colorScheme]:checked').val() * 1;
		whoami.user.preferences.htmlScheme = theme;
		if(jQuery('input[name=stealthMode]:checked').val() == 'on') {
			whoami.user.preferences.stealthMode = true;
		} else {
			whoami.user.preferences.stealthMode = false;
		}
		whoami.user.preferences.guidedTour = whoami.user.preferences.guidedTour;

		dpt.userUpdate(whoami.dptUUID,
			{
				"preferences": {
					colorScheme: whoami.user.preferences.colorScheme,
					htmlScheme: whoami.user.preferences.htmlScheme,
					stealthMode: whoami.user.preferences.stealthMode,
					guidedTour: whoami.user.preferences.guidedTour,
				}
			},
		);
		jQuery('#form').remove();
		
		if(currentScene.name == "topicScene") {
			topicCamState = currentScene.cameras[0].storeState();
			currentScene.dispose();
			currentScene = __topicScene("topicScene");
			currentScene.name = "topicScene";
			dpt.getTopic();
		} else {
			opinionCamState = currentScene.cameras[0].storeState();
			currentScene.dispose();
			currentScene = __opinionScene("opinionScene");
			currentScene.name = "opinionScene";
			dpt.getOpinionByTopic(currentTopic);
		}
		focusAtCanvas();

	});
}

function propositionForm(opinionId, topicId) {

	console.log('enter proposition');

	jQuery('body').append(`
		<div id="form">Please enter your proposition:
		<br><form id="proposition"><textarea name="proposition" class="proposition"></textarea>
		<input type="hidden" id="opinionId" name="opinionId" value="${opinionId}">
		<input type="hidden" id="topicId" name="topicId" value="${topicId}">
		<br><input class="button" type="submit" value="Confirm">
		<input class="closeButton" type="button" value="&#10005;" name="close window" id="ClosePropositionForm"></form></div>
	`);

	jQuery(".proposition").focus();

	jQuery(document).on('click', "#ClosePropositionForm", function(event) {
		propositionFormOpen = 0;
		jQuery('#form').remove();
		focusAtCanvas();
		event.preventDefault();
	});

	jQuery(document).on('keydown', '.proposition', function(event) {
		var n = jQuery('.proposition').val().length;
		if (n >= 512) {
			jQuery('.proposition').css({ "background-color": "#ff8888", "color": "#005B98" });
			if (event.keyCode != 8 &&
				event.keyCode != 127 &&
				event.keyCode != 37 &&
				event.keyCode != 38 &&
				event.keyCode != 39 &&
				event.keyCode != 40) {
				event.preventDefault();
			}
		} else {
			var bg = jQuery('textarea.proposition').css('background-color');
			if (bg != "rgb(255,255,255)") {
				jQuery('textarea.proposition').css({ "background-color": "rgb(255,255,255)" });
			}
		}
		if (event.keyCode == 27) {
			jQuery('#form').remove();
			focusAtCanvas();
			event.preventDefault();
		}
		if(event.keyCode == 10 || event.keyCode == 13) {
			event.preventDefault();
		}
		if (event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)) {
			jQuery('form#proposition').submit();
		}
	});

	jQuery(document).on('submit', 'form#proposition', function(event) {
		event.stopImmediatePropagation();
		event.preventDefault();
		var proposition = jQuery('.proposition').val();
		var opinionId = jQuery('#opinionId').val();
		var topicId = jQuery('#topicId').val();
		if (proposition) {
			dpt.postDialog(proposition, whoami.dptUUID, opinionId, topicId);
		}
		jQuery('#form').remove();
		focusAtCanvas();
	});
}

function topicEdit(context) {
	topicForm(true, context);
}

function topicForm(edit, context) {
	console.log('enter topic');

	var topic = '';
	var hiddenTopicId = '';
	if (edit) {
		topic = context.content;
		edit = `<input type="hidden" class="edit" name="edit" value="edit" />`;
		hiddenTopicId = `<input type="hidden" name="topicId" class="topicId" value="${context.topicId}">`;
	} else {
		edit = '';
	}
	if (isMobile) {
		jQuery('body').append(`
			<div id="form">New topic:<br><form id="topic">
			<textarea name="topic"
			class="topic">${topic}</textarea><br>
			<input class="button" type="submit" value="send">${edit}${hiddenTopicId}</form></div>
		`);

	} else {
		jQuery('body').append(`
			<div id="form">
			Please enter a new topic:<br><form id="topic">
			<textarea name="topic" class="topic">${topic}</textarea><br>
			<input class="button" type="submit" value="Confirm">
			<input class="closeButton" type="button" value="&#10005;" name="close window"
			id="CloseTopicForm">${edit}${hiddenTopicId}</form></div>
		`);
	}
	jQuery(".topic").focus();

	jQuery(document).on('click', "#CloseTopicForm", function(event) {
		// topicFormOpen = 0;
		jQuery('#form').remove();
		focusAtCanvas();
		event.preventDefault();
	});

	jQuery(document).on('keydown', '.topic', function(event) {
		var n = jQuery('.topic').val().length;
		if (n >= 256) {
			jQuery('textarea.topic').css({ "background-color": "#ff8888" });
			if (event.keyCode != 8
			&& event.keyCode != 127
			&& event.keyCode != 37
			&& event.keyCode != 38
			&& event.keyCode != 39
			&& event.keyCode != 40) {
				event.preventDefault();
			}
		} else {
			jQuery('textarea.topic').css({ "background-color": "#ffffff" });
		}
		if (event.keyCode == 27) {
			jQuery('#form').remove();
			event.preventDefault();
			focusAtCanvas();
		}
		if (event.keyCode == 10 || event.keyCode == 13) {
			event.preventDefault();
		}
		if (event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)) {
			jQuery('form#topic').submit();
			event.preventDefault();
			focusAtCanvas();
		}
	});

	jQuery(document).on('submit', 'form#topic', function(event) {
		event.stopImmediatePropagation();
		event.preventDefault();
		var topic = jQuery('.topic').val();
		var topicId = jQuery('.topicId').val();
		var edit = jQuery('.edit').val();
		if (topic) {
			if (edit == "edit") {
				dpt.putTopic(topic, topicId, whoami.dptUUID);
			} else {
				dpt.postTopic(topic);
			}
		}
		jQuery('#form').remove();
		focusAtCanvas();

	});
}

function opinionContext(context) {
	jQuery("#form").remove();
	jQuery("body").append(`
		<div id="form">
			<div style="height: 500px; overflow: auto;">
			<i>Opinion:</i>
			<p>
			${context.content}
			</p>
			<br>
			<i>Details:</i>
			${context.opinionContext?context.opinionContext:'<p>none.</p>'}
			<input class="closeButton" type="button" value="&#10005;" name="close" id="closeSettingsForm" >
			</div>
		</div>
	`);
	jQuery("#closeSettingsForm").on('click touch', function(event) {
		jQuery('#form').remove();
		event.stopImmediatePropagation();
		event.preventDefault();
	});
}

function opinionEdit(context) {
	opinionForm(true, context);
}

function opinionForm(edit, context) {
	console.log('enter opinion');

	var opinion = '';
	var opinionContext = '';
	var opinionIdHidden = '';
	var deleteButton = '';
	if (edit) {
		opinion = context.content;
		opinionContext = context.opinionContext;
		edit = `<input type="hidden" class="edit" name="edit" value="edit" />`;
		opinionIdHidden = `<input type="hidden" class="opinionId" name="opinionId" value="${context.opinionId}" />`;
		//deleteButton = `<input class="button" type="button" value="Delete" name="Delete" id="DeleteOpinion"/>`;
	} else {
		edit = '';
	}
	var opinionContext = '';
	if(context && context.opinionContext) {
		opinionContext = context.opinionContext;
	}
	jQuery('body').append(`
		<div id="form">
		Please enter a new opinion:<br>
		<form id="opinion">
		<textarea name="opinion" class="opinion">${opinion}</textarea><br>
		Details:
		<textarea class="opinionContext">${opinionContext}</textarea>
		<input class="button" type="submit" value="Confirm"> 
		<input class="closeButton" type="button" value="&#10005;" name="close window"
		id="CloseOpinionForm">${deleteButton}${edit}${opinionIdHidden}
		</form></div>
	`);
	jQuery(".opinionContext").trumbowyg({
		btns: [
			['formatting'],
			['strong', 'em', 'del'],
			['link'],
			['insertImage'],
			['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
			['unorderedList', 'orderedList'],
	    ],
	    adjustHeight: false,
		defaultLinkTarget: '_blank',
		imageWidthModalEdit: true,
	});

	jQuery(".opinion").focus();

	jQuery(document).on('click', "#CloseOpinionForm", function(event) {
		opinionFormOpen = 0;
		jQuery('#form').remove();
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
			var bg = jQuery('textarea.opinion').css('background-color');
			if (bg != "rgb(255,255,255)") {
				jQuery('textarea.opinion').css({ "background-color": "rgb(255,255,255)" });
			}
		}
		if (event.keyCode == 27) {
			jQuery('#form').remove();
			event.preventDefault();
		}
		if (event.keyCode == 10 || event.keyCode == 13) {
			event.preventDefault();
		}
		if (event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)) {
			jQuery('form#opinion').submit();
		}
	});

	jQuery(document).on('submit', 'form#opinion', function(event) {
		event.stopImmediatePropagation();
		event.preventDefault();
		var opinion = jQuery('.opinion').val();
		var context = jQuery('.opinionContext').val();
		var opinionId = jQuery('.opinionId').val();
		var edit = jQuery('.edit').val();
		if (opinion) {
			if (edit == 'edit') {
				dpt.putOpinion(whoami.dptUUID, opinionId, currentTopic, opinion, context);
			} else {
				dpt.postOpinion(currentTopic, opinion, context);
			}
		}
		jQuery('#form').remove();
	});
}

function loadDialogList(restObj) {
	var dialog = '';
	var menuEntry = '';
	var dialogs = restObj.data.data;


	var sum = 0;
	for(var i in dialogs) {
		sum += dialogs[i].unreadMessages;
	}
	if(sum > 0) {
		jQuery('#dialog-btn-label').css("display", "show")
		jQuery('#dialog-btn-label').attr('count', sum);
		jQuery('#dialog-btn-label').empty().text(`${sum}`);
	} else {
		jQuery('#dialog-btn-label').attr('count', 0);
		jQuery('#dialog-btn-label').empty().text(``);
		jQuery('#dialog-btn-label').css("display", "none")
	
	}
	jQuery('body').append(`<div id="dialogMenu"></div>`);

	jQuery('#dialogMenu').empty();
	jQuery('#dialogMenu').append(`<button class="closeButton" id="close-dialog-btn">&#10005;</button>`);
	
	jQuery(document).on('click touch', "#close-dialog-btn", function(event) {

		hideDialogList();
		jQuery('#close-dialog-btn').visibility(false);
		focusAtCanvas();
		event.preventDefault();
	});

	for (var i = 0; i < dialogs.length; i++) {

		if(dialogs[i].unreadMessages > 0) {
			sum = ' ['+dialogs[i].unreadMessages+']';
		} else {
			sum = '';
		}

		menuEntry = `
			<span class="myDialogs" id="${dialogs[i].dialog}" count="${dialogs[i].unreadMessages}">
			<i>proposition:</i><h2>${dialogs[i].opinionProposition}${sum}</h2></span>
		`;

		dialog = `
			<u style="font-size: 32px">Dialog Info</u><br><br>
			<i>proposition:</i><br><h2>${dialogs[i].opinionProposition}<h2>
			<i>topic:</i><br>${dialogs[i].topic}<br><br>
		`;

		if (dialogs[i].initiator == 'me') {

			dialog += `
				<i>my opinion:</i><br>${dialogs[i].initiatorOpinion}<br><br>
				<i>other's opinion:</i><br><h2>${dialogs[i].recipientOpinion}<h2>
				<i>initiator:</i> me<br><br>
			`;

		} else {

			dialog += `
				<i>my opinion:</i><br>${dialogs[i].recipientOpinion}<br><br>		
				<i>other's opinion:</i><br><h2>${dialogs[i].initiatorOpinion}<h2>
				<i>initiator:</i> other<br><br>
			`;
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

// GUI Menubar Buttons
var createGUIScene = function(dptMode) {

	//create about button
	var aboutBtn = jQuery('#about-btn');
	aboutBtn.show();

	aboutBtn.on('click touch', function(event) {

		if (aboutVisible == 'visible') {
			aboutVisible = 'hidden';
		} else {
			aboutVisible = 'visible';
		}
		jQuery('.helpframe').css({ visibility: aboutVisible });
		
		event.stopImmediatePropagation();
		event.preventDefault();
		if (isMobile) {
			console.log("mobile behavior!")
			hideMenu();
		}
		hideDialogList();
		jQuery('#form').remove();

		jQuery('body').append(`
			<div id="form" class="helpframe" style="visibility: ${aboutVisible};">
			<h1>About</h1>
			<hr>
			<p>Digital Peace Talks gUG (h.b.)</p>
			<p>A digital space where everyone can express and understand opinions</p>
			<a href="http://www.digitalpeacetalks.com" target="_blank">Visit Our Website</a>
			<button class="closeButton" id="close-btn">&#10005;</button>
			</div>
		`);
		jQuery(document).on('click touch', "#close-btn", function(event) {
			aboutVisible = 'hidden';
			hideDialogList();
			jQuery('#form').remove();
			focusAtCanvas();
			event.preventDefault();
		});
	
	});

	function closeRightMenu(){
		var menuLeft = canvas.width;
		if(canvas.width > 640) {
			menuLeft = 228;
		}

		hamburgerOpen = !hamburgerOpen;
		if(hamburgerOpen) {
			jQuery("nav ul").css("left", "0px");
			jQuery("a.hamburger").html('<img src="/button_close.png">');
		} else {
			jQuery("nav ul").css("left", menuLeft);
			jQuery("a.hamburger").html('<img src="/button_menu.png">');
		}

	}

	//create first steps button
	var fsBtn = jQuery('#firststeps-btn');
	fsBtn.show();
	fsBtn.on('click touch', function(event) {

		if (tutorialVisible == 'visible') {
			tutorialVisible = 'hidden';
		} else {
			tutorialVisible = 'visible';
		}
		jQuery('.helpframe').css({ visibility: tutorialVisible });
		
		hideDialogList();
		jQuery('#form').remove();

		jQuery('body').append(`
		<div id="form" class="helpframe" style="visibility: ${tutorialVisible};">
		<h1>First steps</h1>
			<hr>
			<p>Navigation:</p>
		<img src="/dpt_gestures.png" alt="help" class="helpimage">
		<button class="closeButton" id="close-btn">&#10005;</button>
		</div>
		`);
		jQuery(document).on('click touch', "#close-btn", function(event) {
			tutorialVisible = 'hidden';
			hideDialogList();
			jQuery('#form').remove();
			focusAtCanvas();
			event.preventDefault();
		});
	
	});

	//create documentation button
	var docuBtn = jQuery('#documentation-btn');
	docuBtn.show();
	docuBtn.on('click touch', function(event) {
		hideDialogList();
		window.open("dpt-doku.html");
	});

	//create survey button
	var surveyBtn = jQuery('#survey-btn');
	surveyBtn.show();

	surveyBtn.on('click touch', function(event) {
		if (surveyVisible == 'visible') {
			surveyVisible = 'hidden';
		} else {
			surveyVisible = 'visible';
		}
		jQuery('.helpframe').css({ visibility: surveyVisible });
		
		hideDialogList();
		jQuery('#form').remove();

		jQuery('body').append(`
			<div id="form" class="helpframe" style="height: 80%; visibility: ${surveyVisible};">
				 <iframe id="feedbackIframe" style="width: 100%; height: 100%;" src="https://simple-feedback.dpt.world/"></iframe> 
			</div>`)

			window.addEventListener('message', event => {
				// IMPORTANT: check the origin of the data! 
				surveyVisible = 'hidden';
				if (event.origin.startsWith('https://simple-feedback.dpt.world') &&
					event.data == 'simple-feedback-finished') {
					jQuery('#feedbackIframe').remove();
					jQuery('#form').remove();
				} else {
					return;
				}
			});

		if (isMobile) {
			console.log("mobile behavior!")
			hideMenu();
		}
		focusAtCanvas();
	});
	
	//create imprint button
	var imprintBtn = jQuery('#imprint-btn');
	imprintBtn.show();
	imprintBtn.on('click touch', function(event) {
		opinionCamState = currentScene.cameras[0].storeState();
		currentScene.dispose();
		currentScene = __topicScene("topicScene");
		currentScene.name = "topicScene";
		dpt.getTopic();
		event.stopImmediatePropagation();
		event.preventDefault();
		jQuery('#form').remove();

		if (isMobile) {
			console.log("mobile behavior!")
			hideMenu();
		}
		focusAtCanvas();
	});
	
	// create settings button
	var settingsBtn = jQuery('#settings-btn');
	settingsBtn.show();

	settingsBtn.on('click touch', function(event) {

		if (settingsVisible == 'visible') {
			settingsVisible = 'hidden';
		} else {
			settingsVisible = 'visible';
		}
		jQuery('#form').css({ visibility: settingsVisible });
		
		hideDialogList();
		event.stopImmediatePropagation();
		event.preventDefault();
		jQuery('#form').remove();
		settingsForm();
		
		if(isMobile) {
			hideMenu();
		}

	});

	//create home button
	var homeBtn = jQuery('#home-btn');
	homeBtn.show();
	homeBtn.on('click touch', function(event) {
		hideDialogList();
		opinionCamState = currentScene.cameras[0].storeState();
		currentScene.dispose();
		currentScene = __topicScene("topicScene");
		currentScene.name = "topicScene";
		dpt.getTopic();
		event.stopImmediatePropagation();
		event.preventDefault();
		jQuery('#form').remove();

		if (isMobile) {
			console.log("mobile behavior!")
			hideMenu();
		}
		focusAtCanvas();
	});

	//create search button
	var searchBtn = jQuery('#search-btn');
	searchBtn.show();

	searchBtn.on('click touch', function(event) {

		if (searchVisible == 'visible') {
			searchVisible = 'hidden';
		} else {
			searchVisible = 'visible';
		}
		jQuery('#form').css({ visibility: searchVisible });

		hideDialogList();
		requestSearch();
	});


	//create topic button 
	if (dptMode == 'topicScene') {
		jQuery('#new-opinion-btn').hide();
		var newTopicBtn = jQuery('#new-topic-btn');
		newTopicBtn.show();

		newTopicBtn.html(`<img class="btn-bar-icon" src="/topic_white.png">`);

		newTopicBtn.on('click touch', function(event) {
			hideDialogList();
			jQuery('#form').remove();

			topicForm();
			event.stopImmediatePropagation();
			event.preventDefault();
			if (isMobile) {
				console.log("mobile behavior!")
				hideMenu();
			}

		});


		//create opinion button 
	} else if (dptMode == 'opinionScene') {

		jQuery('#new-topic-btn').hide();
		var newOpinionBtn = jQuery('#new-opinion-btn');
		newOpinionBtn.show();

		newOpinionBtn.html(`<img class="btn-bar-icon" src="/opinion_white.png">`);
		newOpinionBtn.on('click touch', function(event) {
			hideDialogList();
			jQuery('#form').remove();

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
		jQuery('#close-dialog-btn').css({
			WebkitTransition : 'opacity 0s ease-in-out',
			MozTransition    : 'opacity 0s ease-in-out',
			MsTransition     : 'opacity 0s ease-in-out',
			OTransition      : 'opacity 0s ease-in-out',
			transition       : 'opacity 0s ease-in-out'
		});
		jQuery('#close-dialog-btn').css({ visibility: myDialogsVisible });
		event.stopImmediatePropagation();
		event.preventDefault();
		if (isMobile) {
			console.log("mobile behavior!")
			hideMenu();
		}

	});
}

function switchToTopics() {
	opinionCamState = currentScene.cameras[0].storeState();
	currentScene.dispose();
	currentScene = __topicScene("topicScene");
	currentScene.name = "topicScene";
	dpt.getTopic();
	jQuery('#form').remove();
	if (isMobile) {
		console.log("mobile behavior!")
		hideMenu();
	} 
	focusAtCanvas();
}

function requestHome() {
	var btn = document.createElement("input");
	btn.className = "iconBar";
	btn.style.zIndex = 10;
	btn.style.position = "absolute";
	btn.style.bottom = "5px";
	btn.style.right = "200px";
	btn.width = "50";
	btn.height = "50";
	btn.type = "image";
	btn.src = "/home_white.png";
	btn.style.color = "#f00";
	document.body.appendChild(btn);

	btn.onclick = () => {
		switchToTopics();
		event.stopImmediatePropagation();
		event.preventDefault();
	}
}

function requestSearch() {
	
	jQuery("#form").remove();
	jQuery('body').append(`
		<div id="form" style="visibility: ${searchVisible};">
		Search in Topics:
		<form class="searchString">
		<input type="text" id="searchString" name="searchString" style="width:100%;">
		</form>
		<input class="closeButton" type="button" value="&#10005;" name="close" id="closeSettingsForm" >
		</div>
	`);
	jQuery("#searchString").focus();

	jQuery("#closeSettingsForm").on('click touch', function(event) {
		searchVisible = 'hidden';
		jQuery('#form').remove();
		event.stopImmediatePropagation();
		event.preventDefault();
	});

	jQuery(document).on('submit', '.searchString', function(event) {
		event.preventDefault();
		if(currentScene.name == "opinionScene") {
			opinionCamState = currentScene.cameras[0].storeState();
			currentScene.dispose();
			currentScene = __topicScene("topicScene");
			currentScene.name = "topicScene";
		}
		dpt.searchTopicsAndOpinions(jQuery('#searchString').val());
	});
	jQuery(document).on('keydown', '.searchString', function(event) {
		if (event.keyCode == 27) {
			jQuery('#form').remove();
			focusAtCanvas();
			event.preventDefault();
		}
	});
} 

function requestNewTopic() {
	var btn = document.createElement("input");
	btn.className = "iconBar";
	btn.style.zIndex = 10;
	btn.style.position = "absolute";
	btn.style.bottom = "5px";
	btn.style.right = "150px";
	btn.width = "50";
	btn.height = "50";
	btn.type = "image";
	btn.src = "/topic_white.png";
	btn.style.color = "#f00";
	document.body.appendChild(btn);
	/* btn.onclick = ()=> {
		alert('newTopic btn pressed!');
	} */
	btn.onclick = () => {
		jQuery('#form').remove();
		topicForm();
		event.stopImmediatePropagation();
		event.preventDefault();
		/* if (isMobile) {
			console.log("mobile behavior!")
			hideMenu();
		} */

	};
}

function requestNewOpinion() {
	var btn = document.createElement("input");
	btn.className = "iconBar";
	btn.style.zIndex = 10;
	btn.style.position = "absolute";
	btn.style.bottom = "5px";
	btn.style.right = "150px";
	btn.width = "50";
	btn.height = "50";
	btn.type = "image";
	btn.src = "/opinion_white.png";
	btn.style.color = "#f00";
	document.body.appendChild(btn);
	/* btn.onclick = ()=> {
		alert('newOpinion btn pressed!');
	} */
	btn.onclick = () => {
		jQuery('#form').remove();
		dpt.opinionPostAllowed(currentTopic);
		// alert(dpt.opinionPostAllowed(currentTopic)) <- returns undefined

		event.stopImmediatePropagation();
		event.preventDefault();
		/* if (isMobile) {
			console.log("mobile behavior!")
			hideMenu();
		} */

	}
}

function toggleDialogList() {
	if (myDialogsVisible == 'visible') {
		myDialogsVisible = 'hidden';
	} else {
		myDialogsVisible = 'visible';
	}
	jQuery('#dialogMenu').css({ visibility: myDialogsVisible });
	jQuery('#close-dialog-btn').css({
		WebkitTransition : 'opacity 0s ease-in-out',
		MozTransition    : 'opacity 0s ease-in-out',
		MsTransition     : 'opacity 0s ease-in-out',
		OTransition      : 'opacity 0s ease-in-out',
		transition       : 'opacity 0s ease-in-out'
	});
	jQuery('#close-dialog-btn').css({ visibility: myDialogsVisible });
}

function hideDialogList() {
	if(myDialogsVisible = 'visible') {
		jQuery('#dialogMenu').css("visibility", "hidden");
		jQuery('#close-dialog-btn').css({
			WebkitTransition : 'opacity 0s ease-in-out',
			MozTransition    : 'opacity 0s ease-in-out',
			MsTransition     : 'opacity 0s ease-in-out',
			OTransition      : 'opacity 0s ease-in-out',
			transition       : 'opacity 0s ease-in-out'
		});
		jQuery('#close-dialog-btn').css("visibility", "hidden");
		myDialogsVisible = 'hidden';
	}
}

function requestYourDialogs() {
	var btn = document.createElement("input");
	btn.className = "iconBar";
	btn.style.zIndex = 10;
	btn.style.position = "absolute";
	btn.style.bottom = "5px";
	btn.style.right = "100px";
	btn.width = "50";
	btn.height = "50";
	btn.type = "image";
	btn.src = "/1message_white.png";
	btn.style.color = "#f00";
	document.body.appendChild(btn);
	/* btn.onclick = ()=> {
		alert('yourDialogs btn pressed!');
	} */
	btn.onclick = () => {
		toggleDialogList();
		jQuery('#dialogMenu').css({ visibility: myDialogsVisible });
		jQuery('#close-dialog-btn').css({
			WebkitTransition : 'opacity 0s ease-in-out',
			MozTransition    : 'opacity 0s ease-in-out',
			MsTransition     : 'opacity 0s ease-in-out',
			OTransition      : 'opacity 0s ease-in-out',
			transition       : 'opacity 0s ease-in-out'
		});
		jQuery('#close-dialog-btn').css({visibility: myDialogsVisible});
		event.stopImmediatePropagation();
		event.preventDefault();
		/* if (isMobile) {
			console.log("mobile behavior!")
			hideMenu();
		} */
	}
}


function requestHelp() {
	var btn = document.createElement("input");
	btn.className = "iconBar";
	//			btn.innerText = "Enable/Disable Joystick";
	btn.style.zIndex = 10;
	btn.style.position = "absolute";
	btn.style.bottom = "10px";
	btn.style.right = "50px";
	btn.width = "50";
	btn.height = "50";
	btn.type = "image";
	btn.src = "/help_white.png";
	btn.style.color = "#f00";
	document.body.appendChild(btn);

	// Button toggle logic
	btn.onclick = () => {
		jQuery('body').append(`
			<div id="form" class="helpframe">
			<img src="/dpt_gestures.png" alt="help" class="helpimage">
			<button class="closeButton" id="close-btn">&#10005;</button>
			</div>
		`);
		window.addEventListener('message', event => {
			// IMPORTANT: check the origin of the data! 
			if (event.data == 'simple-help-finished') {

				jQuery('#form').remove();
			} else {
				return;
			}
		});

		jQuery(document).on('click', "#close-btn", function(event) {
			jQuery('#form').remove();
			focusAtCanvas();
			event.preventDefault();
		});
	}
}


function pauseEngine() {
	var btn = document.createElement("input");
	btn.className = "iconBar";
	//			btn.innerText = "Enable/Disable Joystick";
	btn.style.zIndex = 10;
	btn.style.position = "absolute";
	btn.style.bottom = "50px";
	btn.style.right = "150px";
	btn.width = "50";
	btn.height = "50";
	btn.type = "image";
	btn.src = "/survey_white.png";
	btn.style.color = "#f00";
	document.body.appendChild(btn);

	// Button toggle logic
	btn.onclick = () => {
		powerSave = !powerSave;
	}
}


jQuery(document).on("click touch touchend", "span.myDialogs", function(event) {
	jQuery('#dialogInfo').remove();
	jQuery('#form').remove();
	focusAtCanvas();

	var oldCount = jQuery(this).attr("count");
	var text = jQuery(this).children("h2").text();
	var count = jQuery("span#dialog-btn-label").attr("count");

	jQuery(this).attr("count", 0);
	text = text.replace(` ${oldCount}`, '');
	jQuery(this).children("h2").text(text);
	text = jQuery("span#dialog-btn-label").text();

	if((count - oldCount) > 0) {
		text = text.replace(` ${count}`, ' '+(count - oldCount)+'');
		jQuery("span#dialog-btn-label").text(text);
		jQuery("span#dialog-btn-label").attr('count', (count - oldCount));
	} else {
		text = text.replace(` ${count}`, '');
		jQuery("span#dialog-btn-label").text(text);
		jQuery("span#dialog-btn-label").attr('count', 0);
	}

	currentDialog = myDialogMenu[event.currentTarget.id];
	dpt.getDialog(currentDialog.dialog);
	event.stopImmediatePropagation();
	event.preventDefault();
});


//mobile version menu details