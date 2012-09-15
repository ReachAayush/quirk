filepicker.setKey('ASiWD1oxDScaS4gVqOIi-z');

var images = new Array();

$(document).ready(function() {
	$("#submit").click(function() {
  		var task = $('#taskDescription').val();
  		//$.post("http://quirk-quirk.dotcloud.com/api/newtask/", { taskDescription: task, imageURLs: images });
	});

	function newImage(url) {
	    $('#dragScreen').remove();
	    $('#main').append('<div class="screenContainer"><img src="' + url + '"></div>');
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
		    	console.log(data);
		        //newImage(data['url']);
		    }
		});
	}

	createDrop();
});