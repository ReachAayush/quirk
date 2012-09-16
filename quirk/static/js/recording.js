startTime = 0;

data = {};
data[0] = [];
// start time for time recording.
window.onload = setStartTime();


function setStartTime() {
	startTime = (new Date()).getTime();
}

// builds and submits JSON
function uploadData() {
	var jsonData = JSON.stringify(data);
	console.log(jsonData);
	return false;
}

// test mouse handler by showing x and y coordinates
function xy(evt) {
	coords = relMouseCoords(evt);
	console.log('(' + coords.x + ', ' + coords.y + ')');
	
	var coordsX = parseInt(coords.x);
	var coordsY = parseInt(coords.y);
	var hit = 0;

	click = {x:coords.x, y:coords.y, hit:hit, timestamp:(new Date().getTime())-startTime}
	data[activeScreen].push(click);
	
	if((coords.x > screens[activeScreen].x1) && (coords.x < screens[activeScreen].x2) && 
		(coords.y > screens[activeScreen].y1) && (coords.y < screens[activeScreen].y2)) {		
		
		click.hit = 1;

		if (activeScreen < screens.length) {
			activeScreen += 1;
			data[activeScreen] = [];
			$('#' + activeScreen).toggleClass('hidden');
			$('#' + (activeScreen + 1)).toggleClass('hidden');
		} else {
			$('#' + activeScreen).toggleClass('hidden');
			$('#finished').toggleClass('hidden');
			uploadData();
		}
	}
	
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
	data.demographics.age = 'info';// I don't even
	data.demographics.gender = 'info';
	//console.log(data);
	
	return false;
}