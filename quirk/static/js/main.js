filepicker.setKey('ASiWD1oxDScaS4gVqOIi-z');

var images = new Array();

function newImage(url) {
    $('#dragScreen').remove();
    $('#main').append('<div class="screenContainer"><img src="' + url + '"></div>');
    $('#main').append('<div id="dragScreen" class="screenContainer"><input type="filepicker-dragdrop" data-fp-apikey="ASiWD1oxDScaS4gVqOIi-z" data-fp-option-container="modal" data-fp-option-services="COMPUTER,URL" onchange="javascript:newImage(event.files[0].url)"></div>');
}

$(document).ready(function() {
	$("#submit").click(function() {
  		var task = $('#taskDescription').val();
  		$.post("http://quirk-quirk.dotcloud.com/api/newtask/", { taskDescription: task, imageURLs: images });
	});
});