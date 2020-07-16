var touchmoved;
jQuery(document).on("click touch touchend", "span.myDialogs", function(event) {
  if (touchmoved) {
    return;
  }
  // button click action
  jQuery("#dialogInfo").remove();
  jQuery("#form").remove();
  focusAtCanvas();

  var oldCount = jQuery(this).attr("count");
  var text = jQuery(this).children("h2").text();
  var count = jQuery("span#dialog-btn-label").attr("count");

  jQuery(this).attr("count", 0);
  text = text.replace(` ${oldCount}`, "");
  jQuery(this).children("h2").text(text);
  text = jQuery("span#dialog-btn-label").text();

  if (count - oldCount > 0) {
    text = text.replace(` ${count}`, " " + (count - oldCount) + "");
    jQuery("span#dialog-btn-label").text(text);
    jQuery("span#dialog-btn-label").attr("count", count - oldCount);
  } else {
    text = text.replace(` ${count}`, "");
    jQuery("span#dialog-btn-label").text(text);
    jQuery("span#dialog-btn-label").attr("count", 0);
  }

  currentDialog = myDialogMenu[event.currentTarget.id];
  dpt.getDialog(currentDialog.dialog);
  event.stopImmediatePropagation();
  event.preventDefault();
}).on('touchmove', function(e) {
  touchmoved = true;
}).on('touchstart', function() {
  touchmoved = false;
});

function toggleDialogList() {
  if (myDialogsVisible == "visible") {
    myDialogsVisible = "hidden";
  } else {
    myDialogsVisible = "visible";
  }
  jQuery("#dialogList").css({ visibility: myDialogsVisible });
  jQuery("#close-dialog-btn").css({
    WebkitTransition: "opacity 0s ease-in-out",
    MozTransition: "opacity 0s ease-in-out",
    MsTransition: "opacity 0s ease-in-out",
    OTransition: "opacity 0s ease-in-out",
    transition: "opacity 0s ease-in-out",
  });
  jQuery("#close-dialog-btn").css({ visibility: myDialogsVisible });
}

function hideDialogList() {
  if ((myDialogsVisible = "visible")) {
    jQuery("#dialogList").css("visibility", "hidden");
    jQuery("#close-dialog-btn").css({
      WebkitTransition: "opacity 0s ease-in-out",
      MozTransition: "opacity 0s ease-in-out",
      MsTransition: "opacity 0s ease-in-out",
      OTransition: "opacity 0s ease-in-out",
      transition: "opacity 0s ease-in-out",
    });
    jQuery("#close-dialog-btn").css("visibility", "hidden");
    myDialogsVisible = "hidden";
  }
}

function loadDialogList(restObj) {
  var dialog = "";
  var menuEntry = "";
  var dialogs = restObj.data.data;

  var sum = 0;
  for (var i in dialogs) {
    sum += dialogs[i].unreadMessages;
  }
  if (sum > 0) {
    jQuery("#dialog-btn-label").attr("count", sum);
    jQuery("#dialog-btn-label").empty().text(`${sum}`);
    jQuery("#dialog-btn-label").show();
  } else {
    jQuery("#dialog-btn-label").attr("count", 0);
    jQuery("#dialog-btn-label").empty().text(``);
    jQuery("#dialog-btn-label").hide();
  }
  jQuery("body").append(`<div id="dialogList"></div>`);

  jQuery("#dialogList").empty();
  jQuery("#dialogList").append(
    `<button class="closeButton" id="close-dialog-btn">&#10005;</button>`
  );

  jQuery(document).on("click touch", "#close-dialog-btn", function (event) {
    hideDialogList();
    jQuery("#close-dialog-btn").visibility(false);
    focusAtCanvas();
    event.preventDefault();
  });

  if (!dialogs.length) {
    jQuery('#dialogList').append(`
      <div class="dialoglist-empty">
        <img src="/illustrations/blank_canvas.svg" />
        <h1>You don't have any dialogs yet</h1>
      </div>
    `);
  }

  for (var i = 0; i < dialogs.length; i++) {
    if (dialogs[i].unreadMessages > 0) {
      sum = " [" + dialogs[i].unreadMessages + "]";
    } else {
      sum = "";
    }

    menuEntry = `
      <span class="myDialogs" id="${dialogs[i].dialog}" count="${dialogs[i].unreadMessages}">
      <i>Dialog about:</i><h2>${dialogs[i].recipientOpinion}${sum}</h2></span>
    `;

    dialog = `
      <u style="font-size: 32px">Dialog Info</u><br><br>
      <i>Dialog about:</i><br><h2>${dialogs[i].recipientOpinion}<h2>
      <i>topic:</i><br>${dialogs[i].topic}<br><br>
    `;

    if (dialogs[i].initiator == "me") {
      dialog += `
        <i>my opinion:</i><br>${dialogs[i].initiatorOpinion}<br><br>
        <i>other's opinion:</i><br><h2>${dialogs[i].recipientOpinion}<h2>
        <i>initiator:</i> me<br><br>
      `;
    } else {
      dialog += `
        <i>my opinion:</i><br>${dialogs[i].recipientOpinion}<br><br>		
        <i>other's opinion:</i><br><h2>${dialogs[i].initiatorOpinion}<h2>
        <i>initiator:</i> other<br><br>
      `;
    }

    dialog += `<i>status:</i> ${dialogs[i].status}`;

    myDialogMenu[dialogs[i].dialog] = {
      dialog: dialogs[i].dialog,
      topic: dialogs[i].topic,
      initiatorOpinion: dialogs[i].initiatorOpinion,
      recipientOpinion: dialogs[i].recipientOpinion,
      menuEntry: menuEntry,
      description: dialog,
    };
    jQuery("#dialogList").append(menuEntry);
  }
}
