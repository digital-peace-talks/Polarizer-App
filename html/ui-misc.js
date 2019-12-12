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





