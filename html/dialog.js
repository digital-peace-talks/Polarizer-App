

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

function dialogForm(secondDialog) {

	var opinionMine;
	var opinionOther;
	var dialog = '';
	var dialog2 = '';
	var meReadyToEnd = '';
	var otherReadyToEnd = '';
	var viewOnly = true;
	var me;

	const maxMessages = currentDialog.extension * 25;

	if(dialogFormOpen) {
		jQuery("#dialogForm").remove();
	}

	dialogFormOpen = 1;

	if(currentDialog.initiator == 'me'
	|| currentDialog.recipient == 'notme2') {

		opinionMine = currentDialog.initiatorOpinion;
		opinionOther = currentDialog.recipientOpinion;
		//  opinion2 += "<br><br><b>Initiators proposition:</b><br>" + currentDialog.opinionProposition

	} else {

		//opinion1 += "<br><br><b>Initiators proposition:</b><br>" + currentDialog.opinionProposition
		opinionMine = currentDialog.recipientOpinion;
		opinionOther = currentDialog.initiatorOpinion;
	}

	if(currentDialog.messages.length == 0) {
		dialog = '<i id="props">&nbsp;</i>';
	}

	for(var i = 0; i < currentDialog.crisises.length; i++) {

		if(currentDialog.status == 'CLOSED') {

			if(currentDialog.crisises[i].initiator == 'me'
			|| currentDialog.crisises[i].recipient == 'notme2') {

				meReadyToEnd = `Last statement: ${currentDialog.crisises[i].reason}<br>Rating: ${currentDialog.crisises[i].rating}`;

			} else if(currentDialog.crisises[i].initiator == 'notme') {

				otherReadyToEnd = `Last statement: ${currentDialog.crisises[i].reason}<br>Rating: ${currentDialog.crisises[i].rating}`;

			}

		} else {

			if(currentDialog.crisises[i].initiator == 'me'
			|| currentDialog.crisises[i].recipient == 'notme2') {

				meReadyToEnd = '<h4>Ready to End</h4>';

			} else if(currentDialog.crisises[i].initiator == 'notme') {

				otherReadyToEnd = '<h4>Ready to End</h4>';

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

	if(meReadyToEnd == '') {
		viewOnly = false;
	}

	for(var i = 0; i < currentDialog.messages.length; i++) {

		if(currentDialog.messages[i].sender == 'me'
		|| currentDialog.messages[i].sender == 'notme2') {
			dialog += '<p class="right">' + currentDialog.messages[i].content + '</p>';
		} else {
			var option = '';
			if(viewOnly == false) {
				option = ' <span class="crisis" id="' + currentDialog.messages[i].messageId + '">&#9878;</span>';
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

				ratingMe = `Proposion: ${secondDialog.opinionProposition}<br>Last statement: ${secondDialog.crisises[i].reason}<br>Rating: ${secondDialog.crisises[i].rating}`;

			} else if(secondDialog.crisises[i].initiator == 'notme') {

				ratingOther = `Proposion: ${secondDialog.opinionProposition}<br>Last statement: ${secondDialog.crisises[i].reason}<br>Rating: ${secondDialog.crisises[i].rating}`;

			}
		}

		//	Proposion: ${secondDialog.opinionProposition}<br>
		dialog2 += `<table width="100%"><tr>
			<td valign="top" style="font-size: 14px" width="45%"><center>${ratingOther}</center></td>
			<td style="font-size: 36px"><center>vs.</center></td>
			<td valign="top" width="45%" style="font-size: 14px"><center>${ratingMe}</center></td>
			</tr></table><br>`;

		for(var i=0; i <  secondDialog.messages.length; i++) {

			if(secondDialog.messages[i].sender == 'me'
			|| secondDialog.messages[i].sender == 'notme2') {

				dialog2 += '<p class="left">' + secondDialog.messages[i].content + '</p>';

			} else {

				dialog2 += '<p class="right">' + secondDialog.messages[i].content + '</p>';

			}
		}
	}

	var opinionLabel1 = "Others opinion";
	var opinionLabel2 = "Your opinion";
	if(currentDialog.recipient == 'notme2') {
		var opinionLabel1 = "Opinion A";
		var opinionLabel2 = "Opinion B";
	}

	var html = `
		<div id="dialogFrame">

			<div class="top">
				<center>
					<h3>${currentDialog.topic}</h3>
					<!--
					<div class="table">
						<div class="dialogleft">
							<p><b>${opinionLabel1}:</b><br>${opinionOther}<br>${otherReadyToEnd}</p>
						</div>
						<div class="dialogcenter">
							vs.
						</div>
						<div class="dialogright">
							<p><b>${opinionLabel2}:</b><br>${opinionMine}<br>${meReadyToEnd}</p>
						</div>
					</div>
					-->
				</center>
				
			</div>
			<div class="middle">
				<div id="c2">
					<table width="100%">
						<tr>
							<td valign="top" style="font-size: 14px" width="45%"><center>
								<b>${opinionLabel1}:</b><br>${opinionOther}<br>${otherReadyToEnd}
							</center></td>
							<td style="font-size: 36px"><center>
								vs.
							</center></td>
							<td valign="top" width="45%" style="font-size: 14px"><center>
								<b>${opinionLabel2}:</b><br>${opinionMine}<br>${meReadyToEnd}
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

			html += `
				<div class="status">
				<center>
					<form id="dialogFrame">
					
						<input type="button" class="buttondialog" value="close window" name="close window" id="dialogClose">
						<input type="button" class="crisis" value="end dialog" name="end dialog" id="none">
					</form>
					<div id="c3">Messages: <b>${currentDialog.messages.length} of ${maxMessages}<br>${extensionRequest}</div>
				</center>
				</div>
			`;

		} else {

			if(otherReadyToEnd != '<h4>Ready to End</h4>') {

				html += `
					<div class="status">
						<center>
							<form id="dialogFrame">
							<textarea class="dialog" type="text" name="message"  id="dialogInput"></textarea>
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
							<textarea class="dialog" type="text" name="message"  id="dialogInput"></textarea>
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
				dpt.putDialog(currentDialog.dialog, "status", "CLOSED");
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
	jQuery("#dialogInput").focus();


}
