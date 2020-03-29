function propositionForm(opinionId, topicId) {
  console.log("enter proposition");

  jQuery(
    ` <div id="form" class="dialog-form" position:absoulute;">
    <form id="proposition">
		<input type="hidden" id="opinionId" name="opinionId" value="${opinionId}">
		<input type="hidden" id="topicId" name="topicId" value="${topicId}">
		<div>
      <br><button class="button" type="submit" value="Confirm">Request dialog</button>
    </div>
		<div>
      <button class="button-second" type="button" value="&#10005;" name="close window" id="ClosePropositionForm">Never mind</button>
    </div>
    </form></div>
	`
  )
    .hide()
    .appendTo("body")
    .fadeIn(900);

  jQuery(".proposition").focus();

  jQuery(document).on("click", "#ClosePropositionForm", function (event) {
    propositionFormOpen = 0;
    jQuery("#form").remove();
    formVisible = false;
    focusAtCanvas();
    event.preventDefault();
  });

  jQuery(document).on("keydown", ".proposition", function (event) {
    var n = jQuery(".proposition").val().length;
    if (n >= 512) {
      jQuery(".proposition").css({
        "background-color": "#ff8888",
        color: "#005B98",
      });
      if (
        event.keyCode != 8 &&
        event.keyCode != 127 &&
        event.keyCode != 37 &&
        event.keyCode != 38 &&
        event.keyCode != 39 &&
        event.keyCode != 40
      ) {
        event.preventDefault();
      }
    } else {
      var bg = jQuery("textarea.proposition").css("background-color");
      if (bg != "rgb(255,255,255)") {
        jQuery("textarea.proposition").css({
          "background-color": "rgb(255,255,255)",
        });
      }
    }
    if (event.keyCode == 27) {
      jQuery("#form").remove();
      formVisible = false;
      focusAtCanvas();
      event.preventDefault();
    }
    if (event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
    }
    if (event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)) {
      jQuery("form#proposition").submit();
    }
  });

  jQuery(document).on("submit", "form#proposition", function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    var proposition = "";
    var opinionId = jQuery("#opinionId").val();
    var topicId = jQuery("#topicId").val();
    dpt.postDialog(proposition, whoami.dptUUID, opinionId, topicId);
    jQuery("#form").remove();
    formVisible = false;
    focusAtCanvas();
  });
}
