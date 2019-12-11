var canvas = document.getElementById("renderCanvas");
var engine;
var advancedTexture;
var currentScene;
var __topicScene;
var __opinionScene;
var topicCamState;
var opinionCamState;

var hamburgerOpen = false;

var isMobile = false; //initiate as false

var myDialogMenu = [];
var currentDialog;

var myDialogsVisible = 'hidden';
var formVisible = false;

var currentTopic;
var currentTopicStr;

var dpt;
var whoami;
var idleSince = 100000;

var powerSave = false;
var touchScreen = false;
var dialogFormOpen = 0;

var DPTGlobal = {
	"COLORS_default": 0,
	"COLORS_dark": 1,
	"COLORS_bright": 2,
	"COLORS_skybox": 3,
};

// Script Guided Tour
function startGuidedTour() {

	jQuery('#animCircle').css('visibility', 'visible');
	const guidePosition = [{
		// welcome to tour
		top: "auto",
		left: "0px",
		bottom: "50px",
		right: "auto",
		topMark: document.getElementById('guideNextBtn').getBoundingClientRect().top + "px",
		leftMark: document.getElementById('guideNextBtn').getBoundingClientRect().left + "px",
		buttonLeftName: "",
		buttonRightName: "start tour",
		guideText: "A new way to discuss",
	}, {
		// tutorial mobile
		top: "auto",
		left: "0px",
		bottom: "0px",
		right: "auto",
		topMark: "30%",
		leftMark: "50%",
		buttonLeftName: "back",
		buttonRightName: "next",
		guideText: "How to navigate",
	}, {
		// tutorial desktop
		top: "auto",
		left: "0px",
		bottom: "0px",
		right: "auto",
		topMark: "40%",
		leftMark: "50%",
		buttonLeftName: "back",
		buttonRightName: "next",
		guideText: "How to navigate",
	}, {
		// Choose a topic 
		top: "0px",
		left: "0px",
		bottom: "auto",
		right: "auto",
		topMark: document.getElementById('new-topic-btn').getBoundingClientRect().top + "px",
		leftMark: document.getElementById('new-topic-btn').getBoundingClientRect().left + "px",
		buttonLeftName: "back",
		buttonRightName: "next",
		guideText: "Choose a topic"
	}, {
		// start opinion
		top: "30%",
		left: "0px",
		bottom: "auto",
		right: "auto",
		buttonLeftName: "back",
		buttonRightName: "next",
		guideText: "Publish your opinion"
	}, {
		// open list
		top: "0px",
		left: "0px",
		bottom: "auto",
		right: "auto",
		topMark: "55%",
		leftMark: "50%",
		//topMark: document.getElementById('new-opinion-btn').getBoundingClientRect().top + "px",
		//leftMark: document.getElementById('new-opinion-btn').getBoundingClientRect().left + "px",
		topMark: "40%",
		leftMark: "50%",
		buttonLeftName: "back",
		buttonRightName: "next",
		guideText: "Start a dialogue"
	}, {
		// start with opinion/topic
		top: "30%",
		left: "0px",
		bottom: "auto",
		right: "auto",
		topMark: document.getElementById('dialogues-btn').getBoundingClientRect().top + "px",
		leftMark: document.getElementById('dialogues-btn').getBoundingClientRect().left + "px",
		buttonLeftName: "back",
		buttonRightName: "next",
		guideText: "Dialoguelist",
	}, {
		// exit the guided tour
		top: "30%",
		left: "0px",
		bottom: "auto",
		right: "auto",
		topMark: "-200px",
		leftMark: "-200px",
		buttonLeftName: "back",
		buttonRightName: "that's it",
		guideText: "Stop the guided tour",
	}];
	const bodyTextEle = document.getElementById('guideBodyText');
	const contentEle = document.getElementById('guideContent');
	const contentEle2 = document.getElementById('animCircle');
	const stepLiEle = document.getElementsByClassName('dot');
	const buttonLeft = document.getElementById('guidePrevBtn');
	const buttonRight = document.getElementById('guideNextBtn');
	const guideTitle = document.getElementById('guideTitle');
	
	let currentStepIndex = -1;
	const stepLength = guidePosition.length;
	changeStep();
	document.getElementById("guideNextBtn").addEventListener('click', () => {
		changeStep('next');

	}, false);
	document.getElementById("guidePrevBtn").addEventListener('click', () => {
		changeStep('prev');
	}, false);
	document.getElementById('closeBtn').addEventListener('click', () => {
		// schliessen aktion
		jQuery("#tutorialBorder").css("display","none");
		document.getElementById("guideContent").remove();
		document.getElementById("animCircle").remove();
	}, false);
	
	jQuery("#disableGuidedTour").change(function() {
	    if(this.checked) {
			whoami.user.preferences.guidedTour = false;
	    	dpt.userUpdate(whoami.dptUUID, { preferences: { "guidedTour": false}});
	    } else {
	    	whoami.user.preferences.guidedTour = true;
	    	dpt.userUpdate(whoami.dptUUID, { preferences: { "guidedTour": true}});
	    }
	});

	function changeStep(direction) {

		if ((direction === 'prev' && currentStepIndex === 0) || (direction === 'next' && currentStepIndex === stepLength - 1)) {
			this.remove();
		} else {
			let eraseDotIndex;
			if (direction === 'prev') {
				currentStepIndex = currentStepIndex - 1;
				eraseDotIndex = currentStepIndex === stepLength - 1 ? 0 : currentStepIndex + 1;

			} else {
				currentStepIndex = currentStepIndex + 1;
				eraseDotIndex = currentStepIndex === 0 ? stepLength - 1 : currentStepIndex - 1;
			}
			bodyTextEle.style.marginLeft = `${-360 * currentStepIndex}px`; // margin-left 
			// bodyTextEle.style.left = `${-360*currentStepIndex}px`; // relative+left 
			//stepLiEle[eraseDotIndex].setAttribute('data-step', ''); // erase number
			//stepLiEle[currentStepIndex].setAttribute('data-step', currentStepIndex + 1); // add number
			stepLiEle[eraseDotIndex].classList.remove('active'); // remove dot active
			stepLiEle[currentStepIndex].classList.add('active');    // add dot active

			contentEle.style.top = guidePosition[currentStepIndex].top;
			contentEle.style.left = guidePosition[currentStepIndex].left;
			contentEle.style.bottom = guidePosition[currentStepIndex].bottom;
			contentEle.style.right = guidePosition[currentStepIndex].right;

			contentEle2.style.top = guidePosition[currentStepIndex].topMark;
			contentEle2.style.left = guidePosition[currentStepIndex].leftMark;
			buttonLeft.innerText = guidePosition[currentStepIndex].buttonLeftName;
			buttonRight.innerText = guidePosition[currentStepIndex].buttonRightName;
			guideTitle.innerText = guidePosition[currentStepIndex].guideText;
	

			console.log(currentStepIndex);

			if (currentStepIndex == 3) {
				jQuery("#tutorialBorder").css("display","block");
			} else {
				jQuery("#tutorialBorder").css("display","none");
			}
		}
	}

} // End Script Guided Tour


