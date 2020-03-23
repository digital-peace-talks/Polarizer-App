function hideMenu() {
	var menuLeft = canvas.width;
	if (canvas.width > 640) {
		menuLeft = 228;
	}

	jQuery("nav ul").css("left", menuLeft);
	jQuery("a.hamburger").html('<img src="/button_menu.png">');
}

function switchToTopics() {
	opinionCamState = currentScene.cameras[0].storeState();
	currentScene.dispose();
	currentScene = __topicScene("topicScene");
	currentScene.name = "topicScene";
	dpt.getTopic();

	jQuery('#form').remove();
	formVisible = false;
	if (isMobile) {
		console.log("mobile behavior!")
		hideMenu();
	}
	focusAtCanvas();
}

// GUI Menubar Buttons
var createGUIScene = function (dptMode) {

	if (whoami.developer == true) {
		jQuery(".actionmenu").append(
			`<li><button class="menu-btn-bar" id="setup-btn" title="Setup">
			<img class="btn-bar-icon" src="/setup_white.png"></button></li>`);
		jQuery(".menu-btn-bar").css('width', '20%');
		jQuery(document).on('click touch', "#setup-btn", function (event) {
			event.stopImmediatePropagation();
			event.preventDefault();

			if (formVisible && jQuery('#form').hasClass('setupForm')) {
				//if(formVisible && jQuery('#form>form').hasClass('setupForm')) {
				jQuery("#form").remove();
				formVisible = false;
			} else {
				hideDialogList();
				requestSetup();
			}
		});
	}

	// is the device a 'mobile'?
	if (canvas.width < 640
		&& (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
			|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))) {
		isMobile = true;
	}

	//create about button
	var aboutBtn = jQuery('#about-btn');
	aboutBtn.show();

	aboutBtn.on('click touch', function (event) {

		event.stopImmediatePropagation();
		event.preventDefault();

		if (isMobile) {
			closeRightMenu();
		}
		if (formVisible && jQuery('#form').hasClass('aboutForm') && !isMobile) {
			jQuery('#form').remove();
			formVisible = false;
		} else {
			jQuery('#form').remove();
			formVisible = true;

			hideDialogList();

			jQuery('body').append(`
				<div id="form" class="helpframe aboutForm">
				<h1>About</h1>
				<hr>
				<p>This is a free and open web app to allow for exchange of conflicting opinions.</p>
				Website: <a href="http://www.digitalpeacetalks.com" target="_blank">digitalpeacetalks.com</a>
				<br>
				Software: <a href="https://github.com/digital-peace-talks/DPT" target="_blank">github.com/digital-peace-talks/DPT</a>
				<button class="closeButton" id="close-btn">&#10005;</button>
				</div>
			`);
			jQuery(document).on('click touch', "#close-btn", function (event) {
				hideDialogList();
				jQuery('#form').remove();
				formVisible = false;
				focusAtCanvas();
				event.preventDefault();
			});
		}

	});

	function closeRightMenu() {
		var menuLeft = canvas.width;
		if (canvas.width > 640) {
			menuLeft = 228;
		}

		hamburgerOpen = !hamburgerOpen;
		if (hamburgerOpen) {
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
	fsBtn.on('click touch', function (event) {

		event.stopImmediatePropagation();
		event.preventDefault();

		if (formVisible && jQuery('#form').hasClass('firststepsForm')) {
			jQuery('#form').remove();
			formVisible = false;
		} else {

			jQuery('#form').remove();
			formVisible = true;

			if (isMobile) {
				closeRightMenu();
			}
			hideDialogList();

			jQuery('body').append(`
				<div id="form" class="helpframe firststepsForm">
				<h1>Help</h1>
				<hr>
				<p>Need a hand? Let us show you the basic features.</p>
				<input class="tourBtn" type="button" value="Start tour" id="tourBtn">
				<p>Need something specific? Take a look at the full documentation.</p>
				<form action="https://proto1.dpt.world/dpt-doku.html" target="_blank">
    			<input type="submit" value="Documentation"/>
				</form>
				<button class="closeButton" id="close-btn">&#10005;</button>
				</div>
			`);


			jQuery(document).on('click touch', "#close-btn", function (event) {
				hideDialogList();
				jQuery('#form').remove();
				formVisible = false;
				focusAtCanvas();
				event.preventDefault();
			});
			document.getElementById('tourBtn').addEventListener('click', () => {
				// tour öffnen aktion
				console.log("klick");
				//document.getElementById("guideContent").css("display","block");
				whoami.user.preferences.guidedTour = true;
				dpt.userUpdate(whoami.dptUUID, { preferences: { "guidedTour": true } });
				location.reload();

			}, false);
		}
	});

	//create documentation button
	var docuBtn = jQuery('#documentation-btn');
	docuBtn.show();
	docuBtn.on('click touch', function (event) {

		if (isMobile) {
			closeRightMenu();
		}

		hideDialogList();
		window.open("dpt-doku.html");
		event.preventDefault();
	});

	//create survey button
	var surveyBtn = jQuery('#survey-btn');
	surveyBtn.show();

	surveyBtn.on('click touch', function (event) {
		event.preventDefault();

		if (isMobile) {
			closeRightMenu();
		}

		if (formVisible && jQuery('#form').hasClass('surveyForm')) {
			jQuery('#form').remove();
			formVisible = false;
		} else {
			jQuery('#form').remove();
			formVisible = true;

			hideDialogList();

			jQuery('body').append(`
				<div id="form" class="surveyForm" style="height: 90%;">
				<h1>Contact</h1>
				<p>We would love to hear your thoughts and ideas for improvement.</p>
				Feel free to write them to: <br>
				 <a href= "mailto:feedback@digitalpeacetalks.com"><img src="email.png" alt="email" height="auto" width="80%"></a>
				<br>
				or into this form:
				 <iframe id="feedbackIframe" style="width: 100%; height: 105%;"scrolling="no" src="https://simple-feedback.dpt.world/"></iframe> 
				 <button class="closeButton" id="close-btn">&#10005;</button>
				 </div>
			`);

			jQuery(document).on('click touch', "#close-btn", function (event) {
				hideDialogList();
				jQuery('#form').remove();
				formVisible = false;
				focusAtCanvas();
				event.preventDefault();
			});
			window.addEventListener('message', event => {
				// IMPORTANT: check the origin of the data! 
				formVisible = 'hidden';
				if (event.origin.startsWith('https://simple-feedback.dpt.world')
					&& event.data == 'simple-feedback-finished') {
					jQuery('#feedbackIframe').remove();
					jQuery('#form').remove();
					formVisible = false;
				} else {
					return;
				}
			});

			focusAtCanvas();
		}
	});

	//create github repository button
	var docuBtn = jQuery('#github-btn');
	docuBtn.show();
	docuBtn.on('click touch', function (event) {

		event.stopImmediatePropagation();
		event.preventDefault();

		if (isMobile) {
			closeRightMenu();
		}
		hideDialogList();
		window.open("https://github.com/digital-peace-talks/DPT");
	});


	// create settings button
	var settingsBtn = jQuery('#settings-btn');
	settingsBtn.show();

	settingsBtn.on('click touch', function (event) {

		event.stopImmediatePropagation();
		event.preventDefault();

		if (isMobile) {
			closeRightMenu();
		}

		if (formVisible && jQuery('#form>form').hasClass('settingsForm')) {
			jQuery('#form').remove();
			formVisible = false;
		} else {
			jQuery('#form').remove();
			formVisible = true;

			hideDialogList();

			settingsForm();

		}

	});

	//create home button
	var homeBtn = jQuery('#home-btn');
	homeBtn.show();

	homeBtn.on('click touch', function (event) {

		if (isMobile) {
			closeRightMenu();
		}
		hideDialogList();

		if (formVisible) {
			jQuery('#form').remove();
			formVisible = false;
		}

		opinionCamState = currentScene.cameras[0].storeState();
		currentScene.dispose();
		currentScene = __topicScene("topicScene");
		currentScene.name = "topicScene";
		dpt.getTopic();
		event.stopImmediatePropagation();
		event.preventDefault();

		if (isMobile) {
			console.log("mobile behavior!")
			hideMenu();
		}
		focusAtCanvas();
	});

	//create search button
	var searchBtn = jQuery('#search-btn');
	searchBtn.show();

	searchBtn.on('click touch', function (event) {
		event.stopImmediatePropagation();
		event.preventDefault();

		if (formVisible && jQuery('#form>form').hasClass('searchForm')) {
			jQuery("#form").remove();
			formVisible = false;
		} else {
			hideDialogList();
			requestSearch();
		}
	});

	//create topic button 
	if (dptMode == 'topicScene') {

		jQuery('#form').remove();
		formVisible = false;

		jQuery('#new-opinion-btn').hide();
		
		
		var newTopicBtn = jQuery('#new-topic-btn');
		//TODO: wait fo Iwan response 
		var isAuthForNewTopics = false;
		
		if (! isAuthForNewTopics) {			
			var newTopicLi =  jQuery('#new-topic-li');
			newTopicLi.hide();			
		}
		if (isAuthForNewTopics) {
			newTopicBtn.show();

			newTopicBtn.html(`<img class="btn-bar-icon" src="/topic_white.png">`);

			newTopicBtn.on('click touch', function (event) {
				event.stopImmediatePropagation();
				event.preventDefault();

				if (formVisible && jQuery('#form>form').hasClass('topicForm')) {
					formVisible = false;
					jQuery('#form').remove();
				} else {
					hideDialogList();

					topicForm();

					if (isMobile) {
						console.log("mobile behavior!")
						hideMenu();
					}
				}

			});
		}

		//create opinion button 
	} else if (dptMode == 'opinionScene') {

		jQuery('#form').remove();
		formVisible = false;

		jQuery('#new-topic-btn').hide();
		var newOpinionBtn = jQuery('#new-opinion-btn');
		newOpinionBtn.show();

		newOpinionBtn.html(`<img class="btn-bar-icon" src="/opinion_white.png">`);
		newOpinionBtn.on('click touch', function (event) {

			event.stopImmediatePropagation();
			event.preventDefault();

			if (formVisible && jQuery('#form>form').hasClass('opinionForm')) {
				jQuery('#form').remove();
				formVisible = false;
			} else {
				hideDialogList();

				dpt.opinionPostAllowed(currentTopic);
				// alert(dpt.opinionPostAllowed(currentTopic)) <- returns undefined

				if (isMobile) {
					console.log("mobile behavior!")
					hideMenu();
				}
			}

		});
	}

	//create dialogue button
	var dialoguesBtn = jQuery('#dialogues-btn');
	dialoguesBtn.show();
	dialoguesBtn.on('click touch', function (event) {
		// alert('test')
		if (myDialogsVisible == 'hidden') {
			myDialogsVisible = 'visible';
		} else {
			myDialogsVisible = 'hidden';
		}

		jQuery('#dialogList').css({ visibility: myDialogsVisible });
		jQuery('#close-dialog-btn').css({
			WebkitTransition: 'opacity 0s ease-in-out',
			MozTransition: 'opacity 0s ease-in-out',
			MsTransition: 'opacity 0s ease-in-out',
			OTransition: 'opacity 0s ease-in-out',
			transition: 'opacity 0s ease-in-out'
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
