

function crisisForm(messageId) {

	var message = '';

	for(var i = 0; i < currentDialog.messages.length; i++) {
		if(currentDialog.messages[i].messageId == messageId) {
			message = currentDialog.messages[i].content;
			break;
		}
	}


	jQuery('#misc2').text('');
	jQuery('#misc2').append(`
			<div id="crisis">
				<u>End of discussion, appraisal of results.</u><br><br>
				Finish the dialog under Topic:<br><b>${currentDialog.topic}</b><br><br>
				Most impressive message:<br><b>${message}</b><br><br>
				Please enter the reason:<br>
				<form id="crisis">
			
					<input type="text" name="reason" size="50" class="reason"><br><br>
					
					<label id="negative">[-1: <input type="radio" name="rating" value="-1">]</label>
					<label id="neutral">[0: <input type="radio" name="rating" value="0" checked>]</label>
					<label id="positive">[1: <input type="radio" name="rating" value="1">]</label><br>
					<input type="submit" class="buttondialog" name="send" value="send">
					<input type="button" class="buttondialog" value="close window" name="close window" id="crisisCloseWindow">
				</form>
			</div>
		`);
		
		$(document).ready(function() {
			$('#range-slider').on('change', function() {
			  $('.smile').css('transform','rotateX('+ $(this).val() +'deg)');
			});
		  });


	jQuery(".crisis").focus();

	jQuery("#crisis").submit(function(event) {
		event.stopImmediatePropagation();
		event.preventDefault();
		var reason = jQuery('.reason').val();
		if(reason.length > 0) {
			dpt.postCrisis(reason, jQuery("input[name='rating']:checked").val(), currentDialog.dialog, messageId, whoami.dptUUID);
			jQuery('#misc2').empty();
			jQuery('form#dialogFrame').html(`
			<br>
			<input type="button" class="buttondialog" value="close window" name="close window" id="dialogClose">
			`);
		} else {
			alert('Please enter a conclusion.');
		}
	});

	jQuery(document).one('click', "#crisisCloseWindow", function(event) {
		dialogFormOpen = 0;
		jQuery('#misc2').empty();
		event.preventDefault();
	});

	jQuery(document).on('keyup', '#dialogInput', function(event) {
		if(event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)) {
			event.stopImmediatePropagation();
			event.preventDefault();
			jQuery('form#crisis').submit();
		}
	});
}

function setSelectionRange(input, selectionStart, selectionEnd) {
	if (input.setSelectionRange) {
		input.focus();
		input.setSelectionRange(selectionStart, selectionEnd);
	}
	else if (input.createTextRange) {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd('character', selectionEnd);
		range.moveStart('character', selectionStart);
		range.select();
	}
}

function setCaretToPos (input, pos) {
	setSelectionRange(input, pos, pos);
}