// from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
function copyToClipboard(str) {
	const el = document.createElement('textarea');  // Create a <textarea> element
	el.value = str;                                 // Set its value to the string that you want copied
	el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
	el.style.position = 'absolute';
	el.style.left = '-9999px';                      // Move outside the screen to make it invisible
	document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
	const selected =
		document.getSelection().rangeCount > 0      // Check if there is any content selected previously
			? document.getSelection().getRangeAt(0)     // Store selection if found
			: false;                                    // Mark as false to know no selection existed before
	el.select();                                    // Select the <textarea> content
	document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
	document.body.removeChild(el);                  // Remove the <textarea> element
	if (selected) {                                 // If a selection existed before copying
		document.getSelection().removeAllRanges();  // Unselect everything on the HTML document
		document.getSelection().addRange(selected); // Restore the original selection
	}
}

function focusAtCanvas() {
	idleSince = BABYLON.Tools.Now;
	powerSave = false;
	document.getElementById('renderCanvas').focus();
}

function onWebSocketUpdate(restObj) {

	idleSince = BABYLON.Tools.Now;
	powerSave = false;

	if(restObj.method == 'post') {

		if(restObj.path == '/info/') {
			jQuery('#messages')
				.append(jQuery('<li>')
				.text(restObj.data.message));

			window.scrollTo(0, document.body.scrollHeight);
		}
	} else if(restObj.method == 'get') {

		if(restObj.path == '/topic/') {
			if(currentScene.name == 'topicScene') {
				dpt.getTopic();
			}
		}
	
		if(restObj.path == '/dialog/list/') {
			dpt.getDialogList();
		}
	
		if(restObj.path.startsWith('/opinion/')
		&& restObj.data.id == currentTopic
		&& currentScene.name == 'opinionScene') {
			dpt.getOpinionByTopic(currentTopic);
		}
	
		if(currentDialog
		&& restObj.path == '/dialog/' + currentDialog.dialog + '/') {
			if(dialogFormOpen == 1) {
				dpt.getDialog(currentDialog.dialog);
			}
			dpt.getDialogList();
		} else if(restObj.path.match('^/dialog/([0-9a-fA-F]{24})/$')) {
			dpt.getDialogList();
		}
	}
	
}

