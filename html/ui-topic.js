function topicEdit(context) {
	topicForm(true, context);
}

function topicForm(edit, context) {
	console.log('enter topic');

	jQuery("#form").remove();
	formVisible = true;

	var topic = '';
	var hiddenTopicId = '';
	if (edit) {
		topic = context.content;
		edit = `<input type="hidden" class="edit" name="edit" value="edit" />`;
		hiddenTopicId = `<input type="hidden" name="topicId" class="topicId" value="${context.topicId}">`;
	} else {
		edit = '';
	}
	if (isMobile) {
		jQuery('body').append(`
			<div id="form">New topic:<br><form id="topic" class="topicForm">
			<textarea name="topic"
			class="topic">${topic}</textarea><br>
			<input class="button" type="submit" value="send">${edit}${hiddenTopicId}</form></div>
		`);

	} else {
		jQuery('body').append(`
			<div id="form">
			Please enter a new topic:<br><form id="topic" class="topicForm">
			<textarea name="topic" class="topic">${topic}</textarea><br>
			<input class="button" type="submit" value="Confirm">
			<input class="closeButton" type="button" value="&#10005;" name="close window"
			id="CloseTopicForm">${edit}${hiddenTopicId}</form></div>
		`);
	}
	jQuery(".topic").focus();

	jQuery(document).on('click touch', "#CloseTopicForm", function(event) {
		// topicFormOpen = 0;
		jQuery('#form').remove();
		formVisible = false;
		focusAtCanvas();
		event.preventDefault();
	});

	jQuery(document).on('keydown', '.topic', function(event) {
		var n = jQuery('.topic').val().length;
		if (n >= 256) {
			jQuery('textarea.topic').css({ "background-color": "#ff8888" });
			if (event.keyCode != 8
			&& event.keyCode != 127
			&& event.keyCode != 37
			&& event.keyCode != 38
			&& event.keyCode != 39
			&& event.keyCode != 40) {
				event.preventDefault();
			}
		} else {
			jQuery('textarea.topic').css({ "background-color": "#ffffff" });
		}
		if (event.keyCode == 27) {
			jQuery('#form').remove();
			formVisible = false;
			event.preventDefault();
			focusAtCanvas();
		}
		if (event.keyCode == 10 || event.keyCode == 13) {
			event.preventDefault();
		}
		if (event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)) {
			jQuery('form#topic').submit();
			event.preventDefault();
			focusAtCanvas();
		}
	});

	jQuery(document).on('submit', 'form#topic', function(event) {
		event.stopImmediatePropagation();
		event.preventDefault();
		var topic = jQuery('.topic').val();
		var topicId = jQuery('.topicId').val();
		var edit = jQuery('.edit').val();
		if (topic) {
			if (edit == "edit") {
				dpt.putTopic(topic, topicId, whoami.dptUUID);
			} else {
				dpt.postTopic(topic);
			}
		}
		jQuery('#form').remove();
		formVisible = false;
		focusAtCanvas();

	});
}