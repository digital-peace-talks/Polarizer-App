function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  } else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd("character", selectionEnd);
    range.moveStart("character", selectionStart);
    range.select();
  }
}

function setCaretToPos(input, pos) {
  setSelectionRange(input, pos, pos);
}

function emoticon(d) {
  if (d > 0.25) {
    return '<span id="positive" style="font-size: 28px">&#128512; Positive</span>';
  } else if (d < -0.25) {
    return '<span id="negative" style="font-size: 28px">&#128544; Negative</span>';
  } else {
    return '<span id="neutral" style="font-size: 28px">&#128528; Neutral</span>';
  }
}

function dialogForm(secondDialog) {
  const QUIT_DIALOG_BUTTON = '<button class="crisis mdi mdi-18px mdi-account-arrow-right" id="none"> Quit and rate dialog</button>';
  var headerMine;
  var headerOther;
  var dialog = "";
  var dialog2 = "";
  var otherReadyToEnd = false;
  var viewOnly = false;
  var me;
  var cursorPos = jQuery("textarea#dialogInput").prop("selectionStart");
  var dialogInput = jQuery("textarea#dialogInput").val();
  if (!dialogInput) {
    dialogInput = "";
  }

  const maxMessages = currentDialog.extension * 25;

  if (dialogFormOpen) {
    jQuery("#dialogForm").remove();
  }

  dialogFormOpen = 1;

  if (currentDialog.initiator == "me" || currentDialog.recipient == "notme2") {
    headerMine = currentDialog.initiatorOpinion + "<br>";
    headerOther = currentDialog.recipientOpinion + "<br>";
  } else {
    headerMine = currentDialog.recipientOpinion + "<br>";
    headerOther = currentDialog.initiatorOpinion + "<br>";
  }

  if (currentDialog.messages.length == 0) {
    dialog = '<i id="props">&nbsp;</i>';
  }

  for (var i = 0; i < currentDialog.crisises.length; i++) {
    viewOnly = true;
    if (currentDialog.status == "CLOSED") {
      if (
        currentDialog.crisises[i].initiator == "me" ||
        currentDialog.crisises[i].recipient == "notme2"
      ) {
        headerMine += `Last statement: ${
          currentDialog.crisises[i].reason
        }<br>Rating: ${emoticon(currentDialog.crisises[i].rating)}`;
      } else if (currentDialog.crisises[i].initiator == "notme") {
        headerOther += `Last statement: ${
          currentDialog.crisises[i].reason
        }<br>Rating: ${emoticon(currentDialog.crisises[i].rating)}`;
      }
    } else {
      if (
        currentDialog.crisises[i].initiator == "me" ||
        currentDialog.crisises[i].recipient == "notme2"
      ) {
        headerMine += "<h4>Ready to End</h4>";
      } else if (currentDialog.crisises[i].initiator == "notme") {
        headerOther += "<h4>Ready to End</h4>";
        otherReadyToEnd = true;
      } else if (currentDialog.crisises[i].initiator == "notme") {
      }
    }
  }

  var extensionRequest = "";
  if (currentDialog.status == "ACTIVE") {
    // extensionRequest = `More messages: <input type="checkbox" name="extensionRequest" value="true" id="extensionRequest">`;
    for (var i = 0; i < currentDialog.extensionRequests.length; i++) {
      if (currentDialog.extensionRequests[i].sender == "me") {
        // extensionRequest = `More messages: <input type="checkbox" name="extensionRequest" value="true" id="extensionRequest" checked>`;
      }
    }
  }

  for (var i = 0; i < currentDialog.messages.length; i++) {
    if (
      currentDialog.messages[i].sender == "me" ||
      currentDialog.messages[i].sender == "notme2"
    ) {
      dialog +=
        '<p class="right">' + currentDialog.messages[i].content + "</p>";
    } else {
      var option = "";
      dialog +=
        '<p class="left">' +
        currentDialog.messages[i].content +
        option +
        "</p>";
    }
  }

  if (secondDialog) {
    dialog2 = "<h3></h3>";

    var ratingMe = "";
    var ratingOther = "";

    for (var i = 0; i < secondDialog.crisises.length; i++) {
      if (
        secondDialog.crisises[i].initiator == "me" ||
        secondDialog.crisises[i].recipient == "notme2"
      ) {
        var propositionMine = "";
        if (
          secondDialog.initiator == "me" ||
          secondDialog.initiator == "notme2"
        ) {
          propositionMine = `Proposion: ${secondDialog.headerProposition}<br>`;
        }
        ratingMe = `${propositionMine}Last statement: ${
          secondDialog.crisises[i].reason
        }<br>Rating: ${emoticon(secondDialog.crisises[i].rating)}`;
      } else if (secondDialog.crisises[i].initiator == "notme") {
        var propositionOther = "";
        if (secondDialog.initiator == "notme") {
          propositionOther = `Proposion: ${secondDialog.headerProposition}<br>`;
        }
        ratingOther = `${propositionOther}Last statement: ${
          secondDialog.crisises[i].reason
        }<br>Rating: ${emoticon(secondDialog.crisises[i].rating)}`;
      }
    }

    if (!currentDialog.thirdEye) {
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

    for (var i = 0; i < secondDialog.messages.length; i++) {
      if (!currentDialog.thirdEye) {
        if (secondDialog.messages[i].sender == "me") {
          dialog2 +=
            '<p class="right">' + secondDialog.messages[i].content + "</p>";
        } else {
          dialog2 +=
            '<p class="left">' + secondDialog.messages[i].content + "</p>";
        }
      } else {
        if (secondDialog.messages[i].sender == "me") {
          dialog2 +=
            '<p class="left">' + secondDialog.messages[i].content + "</p>";
        } else {
          dialog2 +=
            '<p class="right">' + secondDialog.messages[i].content + "</p>";
        }
      }
    }
  }

  var opinionLabel1 = "<h5>Others opinion:</h5>";
  var opinionLabel2 = "<h5>Your opinion:</h5>";
  if (currentDialog.thirdEye) {
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
								<b>${opinionLabel1}</b><br>${headerOther}<br>
							</center></td>
							<td style="font-size: 36px"><center>
								vs.
							</center></td>
							<td valign="top" width="45%" style="font-size: 14px"><center>
								<b>${opinionLabel2}</b><br>${headerMine}<br>
							</center></td>
						</tr>
					</table>
					${dialog}
					${dialog2}
				</div>
			</div>
		</div>
	`;

  if (currentDialog.status == "ACTIVE") {
    if (viewOnly) {
      var endDialog = QUIT_DIALOG_BUTTON;
      for (var i in currentDialog.crisises) {
        if (currentDialog.crisises[i].initiator == "me") {
          endDialog = "";
        }
      }
      html += `
			<input type="button" class="buttondialogclose" value="&#10005;" name="close window" id="dialogClose">
				<div class="status">
				
				<center>
					<form id="dialogFrame">
					
						
						${endDialog}
					</form>
					<div id="c3">Messages: <b>${currentDialog.messages.length} of ${maxMessages}<br>${extensionRequest}</div>
				</center>
				</div>
			`;
    } else {
      if (otherReadyToEnd == false) {
        html += `
				<input type="button" class="buttondialogclose" value="&#10005;" name="close window" id="dialogClose">
					<div class="status">
					
						<center>
							<form id="dialogFrame">
							<textarea class="textareaDialog" type="text" name="message" id="dialogInput">${dialogInput}</textarea>
								<br>
								<input type="submit" class="buttonSend" name="send" value="send">
								${QUIT_DIALOG_BUTTON}
							</form>
							<div id="c3">Messages: <b>${currentDialog.messages.length} of ${maxMessages}<br>${extensionRequest}</div>
						
						</center>
					</div>
				`;
      } else {
        html += `
				<input type="button" class="buttondialogclose" value="&#10005;" name="close window" id="dialogClose">
					<div class="status">
					
						<center>
							<form id="dialogFrame">
								<br>
								
								${QUIT_DIALOG_BUTTON}
							</form>
							<div id="c3">Messages: <b>${currentDialog.messages.length} of ${maxMessages}<br>${extensionRequest}</div>
						
						</center>
					</div>
				`;
      }
    }

    jQuery(document).one("click", "#extensionRequest", function (event) {
      if (jQuery("#extensionRequest").is(":checked")) {
        dpt.extensionRequest(currentDialog.dialog, whoami.dptUUID);
      }
    });
  } else if (currentDialog.status == "PENDING") {
    if (currentDialog.initiator == "me") {
      html += `
			<input type="button" class="buttondialogclose" value="&#10005;" name="close window" size="120" id="dialogClose">
					<div class="status">
					
						<center>
							Please wait for the other to accept the dialog.
							
						</center>
					</div>
			`;
    } else {
      html += `
			<input type="button" class="buttondialogclose" value="&#10005;" name="close window" id="dialogClose">
				<div class="status">
					<center id="actionSpace">
						<input type="button" class="buttondialogstandard" id="dialogAccept" value="accept dialog" name="accept dialog" size="120" id="dialogAccept">
						<input type="button" class="buttondialogstandard" value="ask me later" name="accept dialog" size="120" id="dialogClose">
						<input type="button" class="buttondialogstandard" value="reject" name="accept dialog" size="120" id="dialogReject">
						</center>
				</div>
			`;

      jQuery(document).one("click", "#dialogAccept", function (event) {
        jQuery("center#actionSpace").html(`
				<input type="button" class="buttondialogclose" value="&#10005;" name="close window" id="dialogClose">
					<div class="status">
					
						<center>
							<form id="dialogFrame">
							<textarea class="textareaDialog" type="text" name="message" id="dialogInput">${dialogInput}</textarea>
								<br>
								<input type="submit" class="buttonSend" name="send" value="send">
								
								${QUIT_DIALOG_BUTTON}
							</form>
							<div id="c3">Messages: <b>${currentDialog.messages.length} of ${maxMessages}<br>${extensionRequest}</div>
						
						</center>
					</div>
				`);

        dpt.putDialog(currentDialog.dialog, currentTopic, "status", "ACTIVE");
        event.preventDefault();
      });

      jQuery(document).one("click", "#dialogReject", function (event) {
        dialogFormOpen = 0;
        jQuery("#dialogForm").remove();
        focusAtCanvas();
        dpt.putDialog(currentDialog.dialog, currentTopic, "status", "CLOSED");
        event.preventDefault();
      });
    }
  } else if (currentDialog.status == "CLOSED") {
    html += `
		<input type="button" class="buttondialogclose" value="&#10005;" name="close window" size="120" id="dialogClose">
			<div class="status">
			
				<center>
					
					<b>This dialog is closed.</b>
				</center>
			</div>
		`;
  }

  html += "</div></div>";

  jQuery("body").append(`<div id="dialogForm">${html}</div>`);

  jQuery(document).one("click", "#dialogClose", function (event) {
    dialogFormOpen = 0;
    jQuery("#dialogForm").remove();
    event.preventDefault();
    event.stopImmediatePropagation();
    focusAtCanvas();
  });

  jQuery(document).on("submit", "#dialogFrame", function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    var message = this[0].value;
    jQuery("#dialogInput").val("");

    if (message.length > 0) {
      dpt.postMessage(message, whoami.dptUUID, currentDialog.dialog);
    }

    jQuery("#dialogInput").focus();
    var objDiv = document.getElementById("dialogForm");
    objDiv.scrollTop = objDiv.scrollHeight;
  });

  jQuery(document).on("click touch", ".crisis", function (event) {
    crisisForm(this.id);
    event.stopImmediatePropagation();
    event.preventDefault();
  });

  jQuery(document).on("keyup", "#dialogInput", function (event) {
    if (event.keyCode == 27) {
      dialogFormOpen = 0;
      jQuery("#dialogForm").remove();
      focusAtCanvas();
      event.preventDefault();
    }

    if (
      (event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)) ||
      event.keyCode == 10 ||
      event.keyCode == 13
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
      var message = jQuery("#dialogInput").val();
      if (message.length > 1) {
        jQuery("form#dialogFrame").submit();
      } else {
        jQuery("#dialogInput").val("");
      }
    }
  });

  var objDiv = document.getElementById("dialogForm");
  objDiv.scrollTop = objDiv.scrollHeight;

  if (cursorPos) {
    setCaretToPos(document.getElementById("dialogInput"), cursorPos);
    jQuery("#dialogInput").focus();
  } else {
    jQuery("#dialogInput").focus();
  }
}