function dialogForm(secondDialog) {

	var headerMine;
	var headerOther;
	var dialog = '';
	var dialog2 = '';
	var otherReadyToEnd = false;
	var viewOnly = false;
	var me;
	var cursorPos= jQuery("textarea#dialogInput").prop('selectionStart');
	var dialogInput = jQuery("textarea#dialogInput").val();
	if(!dialogInput) {
		dialogInput='';
	}

	const maxMessages = currentDialog.extension * 25;

	if(dialogFormOpen) {
		jQuery("#dialogForm").remove();
	}

	dialogFormOpen = 1;

	if(currentDialog.initiator == 'me'
	|| currentDialog.recipient == 'notme2') {

		headerMine = currentDialog.initiatorOpinion + "<br>";
		headerOther = currentDialog.recipientOpinion + "<br>";
		headerMine += "<b>Proposition:</b>" + currentDialog.opinionProposition + "<br>";

	} else {

		headerMine = currentDialog.recipientOpinion + "<br>";
		headerOther = currentDialog.initiatorOpinion + "<br>";
		headerOther += "<b>Proposition:</b>" + currentDialog.opinionProposition + "<br>";
	}

	if(currentDialog.messages.length == 0) {
		dialog = '<i id="props">&nbsp;</i>';
	}

	for(var i = 0; i < currentDialog.crisises.length; i++) {

		if(currentDialog.status == 'CLOSED') {

			if(currentDialog.crisises[i].initiator == 'me'
			|| currentDialog.crisises[i].recipient == 'notme2') {
				headerMine += `Last statement: ${currentDialog.crisises[i].reason}<br>Rating: ${currentDialog.crisises[i].rating}`;
			} else if(currentDialog.crisises[i].initiator == 'notme') {
				headerOther += `Last statement: ${currentDialog.crisises[i].reason}<br>Rating: ${currentDialog.crisises[i].rating}`;
			}

		} else {
			if(currentDialog.crisises[i].initiator == 'me'
			|| currentDialog.crisises[i].recipient == 'notme2') {
				headerMine += '<h4>Ready to End</h4>';
				viewOnly = true;
			} else if(currentDialog.crisises[i].initiator == 'notme') {
				headerOther += '<h4>Ready to End</h4>';
				otherReadyToEnd = true;
			}
		}
	}

	var extensionRequest = '';
	if(currentDialog.status == 'ACTIVE') {
		// extensionRequest = `More messages: <input type="checkbox" name="extensionRequest" value="true" id="extensionRequest">`;
		for(var i = 0; i < currentDialog.extensionRequests.length; i++) {
			if(currentDialog.extensionRequests[i].sender == 'me') {
				// extensionRequest = `More messages: <input type="checkbox" name="extensionRequest" value="true" id="extensionRequest" checked>`;
			}
		}
	}

	for(var i = 0; i < currentDialog.messages.length; i++) {

		if(currentDialog.messages[i].sender == 'me'
		|| currentDialog.messages[i].sender == 'notme2') {
			dialog += '<p class="right">' + currentDialog.messages[i].content + '</p>';
		} else {
			var option = '';
			if(viewOnly == false) {
				option = ' <span class="crisis icon" id="' + currentDialog.messages[i].messageId + '">&#9878;</span>';
			}
			dialog += '<p class="left">' + currentDialog.messages[i].content + option + '</p>';
		}
	}
	
	if(secondDialog) {

		dialog2 = '<h3></h3>';

		var ratingMe = '';
		var ratingOther = '';

		for(var i = 0; i < secondDialog.crisises.length; i++) {

			if(secondDialog.crisises[i].initiator == 'me'
			|| secondDialog.crisises[i].recipient == 'notme2') {

				var propositionMine = '';
				if(secondDialog.initiator == 'me' || secondDialog.initiator == 'notme2') {
					propositionMine = `Proposion: ${secondDialog.headerProposition}<br>`;
				}
				ratingMe = `${propositionMine}Last statement: ${secondDialog.crisises[i].reason}<br>Rating: ${secondDialog.crisises[i].rating}`;

			} else if(secondDialog.crisises[i].initiator == 'notme') {

				var propositionOther = '';
				if(secondDialog.initiator == 'notme') {
					propositionOther = `Proposion: ${secondDialog.headerProposition}<br>`;
				}
				ratingOther = `${propositionOther}Last statement: ${secondDialog.crisises[i].reason}<br>Rating: ${secondDialog.crisises[i].rating}`;

			}
		}

		if(!currentDialog.thirdEye) {
			dialog2 += `<table width="100%"><tr>
				<td valign="top" style="font-size: 14px" width="45%"><center>${ratingOther}</center></td>
				<td style="font-size: 36px"><center>vs.</center></td>
				<td valign="top" width="45%" style="font-size: 14px"><center>${ratingMe}</center></td>
				</tr></table><br>`;
		} else {
			dialog2 += `<table width="100%"><tr>
				<td valign="top" style="font-size: 14px" width="45%"><center>${ratingMe}</center></td>
				<td style="font-size: 36px"><center>vs.</center></td>
				<td valign="top" width="45%" style="font-size: 14px"><center>${ratingOther}</center></td>
				</tr></table><br>`;
		}

		for(var i=0; i <  secondDialog.messages.length; i++) {

			if(!currentDialog.thirdEye) {
				if(secondDialog.messages[i].sender == 'me') {
					dialog2 += '<p class="right">' + secondDialog.messages[i].content + '</p>';
				} else {
					dialog2 += '<p class="left">' + secondDialog.messages[i].content + '</p>';
				}
			} else {
				if(secondDialog.messages[i].sender == 'me') {
					dialog2 += '<p class="left">' + secondDialog.messages[i].content + '</p>';
				} else {
					dialog2 += '<p class="right">' + secondDialog.messages[i].content + '</p>';
				}
			}
		}
	}

	var opinionLabel1 = "Others opinion";
	var opinionLabel2 = "Your opinion";
	if(currentDialog.thirdEye) {
		var opinionLabel1 = "Opinion A";
		var opinionLabel2 = "Opinion B";
	}

	var html = `
		<div id="dialogFrame">

			<div class="top">
				<center>
					<h3>${currentDialog.topic}</h3>
				</center>
				
			</div>
			<div class="middle">
				<div id="c2">
					<table width="100%">
						<tr>
							<td valign="top" style="font-size: 14px" width="45%"><center>
								<b>${opinionLabel1}:</b><br>${headerOther}<br>
							</center></td>
							<td style="font-size: 36px"><center>
								vs.
							</center></td>
							<td valign="top" width="45%" style="font-size: 14px"><center>
								<b>${opinionLabel2}:</b><br>${headerMine}<br>
							</center></td>
						</tr>
					</table>
					${dialog}
					${dialog2}
				</div>
			</div>
		</div>
	`;

	if(currentDialog.status == 'ACTIVE') {

		if(viewOnly) {

			var endDialog = '<input type="button" class="crisis" value="end dialog" name="end dialog" id="none">';
			for(var i in currentDialog.crisises) {
				if(currentDialog.crisises[i].initiator == 'me') {
					endDialog = '';
				}
			}
			html += `
				<div class="status">
				<center>
					<form id="dialogFrame">
					
						<input type="button" class="buttondialog" value="close window" name="close window" id="dialogClose">
						${endDialog}
					</form>
					<div id="c3">Messages: <b>${currentDialog.messages.length} of ${maxMessages}<br>${extensionRequest}</div>
				</center>
				</div>
			`;

		} else {

			if(otherReadyToEnd == false) {

				html += `
					<div class="status">
						<center>
							<form id="dialogFrame">
							<textarea class="dialog" type="text" name="message" id="dialogInput">${dialogInput}</textarea>
								<br>
								<input type="submit" class="buttondialog" name="send" value="send">
								<input type="button" class="buttondialog" value="close window" name="close window" id="dialogClose">
								<input type="button" class="crisis" value="end dialog" name="end dialog" id="none">
							</form>
							<div id="c3">Messages: <b>${currentDialog.messages.length} of ${maxMessages}<br>${extensionRequest}</div>
						
						</center>
					</div>
				`;

			} else {

				html += `
					<div class="status">
						<center>
							<form id="dialogFrame">
								<br>
								<input type="button" class="buttondialog" value="close window" name="close window" id="dialogClose">
								<input type="button" class="crisis" value="end dialog" name="end dialog" id="none">
							</form>
							<div id="c3">Messages: <b>${currentDialog.messages.length} of ${maxMessages}<br>${extensionRequest}</div>
						
						</center>
					</div>
				`;

			}
		}

		jQuery(document).one('click', "#dialogClose", function(event) {
			dialogFormOpen = 0;
			jQuery('#dialogForm').remove();
			focusAtCanvas();
		});

		jQuery(document).one('click', "#extensionRequest", function(event) {
			if(jQuery("#extensionRequest").is(':checked')) {
				dpt.extensionRequest(currentDialog.dialog, whoami.dptUUID);
			}
		});

	} else if(currentDialog.status == 'PENDING') {

		if(currentDialog.initiator == 'me') {

			html += `
					<div class="status">
						<center>
							Please wait for the other to accept the dialog.
							<input type="button" class="buttondialog" value="close window" name="close window" size="120" id="dialogClose">
						</center>
					</div>
			`;

			jQuery(document).one('click', "#dialogClose", function(event) {
				dialogFormOpen = 0;
				jQuery('#dialogForm').remove();
				focusAtCanvas();
			});

		} else {

			html += `
				<div class="status">
					<center id="actionSpace">
						<input type="button" class="buttondialog" id="dialogAccept" value="accept dialog" name="accept dialog" size="120" id="dialogAccept">
						<input type="button" class="buttondialog" value="ask me later" name="accept dialog" size="120" id="dialogClose">
						<input type="button" class="buttondialog" value="reject" name="accept dialog" size="120" id="dialogReject">
					</center>
				</div>
			`;

			jQuery(document).one('click', "#dialogAccept", function(event) {
				jQuery('center#actionSpace').html(`
					<div class="status">
						<center>
							<form id="dialogFrame">
							<textarea class="dialog" type="text" name="message" id="dialogInput">${dialogInput}</textarea>
								<br>
								<input type="submit" class="buttondialog" name="send" value="send">
								<input type="button" class="buttondialog" value="close window" name="close window" id="dialogClose">
								<input type="button" class="crisis" value="end dialog" name="end dialog" id="none">
							</form>
							<div id="c3">Messages: <b>${currentDialog.messages.length} of ${maxMessages}<br>${extensionRequest}</div>
						
						</center>
					</div>
				`);

				dpt.putDialog(currentDialog.dialog, currentTopic, "status", "ACTIVE");
				event.preventDefault();
			});

			jQuery(document).one('click', "#dialogClose", function(event) {
				dialogFormOpen = 0;
				jQuery('#dialogForm').remove();
				focusAtCanvas();
			});

			jQuery(document).one('click', "#dialogReject", function(event) {
				dialogFormOpen = 0;
				jQuery('#dialogForm').remove();
				focusAtCanvas();
				dpt.putDialog(currentDialog.dialog, currentTopic, "status", "CLOSED");
				event.preventDefault();
			});
		}

	} else if(currentDialog.status == 'CLOSED') {

		html += `
			<div class="status">
				<center>
					<input type="button" class="buttondialog" value="close window" name="close window" size="120" id="dialogCloseWindow">
					<b>This dialog is closed.</b>
				</center>
			</div>
		`;
		
		jQuery(document).one('click', "#dialogCloseWindow", function(event) {
			dialogFormOpen = 0;
			jQuery('#dialogForm').remove();
			event.preventDefault();
			event.stopImmediatePropagation();
			focusAtCanvas();
		});
	}

	html += '</div></div>';

	jQuery('body').append(`<div id="dialogForm">${html}</div>`);


	/*
	if(currentDialog.status == 'CLOSED') {
		for(var i = 0; i < currentDialog.crisises.length; i++) {
			if(currentDialog.crisises[i].initiator != 'me'
			|| currentDialog.crisises[i].recipient != 'notme2') {
				jQuery('td.dialogleft>center').append(`Last statement: ${currentDialog.crisises[i].reason}<br>Rating: ${currentDialog.crisises[i].rating}<br>`);
				break;
			} else {
				jQuery('td.dialogright>center').append(`Last statement: ${currentDialog.crisises[i].reason}<br>Rating: ${currentDialog.crisises[i].rating}<br>`);
			}
		}
	}
	*/

	jQuery(document).on('submit', '#dialogFrame', function(event) {

		event.stopImmediatePropagation();
		event.preventDefault();
		var message = this[0].value;
		jQuery("#dialogInput").val('');

		if(message.length > 0) {
			dpt.postMessage(message, whoami.dptUUID, currentDialog.dialog);
		}

		jQuery("#dialogInput").focus();
		var objDiv = document.getElementById("dialogForm");
		objDiv.scrollTop = objDiv.scrollHeight;
	});

	jQuery(document).on('click', '.crisis', function(event) {
		crisisForm(this.id);
		event.stopImmediatePropagation();
		event.preventDefault();
	});

	jQuery(document).on('keyup', '#dialogInput', function(event) {

		if(event.keyCode == 27) {
			dialogFormOpen = 0;
			jQuery('#dialogForm').remove();
			focusAtCanvas();
			event.preventDefault();
		}

		if(event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)
		||(event.keyCode == 10 || event.keyCode == 13)) {
			event.stopImmediatePropagation();
			event.preventDefault();
			var message = jQuery("#dialogInput").val();
			if(message.length > 1) {
				jQuery('form#dialogFrame').submit();
			} else {
				jQuery("#dialogInput").val('');
			}
		}
	});

	var objDiv = document.getElementById("dialogForm");
	objDiv.scrollTop = objDiv.scrollHeight;

	if(cursorPos) {
		setCaretToPos(document.getElementById('dialogInput'), cursorPos);
		jQuery("#dialogInput").focus();
	} else {
		jQuery("#dialogInput").focus();
	}

}
