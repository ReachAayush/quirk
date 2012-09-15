object = document.getElementById("clickImage");// get image object
object.addEventListener ("mouseup", xy);// add mouse down listener to object

bounds = {};

data = {};
data.screen1 = [];

// builds and submits JSON
function uploadData() {
	var jsonData = JSON.stringify(data);
	//send jsonData to server...
	return false;
}

// test mouse handler by showing x and y coordinates
function xy(evt) {
	coords = relMouseCoords(evt);
	console.log('(' + coords.x + ', ' + coords.y + ')');
	console.log(coords.x);
	console.log(bounds['x1']);
	
	var coordsX = parseInt(coords.x);
	var coordsY = parseInt(coords.y);
	var hit = 0;
	
	if((coords.x > bounds['x1']) && (coords.x < bounds['x2']) && 
			(coords.y > bounds['y1']) && (coords.y < bounds['y2'])) {
		// if last screen, build and send json object
		uploadData();
		
		hit = 1;
	}
	
	$('#hit').val(hit);
	click = {x:coords.x, y:coords.y, hit:hit, timestamp:(new Date().getTime())}
	data.screen1.push(click);
	console.log(data);
	
	return false;
}

function relMouseCoords(event){
	if (event.offsetX !== undefined && event.offsetY !== undefined) 
		{ return {x:event.offsetX, y:event.offsetY}; }
	
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

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY}
}


function compileBioData() {
	data.demographics = {};
	data.demographics.age = $('input:radio[name=age]:checked').value;
	data.demographics.gender = $('input:radio[name=gender]:checked');
	//console.log(data);
	
	return false;
}




jQuery(function($){

  $('#boundaryImage').Jcrop({
    onChange:   showCoords,
    onSelect:   showCoords,
    onRelease:  clearCoords
  });

});

// Simple event handler, called from onChange and onSelect
// event handlers, as per the Jcrop invocation above
function showCoords(c)
{
  $('#x1').val(c.x);
  $('#y1').val(c.y);
  $('#x2').val(c.x2);
  $('#y2').val(c.y2);
  $('#w').val(c.w);
  $('#h').val(c.h);
  bounds.x1 = c.x;
  bounds.y1 = c.y;
  bounds.x2 = c.x2;
  bounds.y2 = c.y2;
};

function clearCoords()
{
  $('#coords input').val('');
};