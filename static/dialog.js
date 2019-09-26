/*
jQuery(document).ready(function() {
	var socket = io.connect(window.location.protocol
		+ '//' + window.location.host, {transports: ['websocket']});

	var dpt = new DPT(socket);
	var colors = {};
	//var currentTopic = 0;
	var currentDialog;
	var dialogFormOpen = 0;

	var whoami = { dptUUID: '', user: {}};

	// Handle the incomming websocket trafic
	socket.on('connect', () => {
		// if needed, we could keep socket.id somewhere
		if(document.cookie) {
			dpt.userLogin(document.cookie);
		}
	});

	// server says it has some updates for client
	socket.on('update', function(restObj){

        if(restObj.path == '/dialog/list/' && restObj.method == 'get') {
        	dpt.getDialogList();
        }
        
        if(currentDialog && restObj.path == '/dialog/' + currentDialog.dialog +'/'
        && restObj.method == 'get'
        && dialogFormOpen == 1) {
        	dpt.getDialog(currentDialog.dialog);
        }
	});

	socket.on('api', function(restObj) {
		if(!restObj) {
			return;
		}
		if('status' in restObj && restObj.status > 399) {

			alert(restObj.data);
			return;

		} else if(currentDialog && restObj.path == '/dialog/' + currentDialog.dialog +'/' && restObj.method == 'get') {

			var old = currentDialog;
			currentDialog = restObj.data;
			currentDialog.topic = old.topic;
			currentDialog.initiatorOpinion = old.initiatorOpinion;
			currentDialog.recipientOpinion = old.recipientOpinion;
			dialogForm();

		} else if(restObj.path == '/dialog/list/' && restObj.method == 'get') {

			console.log(restObj.data);
			var dialog = '';
			var dialogs = restObj.data.data;
			jQuery('div.col.right').html('<h2>Dialogs</h2>');
			for(var i=0; i < dialogs.length; i++) {
				dialog = `<div class="dialog"><i>proposition:</i>${dialogs[i].opinionProposition}<br>`;
				dialog += `<div class="dialogInfo">${JSON.stringify(dialogs[i])}</div>`;
				jQuery('div.col.right').append(dialog+"<br></div>");
			}
		} else if(restObj.path == '/dialog/listAll/' && restObj.method == 'get') {

			console.log(restObj.data);
			var dialog = '';
			var dialogs = restObj.data.data;
			jQuery('div.col.right').html('<h2>Dialogs</h2>');
			for(var i=0; i < dialogs.length; i++) {
				dialog = `<div class="dialog"><i>proposition:</i>${dialogs[i].opinionProposition}<br>`;
				dialog += `<div class="dialogInfo">${JSON.stringify(dialogs[i])}</div>`;
				jQuery('div.col.right').append(dialog+"<br></div>");
			}
		}
	});

	socket.on('private', function(restObj) {

	    if(restObj.method == 'post') {
	        if(restObj.path == '/user/login/') {
	        	whoami.dptUUID = restObj.data.dptUUID;
	        	if(restObj.data.message == 'logged in') {
	        		whoami.user = restObj.data.user;
	        		dpt.getDialogListAll();
	        	}
	        }
	    }
	});

	socket.on('error', function (err) {
		console.log('System', err ? err : 'A unknown error occurred');
		document.location.reload(true);
		window.location.reload(true);
	});

*/
function crisisForm(messageId) {

    var message = '';

    for (var i = 0; i < currentDialog.messages.length; i++) {
        if (currentDialog.messages[i].messageId == messageId) {
            message = currentDialog.messages[i].content;
            break;
        }
    }
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
					<input type="submit" name="send" value="send">
					<input type="button" value="close window" name="close window" id="crisisCloseWindow">
				</form>
			</div>
		`);

    jQuery(".crisis").focus();

    jQuery("#crisis").submit(function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        dpt.postCrisis(jQuery('.reason').val(), jQuery("input[name='rating']:checked").val(), currentDialog.dialog, messageId, whoami.dptUUID);
        jQuery('#misc2').empty();
    });

    jQuery(document).one('click', "#crisisCloseWindow", function(event) {
        dialogFormOpen = 0;
        jQuery('#misc2').empty();
        event.preventDefault();
    })
}

function dialogForm() {

    var opinion1;
    var opinion2;
    var dialog = '';
    var meReadyToEnd = '';
    var otherReadyToEnd = '';
    var viewOnly = true;

    const maxMessages = currentDialog.extension * 10;

    dialogFormOpen = 1;

    if (currentDialog.initiator == 'me') {

        opinion1 = currentDialog.recipientOpinion;
        opinion2 = currentDialog.initiatorOpinion;
        opinion2 += "<br><br><b>Initiators proposition:</b><br>" + currentDialog.opinionProposition

    } else {

        opinion1 = currentDialog.initiatorOpinion;
        opinion1 += "<br><br><b>Initiators proposition:</b><br>" + currentDialog.opinionProposition
        opinion2 = currentDialog.recipientOpinion;
    }

    if (currentDialog.messages.length == 0) {
        dialog = '<i id="props">&nbsp;</i>';
    }

    for (var i = 0; i < currentDialog.crisises.length; i++) {

        if (currentDialog.status == 'CLOSED') {
            if (currentDialog.crisises[i].initiator == 'me') {
                meReadyToEnd = `Last statement: ${currentDialog.crisises[i].reason}<br>Rating: ${currentDialog.crisises[i].rating}`;
            } else if (currentDialog.crisises[i].initiator == 'notme') {
                otherReadyToEnd = `Last statement: ${currentDialog.crisises[i].reason}<br>Rating: ${currentDialog.crisises[i].rating}`;
            }
        } else {
            if (currentDialog.crisises[i].initiator == 'me') {
                meReadyToEnd = 'Ready to End';
            } else if (currentDialog.crisises[i].initiator == 'notme') {
                otherReadyToEnd = 'Ready to End';
            }
        }
    }

    var extensionRequest = '';
    if (currentDialog.status == 'ACTIVE') {
        extensionRequest = `More messages: <input type="checkbox" name="extensionRequest" value="true" id="extensionRequest">`;
        for (var i = 0; i < currentDialog.extensionRequests.length; i++) {
            if (currentDialog.extensionRequests[i].sender == 'me') {
                extensionRequest = `More messages: <input type="checkbox" name="extensionRequest" value="true" id="extensionRequest" checked>`;
            }
        }
    }

    if (meReadyToEnd == '') {
        viewOnly = false;
    }

    for (var i = 0; i < currentDialog.messages.length; i++) {

        if (currentDialog.messages[i].sender == 'me') {
            dialog += '<p class="right">' + currentDialog.messages[i].content + '</p>';
        } else {
            var option = '';
            if (viewOnly == false) {
                option = ' <span class="crisis" id="' + currentDialog.messages[i].messageId + '">&#9878;</span>';
            }
            dialog += '<p class="left">' + currentDialog.messages[i].content + option + '</p>';
        }
    }

    var html = `
				<div id="dialogFrame">
					<div class="table">
						<div class="top">
							<center>
								<h3>${currentDialog.topic}</h3>
								Messages: <b>${currentDialog.messages.length} of ${maxMessages}</b>
							</center>
						</div>
					<div class="middle">
					<div id="c1"><b>Others opinion:</b><br>${opinion1}<br><br>${otherReadyToEnd}</div>
					<div id="c2">${dialog}</div>
					<div id="c3"><b>My opinion:</b><br>${opinion2}<br><br>${meReadyToEnd}<br><br>${extensionRequest}</div></div>
			`;

    if (currentDialog.status == 'ACTIVE') {

        if (viewOnly) {
            html += `
					<div class="status">
					<center>
						<form id="dialogFrame">
                            <input type="button" value="close window" name="close window" id="dialogClose">
                            <input type="button" value="end dialog" name="end dialog" id="dialogClose">
						</form>
			   		</center>
					</div>
				`;
        } else {
        	if(otherReadyToEnd != '') {
        		html += `
					<div class="status">
						<center>
							<form id="dialogFrame">
							<textarea rows="4" cols="41" type="text" name="message"  id="dialogInput"></textarea>
								<br>
								<input type="submit" name="send" value="send">
                                <input type="button" value="close window" name="close window" id="dialogClose">
                                <input type="button" value="end dialog" name="end dialog" id="dialogClose">
							</form>
						</center>
					</div>
				`;
        	}
        }

        jQuery(document).one('click', "#dialogClose", function(event) {
            dialogFormOpen = 0;
            jQuery('#dialogForm').remove();
            focusAtCanvas();
            event.preventDefault();
        });

        jQuery(document).one('click', "#extensionRequest", function(event) {
            if (jQuery("#extensionRequest").is(':checked')) {
                dpt.extensionRequest(currentDialog.dialog, whoami.dptUUID);
            }
        });

    } else if (currentDialog.status == 'PENDING') {

        if (currentDialog.initiator == 'me') {
            html += `
					<div class="status">
						<center>
							Please wait for the other to accept the dialog.
							<input type="button" value="close window" name="close window" size="120" id="dialogClose">
			   			</center>
					</div>
				`;
            jQuery(document).one('click', "#dialogClose", function(event) {
                dialogFormOpen = 0;
                jQuery('#dialogForm').remove();
                focusAtCanvas();
                event.preventDefault();
            });

        } else {

            html += `
					<div class="status">
						<center id="actionSpace">
							<input type="button" value="accept dialog" name="accept dialog" size="120" id="dialogAccept">
							<input type="button" value="ask me later" name="accept dialog" size="120" id="dialogCloseWindow">
							<input type="button" value="reject" name="accept dialog" size="120" id="dialogReject">
			   			</center>
					</div>
				`;

            jQuery(document).one('click', "#dialogAccept", function(event) {
                jQuery('center#actionSpace').html(`
						<form id="dialogFrame">
							<input type="text" name="message" size="60" id="dialogInput">
						</form><br>
					`);
                dpt.putDialog(currentDialog.dialog, "status", "ACTIVE");
                event.preventDefault();
            });

            jQuery(document).one('click', "#dialogCloseWindow", function(event) {
                dialogFormOpen = 0;
                jQuery('#dialogForm').remove();
                focusAtCanvas();
                event.preventDefault();
            });

            jQuery(document).one('click', "#dialogReject", function(event) {
                dialogFormOpen = 0;
                jQuery('#dialogForm').remove();
                focusAtCanvas();
                dpt.putDialog(currentDialog.dialog, "status", "CLOSED");
                event.preventDefault();
            });
        }

    } else if (currentDialog.status == 'CLOSED') {

        html += `
				<div class="status">
					<center>
						<b>This dialog is closed.</b>
						<input type="button" value="close window" name="close window" size="120" id="dialogCloseWindow">
		   			</center>
				</div>
			`;

        jQuery(document).one('click', "#dialogCloseWindow", function(event) {
            dialogFormOpen = 0;
            jQuery('#dialogForm').remove();
            focusAtCanvas();
            event.preventDefault();
        });
    }

    html += '</div></div>';

    //		jQuery('#misc').append(html);
    jQuery('body').append(`<div id="dialogForm" style="position: absolute; top: 0px; left: -63px; padding: 20px;
				margin-left: 25%; border: #fff; border-style: solid; border-width: 1px;
				color: #000; width: 50%; z-index: 2; font-family: DPTFont; font-size: 18px;
				background-color: #28A9E1; height: 640px">${html}</div>`);

    if (currentDialog.status == 'CLOSED') {
        for (var i = 0; i < currentDialog.crisises.length; i++) {
            if (currentDialog.crisises[i].sender == 'me') {
                jQuery('#c3', `Last statement: ${currentDialog.crisises[i].reason}<br>Rating: ${currentDialog.crisises[i].rating}`);
            } else {
                jQuery('#c1', `Last statement: ${currentDialog.crisises[i].reason}<br>Rating: ${currentDialog.crisises[i].rating}`);
            }
        }
    }

    jQuery(document).one('submit', '#dialogFrame', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        var message = this[0].value;
        dpt.postMessage(message, whoami.dptUUID, currentDialog.dialog);
        jQuery("#dialogInput").focus();
    });

    jQuery(document).on('click', '.crisis', function(event) {
        crisisForm(this.id);
        event.stopImmediatePropagation();
        event.preventDefault();
    });

    jQuery(document).on('keyup', '#dialogInput', function(event) {
        if (event.keyCode == 27) {
            jQuery('#dialogForm').remove();
            focusAtCanvas();
            event.preventDefault();
        }
    });

    jQuery("#dialogInput").focus();
}

/*
	jQuery(document).on('mouseleave touchend', 'li.connector', (event) => {
		var root = event.currentTarget.id;
//		jQuery(event.currentTarget).children("span.connector").html('');
		jQuery("span.connector").text('');
		event.preventDefault();
	});

	jQuery(document).on('touchend click', '.dialog', (event) => {

		currentDialog = jQuery(event.currentTarget).children('div.dialogInfo');
		currentDialog = JSON.parse(currentDialog[0].textContent);
		dpt.getDialog(currentDialog.dialog);
		event.stopImmediatePropagation();
		event.preventDefault();
	});

	jQuery('#main').append(`<div class="row"><div class="col right"><h2>Dialogs</h2></div></div>`);
});
	*/