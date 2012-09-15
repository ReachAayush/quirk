filepicker.setKey('ASiWD1oxDScaS4gVqOIi-z');

var screens = new Array();
var imageClicked = 0;
var clickElem = new Object();

$(document).ready(function() {
	$("#submit").click(function() {
  		var task = $('#taskDescription').val();
  		//$.post("http://quirk-quirk.dotcloud.com/api/newtask/", { taskDescription: task, imageURLs: screen });
	});

	$("#main").delegate(".screenContainer","click",function() { 
		imageClicked = parseInt($(this).attr('id').replace('screenWrap', ''));
		showCoords(clickElem);
	});

	function tempCoords(c) {
		clickElem = c;
	}

	function newImage(url) {
		screen = new Object();
		screen.url = url;

		screens.push(screen);
	    $('#dragScreen').remove();

	    // center column
	    if (((screen.length - 1) % 3) == 1) {
	    	$('#main').append('<div id="screenWrap' + screens.length + '"class="screenContainer centerColumn"><img id="screen' + screens.length + '" src="' + url + '"></div>');
	    } else {
	    	$('#main').append('<div id="screenWrap' + screens.length + '"class="screenContainer"><img id="screen' + screens.length + '" src="' + url + '"></div>');
	    }


	    $('#screen' + screens.length).Jcrop({
		    onChange: tempCoords,
		    onSelect: tempCoords,
		});

	    // center column
	    if ((screens.length % 3) == 1) {
	    	$('#main').append('<div id="dragScreen" class="screenContainer centerColumn"></div>');
	    	createDrop();
	    } else {
	    	$('#main').append('<div id="dragScreen" class="screenContainer"></div>');
	    	createDrop();
	    }

	}

	function createDrop() {
		filepicker.makeDropPane($('#dragScreen')[0], {
		    dragEnter: function() {
		        $("#dragScreen").html("Drop to upload").css({
		            'backgroundColor': "#E0E0E0",
		            'border': "1px solid #000"
		        });
		    },
		    dragLeave: function() {
		        $("#dragScreen").html("Drop files here").css({
		            'backgroundColor': "#F6F6F6",
		            'border': "1px dashed #666"
		        });
		    },
		    progress: function(percentage) {
		        $("#dragScreen").text("Uploading ("+percentage+"%)");
		    },
		    done: function(data) {
		        newImage(data[0]['url']);
		    }
		});
	}

	createDrop();
});

function showCoords(c) {
	 console.log(imageClicked);
	 /*
	 console.log(c.x);
	 console.log(c.y);
	 console.log(c.x2);
	 console.log(c.y2);
	 */
};