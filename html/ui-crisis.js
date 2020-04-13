
function crisisForm(messageId) {

	var message = '';

	for (var i = 0; i < currentDialog.messages.length; i++) {
		if (currentDialog.messages[i].messageId == messageId) {
			message = currentDialog.messages[i].content;
			break;
		}
	}


	jQuery('#misc2').text('');
	jQuery('#misc2').append(`
		<div id="crisis">
			<h1>Finishing this dialog</h1>
			<p>
				After ending this dialog it will be open to everyone in the topic: "${currentDialog.topic}"
			</p>
			<form id="crisis">
				${sliderRowTemplate("How well did we explore our own perspectives?")}
				${sliderRowTemplate("How well did we explore other perspectives?")}
				${sliderRowTemplate("How well did we back our claims?")}
				<div class="reason">
					<div>Please enter a reason for your rating:</div>
					<input type="text" name="reason">
				</div>	
				<input type="submit" class="buttonCrisisSend" name="send" value="Yes, I want to finish this dialog">
				<input type="button" class="closeButton" value="&#10005;" name="close window" id="crisisCloseWindow">
			</form>
		</div>
	`);

	jQuery(".crisis").focus();

	function mapRange(num, in_min, in_max, out_min, out_max) {
		return ((num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
	}

	jQuery("#crisis").submit(function (event) {
		event.stopImmediatePropagation();
		event.preventDefault();
		var reason = jQuery('input[name="reason"]').val();
		if (reason.length > 0) {
			dpt.postCrisis(
				reason,
				//				jQuery("input[name='rating']:checked").val(),
				mapRange(jQuery("input[name='rating2']").val(), 1, 180, -1, 1),
				currentDialog.dialog,
				messageId,
				whoami.dptUUID);
			jQuery('#misc2').empty();
			jQuery('form#dialogFrame').html(`
			<br>
			<input type="button" class="buttondialogclose" value="&#10005;" name="close window" id="dialogClose">
			`);
		} else {
			alert('Please enter a conclusion.');
		}
	});

	jQuery(document).on('click', "#crisisCloseWindow", function (event) {
		dialogFormOpen = 0;
		jQuery('#misc2').empty();
		event.preventDefault();
	});

	jQuery(document).on('keyup', '#dialogInput', function (event) {
		if (event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)) {
			event.stopImmediatePropagation();
			event.preventDefault();
			jQuery('form#crisis').submit();
		}
	});

	/**
	 * Generates a slider that answers a numeric question
	 * @param {string} question Question for the current slider
	 * @returns {string}
	 */
	function sliderRowTemplate(question) {
		return `
			<div class="row">
				<div class="col">
					<div class="text-center">${question}</div>
					<div class="row">
						<div class="col col-1">
							<span class="mdi mdi-thumb-down"></span>
						</div>
						<div class="col justify-center">
							<input type="range" style="z-index:400" name="rating2" min="1" max="180" value="100" class="slider" id="range-slider" />
						</div>
						<div class="col col-1">
							<span class="mdi mdi-thumb-up"></span>
						</div>
					</div>
				</div>
			</div>
		`;
	}
}
