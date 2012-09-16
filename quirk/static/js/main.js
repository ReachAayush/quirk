filepicker.setKey('ASiWD1oxDScaS4gVqOIi-z');

var screens = new Array();
var imageClicked = 0;
var clickElem = new Object();

$(document).ready(function() {
	$("#submit").click(function() {
  		var task = $('#taskDescription').val();
  		var screensString = '';

  		for (i=0; i<screens.length; i++) {
  			if ((i+1) == screens.length) {
  				screensString += screens[i].url + ',';
  				screensString += 'btnLabel' + ',';
	  			screensString += screens[i].x1 + ',';
	  			screensString += screens[i].y1 + ',';
	  			screensString += screens[i].x2 + ',';
	  			screensString += screens[i].y2;
  			} else {
	  			screensString += screens[i].url + ',';
	  			screensString += 'btnLabel,';
	  			screensString += screens[i].x1 + ',';
	  			screensString += screens[i].y1 + ',';
	  			screensString += screens[i].x2 + ',';
	  			screensString += screens[i].y2 + ',';
	  		}
  		}
  		
  		$.post("http://quirk-rukkus.dotcloud.com/api/newtask/", { taskDescription: task, screens: screensString }, function(data) {
  			$('#publicURL').val('http://quirk-rukkus.dotcloud.com/' + data['publicID']);
  			$('#privateURL').val('http://quirk-rukkus.dotcloud.com/' + data['privateID']);
  		});
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
	    if (((screens.length - 1) % 3) == 1) {
	    	$('.screenBox').append('<div id="screenWrap' + screens.length + '"class="screenContainer centerColumn"><img id="screen' + screens.length + '" src="' + url + '"></div>');
	    } else {
	    	$('.screenBox').append('<div id="screenWrap' + screens.length + '"class="screenContainer"><img id="screen' + screens.length + '" src="' + url + '"></div>');
	    }


	    $('#screen' + screens.length).Jcrop({
		    onChange: tempCoords,
		    onSelect: tempCoords,
		});

	    // center column
	    if ((screens.length % 3) == 1) {
	    	$('.screenBox').append('<div id="dragScreen" class="screenContainer centerColumn"></div>');
	    	createDrop();
	    } else {
	    	$('.screenBox').append('<div id="dragScreen" class="screenContainer"></div>');
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
	elemClicked = parseInt(elemClicked.replace('screen', '')) - 1;

	screens[elemClicked].x1 = c.x;
	screens[elemClicked].y1 = c.y;
	screens[elemClicked].x2 = c.x2;
	screens[elemClicked].y2 = c.y2;
};