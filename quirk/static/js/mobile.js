var screens = Array();

function hideAddressBar() {
  if(!window.location.hash)
  {
      if(document.height < window.outerHeight)
      {
          document.body.style.height = (window.outerHeight + 50) + 'px';
      }

      setTimeout( function(){ window.scrollTo(0, 1); }, 50 );
  }
}

window.addEventListener("load", function(){ if(!window.pageYOffset){ hideAddressBar(); } } );
window.addEventListener("orientationchange", hideAddressBar );

$(document).ready(function() {
	$('#screen').height($(window).height() + 60);
	
	$.getJSON('http://quirk-quirk.dotcloud.com/api/getTask/' + publicKey, function(data) {
	  $.each(data, function(key, val) {
	    if (key == 0) {
	    	$('#intro').html(val)
	    } else if (key == 1) {
	    	https://www.filepicker.io/api/file/y0VknbUzTi6yLNaUWUlW/convert?w=240&h=100
	    	$('#screens').append('<img id="' + key + '" src="' + val[0] + '/convert?w=' + getWidth() + '&h=' + getHeight() + '">');
	    	var screen = new Object();
	    	screen.x1 = val[1];
	    	screen.y1 = val[2];
	    	screen.x2 = val[3];
	    	screen.y2 = val[4];
	    	screens.push(screen);
	    } else {
	    	$('#screens').append('<img id="' + key + '" src="' + val[0] + '/convert?w=' + getWidth() + '&h=' + getHeight() + '" class="hidden">');
	    }
	    
	  });
	
	});
	
});

function getHeight() {
	$(window).height() + 60;
}

function getWidth() {
	$(window).width();
}