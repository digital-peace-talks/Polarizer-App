function crisisForm(messageId) {
  var message = "";

  for (var i = 0; i < currentDialog.messages.length; i++) {
    if (currentDialog.messages[i].messageId == messageId) {
      message = currentDialog.messages[i].content;
      break;
    }
  }

  jQuery("#misc2").text("");
  jQuery("#misc2").append(`
		<div id="crisis">
			<h1>Finishing this dialogue</h1><br>
			<!--
			<h2>please rate this dialogue</h2>
				<form style="font-size: 22px">
				<input type="radio" name="feel" value="0"checked>&#x1F600;00
				<input type="radio" name="feel" value="1">&#x1F609;01
				<input type="radio" name="feel" value="2">&#x1F615;02<br>
				<input type="radio" name="feel" value="3">&#x1F622;03
				<input type="radio" name="feel" value="4">&#x1F620;04
				<input type="radio" name="feel" value="5">&#x1F635;05<br>
				<input type="radio" name="feel" value="6">&#x1F47D;06
				<input type="radio" name="feel" value="7">&#x1F4A9;07
				<input type="radio" name="feel" value="8">&#x1F916;08<br>
				<input type="radio" name="feel" value="9">&#x1F648;09
				<input type="radio" name="feel" value="10">&#x1F649;10
				<input type="radio" name="feel" value="11">&#x1F64A;11<br>
				</form> 
				<br>
			<form id="crisis">
				<div class="frame1">
					<div class="container1">
						<input type="range" style="z-index:400" name="rating2" min="1" max="180" value="100" class="slider" id="range-slider" />
					</div>
					<div class="smile-wrapper">
						<div class="eye eye-l"></div>
						<div class="eye eye-r"></div>  
						<div class="smile" ></div>
					</div>
				</div>
				-->
				<!--
				-->
							<form id="crisis">
				<div class="frame1">
					<div class="container1">
						<input type="range" style="z-index:400" name="rating2" min="1" max="180" value="100" class="slider" id="range-slider" />
					</div>
					<div class="smile-wrapper">
						<div class="eye eye-l"></div>
						<div class="eye eye-r"></div>  
						<div class="smile" ></div>
					</div>
				</div>
				
				<div class="reason">
				Please rate your outcome in this dialogue:
				<br>
				<br>
				<br>
				<br>
				<br>
				<br>
				<br>
					Please enter a reason for your rating:<br>
					<input type="text" name="reason">
				</div>
				
				
				<input type="submit" class="buttonCrisisSend" name="send" value="Yes, I want to finish this dialogue">
				<input type="button" class="closeButton" value="&#10005;" name="close window" id="crisisCloseWindow">
			</form>
			<div>
			After ending this dialogue it will be open to everyone in the topic: <br> "${currentDialog.topic}"
			</div>
		</div>
	`);

  jQuery("#range-slider").on("change", function () {
    jQuery(".smile").css("transform", "rotateX(" + jQuery(this).val() + "deg)");
  });

  jQuery(".crisis").focus();

  function mapRange(num, in_min, in_max, out_min, out_max) {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
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
        whoami.dptUUID
      );
      jQuery("#misc2").empty();
      jQuery("form#dialogFrame").html(`
			<br>
			<input type="button" class="buttondialogclose" value="&#10005;" name="close window" id="dialogClose">
			`);
    } else {
      alert("Please enter a conclusion.");
    }
  });

  jQuery(document).on("click", "#crisisCloseWindow", function (event) {
    dialogFormOpen = 0;
    jQuery("#misc2").empty();
    event.preventDefault();
  });

  jQuery(document).on("keyup", "#dialogInput", function (event) {
    if (event.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)) {
      event.stopImmediatePropagation();
      event.preventDefault();
      jQuery("form#crisis").submit();
    }
  });
}
