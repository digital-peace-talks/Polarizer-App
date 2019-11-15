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

function propositionForm(opinionId, topicId) {

	console.log('enter proposition');

	jQuery('body').append(`
		<div id="form">Please enter your proposition:
		<br><form id="proposition"><textarea name="proposition" class="proposition"></textarea>
		<input type="hidden" id="opinionId" name="opinionId" value="${opinionId}">
		<input type="hidden" id="topicId" name="topicId" value="${topicId}">
		<br><input class="button" type="submit" value="Send">
		<input class="button" type="button" value="close window" name="close window" id="ClosePropositionForm"></form></div>
	`);

	jQuery(".proposition").focus();

	jQuery(document).one('click', "#ClosePropositionForm", function(event) {
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
		/*
		if(event.keyCode == 10 || event.keyCode == 13) {
			event.preventDefault();
		}
		*/
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
			<input class="button" type="submit" value="send">
			<input class="button" type="button" value="close window" name="close window"
			id="CloseTopicForm">${edit}${hiddenTopicId}</form></div>
		`);
	}
	jQuery(".topic").focus();

	jQuery(document).on('click', "#CloseTopicForm", function(event) {
		topicFormOpen = 0;
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

function opinionEdit(context) {
	opinionForm(true, context);
}

function opinionForm(edit, context) {
	console.log('enter opinion');

	var opinion = '';
	var opinionIdHidden = '';
	var deleteButton = '';
	if (edit) {
		opinion = context.content;
		edit = `<input type="hidden" class="edit" name="edit" value="edit" />`;
		opinionIdHidden = `<input type="hidden" class="opinionId" name="opinionId" value="${context.opinionId}" />`;
		//deleteButton = `<input class="button" type="button" value="Delete" name="Delete" id="DeleteOpinion"/>`;
	} else {
		edit = '';
	}
	jQuery('body').append(`
		<div id="form">
		Please enter a new opinion:<br> <form id="opinion">
		<textarea name="opinion" class="opinion">${opinion}</textarea><br>
		<input class="button" type="submit" value="Send"> 
		<input class="button" type="button" value="close window" name="close window"
		id="CloseOpinionForm">${deleteButton}${edit}${opinionIdHidden}</form></div>
	`);

	jQuery(".opinion").focus();

	jQuery(document).one('click', "#CloseOpinionForm", function(event) {
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
		var opinionId = jQuery('.opinionId').val();
		var edit = jQuery('.edit').val();
		if (opinion) {
			if (edit == 'edit') {
				dpt.putOpinion(whoami.dptUUID, opinionId, currentTopic, opinion);
			} else {
				dpt.postOpinion(currentTopic, opinion);
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
		jQuery('#dialog-btn-label').attr('count', sum);
		jQuery('#dialog-btn-label').empty().text(`Your Dialogs [${sum}]`);
	} else {
		jQuery('#dialog-btn-label').attr('count', 0);
		jQuery('#dialog-btn-label').empty().text(`Your Dialogs`);
	}
	jQuery('body').append(`<div id="dialogMenu"></div>`);

	jQuery('#dialogMenu').empty();

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
		jQuery('#form').remove();

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

		newOpinionBtn.html(`<img class="btn-icon" src="/opinion_white.png">New-Opinion`);
		newOpinionBtn.on('click touch', function(event) {
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
		event.stopImmediatePropagation();
		event.preventDefault();
		if (isMobile) {
			console.log("mobile behavior!")
			hideMenu();
		}

	});

	jQuery(".iconBar").remove();
	requestHome();
	/* requestSearch(); */
	if (dptMode == 'topicScene') {
		requestNewTopic();
	}
	if (dptMode == 'opinionScene') {
		requestNewOpinion();
	}
	requestYourDialogs();
	requestFeedback();
	requestHelp();
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
	}
}
/*
function requestSearch() {
	var btn = document.createElement("input");
	btn.className = "iconBar";
	btn.style.zIndex = 10;
	btn.style.position = "absolute";
	btn.style.bottom = "5px";
	btn.style.right = "250px";
	btn.width = "50";
	btn.height = "50";
	btn.type = "image";
	btn.src = "/search.png";
	btn.style.color = "#f00";
	document.body.appendChild(btn);
	btn.onclick = ()=> {
		alert('search btn pressed!');
	}
} */

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
		// alert('test')
		if (myDialogsVisible == 'visible') {
			myDialogsVisible = 'hidden';
		} else {
			myDialogsVisible = 'visible';
		}
		jQuery('#dialogMenu').css({ visibility: myDialogsVisible });
		event.stopImmediatePropagation();
		event.preventDefault();
		/* if (isMobile) {
			console.log("mobile behavior!")
			hideMenu();
		} */

	}
}

function requestFeedback() {
	var btn = document.createElement("input");
	btn.className = "iconBar";
	//			btn.innerText = "Enable/Disable Joystick";
	btn.style.zIndex = 10;
	btn.style.position = "absolute";
	btn.style.bottom = "10px";
	btn.style.right = "5px";
	btn.width = "50";
	btn.height = "50";
	btn.type = "image";
	btn.src = "/survey_white.png";
	btn.style.color = "#f00";
	document.body.appendChild(btn);

	// Button toggle logic
	btn.onclick = () => {
			jQuery('body').append(`
			<div id="form" style="min-width: 40%; height: 80%;">
				 <iframe id="feedbackIframe" style="width: 100%; height: 100%;" src="https://simple-feedback.dpt.world/"></iframe> 
			</div>
		`);
			window.addEventListener('message', event => {
				// IMPORTANT: check the origin of the data! 
				if (event.origin.startsWith('https://simple-feedback.dpt.world') &&
					event.data == 'simple-feedback-finished') {
					jQuery('#feedbackIframe').remove();
					jQuery('#form').remove();
				} else {
					return;
				}
			});
		}
		/*
	btn.onclick = () => {
		jQuery.ajax({ 
			url: 'http://192.168.23.101:8011',
			type: 'GET',
			cache: false, 
			success: function(data){
				jQuery('body').append(`
						<div id="propositionForm">
						${data}
						</div>
					`);
			},
			error: function(jqXHR, status, err) {
				alert('text status '+status+', err '+err);
			},
		});
	}
	*/
};


function requestHelp() {
	var btnH = document.createElement("input");
	btnH.className = "iconBar";
	//			btn.innerText = "Enable/Disable Joystick";
	btnH.style.zIndex = 10;
	btnH.style.position = "absolute";
	btnH.style.bottom = "10px";
	btnH.style.right = "50px";
	btnH.width = "50";
	btnH.height = "50";
	btnH.type = "image";
	btnH.src = "/help_white.png";
	btnH.style.color = "#f00";
	document.body.appendChild(btnH);

	// Button toggle logic
	btnH.onclick = () => {
		jQuery('body').append(`
			<div id="form" class="helpframe">
			<img src="/dpt_gestures.png" alt="help" class="helpimage">
			<button class="button" id="close-btn">close</button>
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

		jQuery(document).one('click', "#close-btn", function(event) {
			jQuery('#form').remove();
			focusAtCanvas();
			event.preventDefault();
		});
	}


};


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
	text = text.replace(` [${oldCount}]`, '');
	jQuery(this).children("h2").text(text);
	text = jQuery("span#dialog-btn-label").text();

	if((count - oldCount) > 0) {
		text = text.replace(` [${count}]`, ' ['+(count - oldCount)+']');
		jQuery("span#dialog-btn-label").text(text);
		jQuery("span#dialog-btn-label").attr('count', (count - oldCount));
	} else {
		text = text.replace(` [${count}]`, '');
		jQuery("span#dialog-btn-label").text(text);
		jQuery("span#dialog-btn-label").attr('count', 0);
	}

	currentDialog = myDialogMenu[event.currentTarget.id];
	dpt.getDialog(currentDialog.dialog);
	event.stopImmediatePropagation();
	event.preventDefault();
});

//mobile version menu details