function onWebSocketAPI(restObj) {
	if(!restObj) {
		return;
	}
	if('status' in restObj && restObj.status > 399) {
		alert(restObj.data);
		return;
	}
	if(!restObj.path || !restObj.method) {
		return;
	}

	idleSince = BABYLON.Tools.Now;
	powerSave = false;

	if(restObj.method == 'get') {
		if(currentDialog && restObj.path == '/dialog/' + currentDialog.dialog + '/') {
	
			var old = currentDialog;
			currentDialog = restObj.data[0];
			currentDialog.topic = old.topic;
			currentDialog.initiatorOpinion = old.initiatorOpinion;
			currentDialog.recipientOpinion = old.recipientOpinion;
			dialogForm();
	
		}
		if(currentDialog && restObj.path == '/dialogSet/' + currentDialog.dialog + '/') {
	
			if(Array.isArray(restObj.data)) {
				var old;
				for(var i in currentScene.meshes) {
					if('dpt' in currentScene.meshes[i]
					&& currentScene.meshes[i].dpt.context == 'tubeConnection'
					&& currentScene.meshes[i].dpt.dialogId == restObj.data[0].dialog) {
						old = currentScene.meshes[i].dpt;
						old.topic = currentDialog.topic;
					}
				}
				currentDialog = restObj.data[0];
				currentDialog.topic = old.topic;
				currentDialog.initiatorOpinion = old.initiatorsOpinion;
				currentDialog.recipientOpinion = old.recipientsOpinion;
			}
	
			dialogForm(restObj.data[1]);
		}
		if(restObj.path == '/topic/') {
			if(currentScene.name == 'topicScene') {
				loadTopics(restObj);
			}
		} else if(restObj.path.startsWith('/metadata/search/')) {
			searchResultTopics(restObj);
		} else if(restObj.path == "/opinion/" + currentTopic + "/") {
			if(currentScene.name == 'opinionScene') {
				loadOpinions(restObj);
			}
		} else if(restObj.path == '/opinion/postAllowed/') {
			if(restObj.data.value == true) {
				opinionForm();
			} else {
				alert('Only one opinion per topic.');
			}
		} else if(restObj.path == '/dialog/list/') {
			loadDialogList(restObj);
		}	
	} else if(restObj.method == 'post') {
		if(restObj.path == '/dialog/') {
			dpt.getOpinionByTopic(currentTopic);
		}	
	}
}

function setHtmlScheme() {
	var htmlScheme = '';
	switch(whoami.user.preferences.htmlScheme) {
		case 1:
			htmlScheme = "dpt_bright.css";
			break;
		case 2:
			htmlScheme = "dpt_dark.css";
			break;
		case 3:
			htmlScheme = "dpt_linden.css";
			break;
		case 4:
			htmlScheme = "dpt_love.css";
			break;
		case 5:
			htmlScheme = "dpt_mc.css";
			break;
		case 0:
		default:
			htmlScheme = "dpt_classic.css";
			break;
	}
	//document.getElementById('theme_css').href = htmlScheme;
	setTimeout(function() {
		document.getElementById('theme_css').href = htmlScheme;
	}, 300);
}

function main() {

	document.addEventListener("DOMContentLoaded", function(event) {
		if('ontouchstart' in window
		|| window.DocumentTouch && document instanceof window.DocumentTouch
		|| navigator.maxTouchPoints > 0
		|| window.navigator.msMaxTouchPoints) {
			touchScreen = true;
		}

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
			developer: false
		};

		__topicScene = createGenericScene;
		__topicScene.name = 'topicScene';
		__opinionScene = createGenericScene;
		__opinionScene.name = 'opinionScene';

		// Handle the incomming websocket trafic
		socket.on("connect", () => {

			// if needed, we could keep socket.id somewhere
			console.log('we are: '+socket.id);
			if(document.cookie) {
				dpt.userLogin(document.cookie);
			} else {
				alert('document cookie not set');
			}

		});

		socket.on("3d", function(update) {
			if(update.event == 'connect'
			&& update.avatar != socket.id) {
				createAvatar(update, false);
			} else if(update.event == 'disconnect') {
				disposeAvatar(update);
			} else if(update.event == 'update') {
				updateAvatar(update);
			}
			console.log(update);
		});

		socket.on("private", function(restObj) {
			if(restObj.method == "post") {
				if(restObj.path == "/user/login/") {
					whoami.dptUUID = restObj.data.dptUUID;
					whoami.developer = restObj.data.developer;
					if(restObj.data.message == "logged in") {

						whoami.user = restObj.data.user;
						setHtmlScheme();

						currentScene = createGenericScene("topicScene");
						currentScene.name = 'topicScene';
						dpt.getTopic();
						dpt.getDialogList();

						if(whoami.user.preferences.guidedTour) {
							startGuidedTour();
						} else {
							jQuery('.tutorialBorder').remove();
							jQuery('.animated-circle').remove();
							jQuery('.fb_gd_wrap').remove();
						}
								
					} else if(restObj.data.message == "user unknown") {
						alert(`User unknown.
							Please go back to the start page,
							delete your cookie. You can try to get your
							phrase recovered or get a new phrase.

							maybe cookies are disable?`);
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
			onWebSocketUpdate(restObj);
		});

		socket.on("api", function(restObj) {
			onWebSocketAPI(restObj);
		});

		/*
		jQuery('body').append(`<div id="debug" style="position: absolute;
			color: white; height: 80px; width: 390px; right: 390px; z-index:999; bottom: 80px"></div>
		`);
		*/
		
		startBabylonEngine();
		
		// Resize
		window.addEventListener("resize", function() {
			idleSince = BABYLON.Tools.Now;
			powerSave = false;
			engine.resize();
		});
	});

	jQuery(window).blur(function() {
		idleSince = BABYLON.Tools.Now;
		powerSave = true;
	});
	
	jQuery(window).focus(function() {
		focusAtCanvas();
		idleSince = BABYLON.Tools.Now;
		powerSave = false;
	});
	

}

main();