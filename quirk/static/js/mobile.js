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
	
	$.getJSON('http://quirk-quirk.dotcloud.com/api/getTask/xhk3ao/' + publicKey, function(data) {
		alert('success');
	
	  $.each(data, function(key, val) {
	    
	    
	  });
	
	});
	
});

function getHeight() {
	$(window).height()
}

function getWidth() {
	$(window).width()
}