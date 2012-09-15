filepicker.setKey('ASiWD1oxDScaS4gVqOIi-z');

var images = new Array();

$(document).ready(function() {
	$("#submit").click(function() {
  		var task = $('#taskDescription').val();
  		//$.post("http://quirk-quirk.dotcloud.com/api/newtask/", { taskDescription: task, imageURLs: images });
	});

	function newImage(url) {
		images.push(url);
	    $('#dragScreen').remove();

	    // center column
	    if (((images.length - 1) % 3) == 1) {
	    	$('#main').append('<div class="screenContainer centerColumn"><img id="screen' + images.length + '" src="' + url + '"></div>');
	    } else {
	    	$('#main').append('<div class="screenContainer"><img id="screen' + images.length + '" src="' + url + '"></div>');
	    }

	    $('#screen' + images.length).Jcrop({
		    onChange: showCoords,
		    onSelect: showCoords,
		    onRelease: clearCoords
		});

	    $('#main').append('<div id="dragScreen" class="screenContainer"></div>');
	    createDrop();
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
	console.log('coords accepted');
	/*
	  $('#x1').val(c.x);
	  $('#y1').val(c.y);
	  $('#x2').val(c.x2);
	  $('#y2').val(c.y2);
	  $('#w').val(c.w);
	  $('#h').val(c.h);
	*/
};

function clearCoords() {
	console.log('clear coords');
  	//$('#coords input').val('');
};