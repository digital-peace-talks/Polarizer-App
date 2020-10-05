	/**
	 * Generates a slider that answers a numeric question
	 * @param {string} question Question for the current slider
	 * @returns {string}
	 */
	function sliderRowTemplate(question) {
    rating = currentDialog.ratings.filter(e => e.sender == whoami.user._id) || 0;
    console.log(rating);
   if(currentDialog.status != "ACTIVE"){
      var inputState = "disabled"}
    else{
    var inputState = ""}
		return `
			<div class="row">
				<div class="col">
					<div class="text-center">${question}</div>
					<div class="row">
						<div class="col col-1">
							<span class="mdi mdi-thumb-down"></span>
						</div>
						<div class="col justify-center">
							<input type="range" style="z-index:400" name="rating" min="-100" max="100" value="${rating[0].content}" class="slider" ${inputState} />
						</div>
						<div class="col col-1">
							<span class="mdi mdi-thumb-up"></span>
						</div>
					</div>
				</div>
			</div>
		`;
	}

function hideMenu() {
  var menuLeft = canvas.width;
  if (canvas.width > 640) {
    menuLeft = 228;
  }

  jQuery("nav ul").css("left", menuLeft);
  jQuery("a.hamburger").html('<img src="/button_menu.png">');
}

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

function goHome (event){
  isSearching = false;
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
}

function addHomeBtn (){
  if (!document.querySelector('#home-btn')){
    var homeBtn = `<li><button class="menu-btn-bar" id="home-btn" title="Back to topics"><img
      class="btn-bar-icon" src="/back_white.png"></button></li>`;
    jQuery('.actionmenu.menu li:first-child').before(homeBtn);

    //Reassign homeBtn to the dom element, and add to it an onclick event handler.
    homeBtn = jQuery('#home-btn');
    homeBtn.on('click touch', goHome);
  }
}

function requestSearch() {
	
	jQuery("#form").remove();
	formVisible = true;
	jQuery('body').append(`
		<div id="form">
		Search in Topics:
		<form class="searchForm">
		<input type="text" id="searchString" name="searchString" style="width:100%;">
		</form>
		<input class="closeButton" type="button" value="&#10005;" name="close" id="closeSettingsForm" >
		</div>
	`);
	jQuery("#searchString").focus();

	jQuery("#closeSettingsForm").on('click touch', function(event) {
		jQuery('#form').remove();
		formVisible = false;
		event.stopImmediatePropagation();
		event.preventDefault();
	});

	jQuery(document).on('submit', '.searchForm', function(event) {
		event.stopImmediatePropagation();
		event.preventDefault();
		var searchString = jQuery('input#searchString').val();
		if(currentScene.name == "opinionScene") {
			opinionCamState = currentScene.cameras[0].storeState();
			currentScene.dispose();
			currentScene = __topicScene("topicScene");
			currentScene.name = "topicScene";
		}
		dpt.searchTopicsAndOpinions(searchString);
		jQuery('#form').remove();
    if (!document.querySelector("#home-btn")){
      addHomeBtn();
    }
		formVisible = false;
	});
	jQuery(document).on('keydown', '#searchString', function(event) {
		if (event.keyCode == 27) {
			jQuery('#form').remove();
			focusAtCanvas();
			event.preventDefault();
		}
	});
} 

function requestSetup() {
	
	jQuery("#form").remove();
	formVisible = true;
	jQuery('body').append(`
		<div id="form" class="setupForm">
		Setup
		<input class="closeButton" type="button" value="&#10005;" name="close" id="closeSetupForm" >
		</div>
	`);

	jQuery("#closeSetupForm").on('click touch', function(event) {
		jQuery('#form').remove();
		formVisible = false;
		event.stopImmediatePropagation();
		event.preventDefault();
	});

	jQuery(document).on('keydown', function(event) {
		if (event.keyCode == 27) {
			jQuery('#form').remove();
			focusAtCanvas();
			event.preventDefault();
		}
	});
} 





