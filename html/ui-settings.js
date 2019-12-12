
function settingsForm(opinionId, topicId) {

	console.log('settings/preferences');

	var theme = 0;
	var colors = "Color scheme:<br>";
	var stealthMode = 'checked';
	var guidedTour = 'checked';
	
	if(whoami.user.preferences.guidedTour) {
		guidedTour = '';
	}
	if(!whoami.user.preferences.stealthMode) {
		stealthMode = '';
	}
	for(var i = 0; i <= 3; i++) {
		if(whoami.user.preferences.colorScheme == i) {
			colors += `<label><input type="radio" name="colorScheme" value="${i}" checked>`;
		} else {
			colors += `<label><input type="radio" name="colorScheme" value="${i}">`;
		}
		switch(i) {
			case DPTGlobal.COLORS_bright:
				colors += " Bright</label>";
				break
			case DPTGlobal.COLORS_dark:
				colors += " Dark</label>";
				break
			case DPTGlobal.COLORS_skybox:
				colors += " Skybox</label>";
				break
			case DPTGlobal.COLORS_default:
			default:
				colors += " Default</label>";
				break
		}
		colors += "<br>";
	}
	
	jQuery('body').append(`
		<div id="form" class="helpframe"><h1>Settings:</h1>
		<hr>
		Your passphrase:
		<br>
		${whoami.user.phrase}
		<input type="image" class="copyToClip" src="/copytoclipboard_dark.png" onClick="copyToClipboard('${whoami.user.phrase}');"/>
		<br>
		<hr>
		<b>Change UI-Theme:</b>
		<div style="display: flex; flex-direction: row-reverse;">
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
		<form id="settings" class="settingsForm">
		${colors}
		<hr>
		Do you like to be visible to other Users? Then uncheck the checkbox.
		<br>
		Stealth-Mode: <input type="checkbox" name="stealthMode" ${stealthMode}>
		<br>
		<hr>
		Check the checkbox to disable the guided tour on each session.
		<br>
		<label><input type="checkbox" name="guidedTour" ${guidedTour}>Disable the guided tour</label>
		<br>
		<input class="button" type="submit" value="Apply">
		<input class="closeButton" type="button" value="&#10005;" name="close" id="closeSettingsForm">
		</form>
		</div>
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
		jQuery('#form').remove();
		formVisible = false;
		event.preventDefault();
	});
	
	jQuery(document).on('submit', 'form#settings', function(event) {
		
		event.stopImmediatePropagation();
		event.preventDefault();

		whoami.user.preferences.colorScheme = jQuery('input[name=colorScheme]:checked').val() * 1;
		whoami.user.preferences.htmlScheme = theme;

		if(jQuery('input[name=stealthMode]:checked').val() == 'on') {
			whoami.user.preferences.stealthMode = true;
		} else {
			whoami.user.preferences.stealthMode = false;
		}

		if(jQuery('input[name=guidedTour]:checked').val() == 'on') {
			whoami.user.preferences.guidedTour = false;
		} else {
			whoami.user.preferences.guidedTour = true;
		}

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
		formVisible = false;
		
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
