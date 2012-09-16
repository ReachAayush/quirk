var screens = Array();
var activeScreen = 0;

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

function beginTrial() {
	$('#intro').toggleClass('hidden');
	$('#screens').toggleClass('hidden');
	setStartTime();
}

$(document).ready(function() {
	$('#screens').height($(window).height() + 60);
	
	$.getJSON('http://www.tryquirk.com/api/getTask/' + publicKey, function(data) {
	  $.each(data, function(key, val) {
	    if (key == 0) {
	    	$('#intro').html(val);
	    	$('#intro').append('<br><a href="javascript:beginTrial()"><button type="button" id="begin">Begin</button></a>');
	    } else if (key == 1) {
	    	$('#screens').append('<img style="width:100%;height:100%;" id="' + key + '" src="' + val[0] + '">');
	    	var screen = new Object();
	    	screen.x1 = scaleX(val[1]);
	    	screen.y1 = scaleY(val[2]);
	    	screen.x2 = scaleX(val[3]);
	    	screen.y2 = scaleY(val[4]);
	    	screens.push(screen);
	    	hideAddressBar();
	    } else {
	    	$('#screens').append('<img style="width:100%;height:100%;" id="' + key + '" src="' + val[0] + '" class="hidden">');
	    	var screen = new Object();
	    	screen.x1 = scaleX(val[1]);
	    	screen.y1 = scaleY(val[2]);
	    	screen.x2 = scaleX(val[3]);
	    	screen.y2 = scaleY(val[4]);
	    	screens.push(screen);
	    }
	  });

		$("#screens").delegate("img:visible", "mouseup", xy);

	});
	
});

function scaleX(num) {
	return num;
	//return (num * $(window).width()) / 294;
}

function scaleY(num) {
	return num;
	//return (num * $(window).height()) / 420;
}