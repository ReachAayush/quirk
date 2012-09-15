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
	    	$('#main').append('<div id="screen' + images.length + '" class="screenContainer centerColumn"><img src="' + url + '"></div>');
	    } else {
	    	$('#main').append('<div id="screen' + images.length + '" class="screenContainer"><img src="' + url + '"></div>');
	    }

	    object = document.getElementById('screen' + images.length);// get image object
		object.addEventListener ("mousedown", xy);// add mouse down listener to object

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

// test mouse handler by showing x and y coordinates
function xy(e) {
	coords = relMouseCoords(e);
	console.log('(' + coords.x + ', ' + coords.y + ')');
}

function relMouseCoords(e){
	if (e.offsetX !== undefined && e.offsetY !== undefined) 
		{ return {x:e.offsetX, y:e.offsetY}; }
	
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft;
        totalOffsetY += currentElement.offsetTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = e.pageX - totalOffsetX;
    canvasY = e.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}

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