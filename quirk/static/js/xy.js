object = document.getElementById("image");// get image object
object.addEventListener ("mousedown", xy);// add mouse down listener to object

// test mouse handler by showing x and y coordinates
function xy(evt) {
	coords = relMouseCoords(evt);
	console.log('(' + coords.x + ', ' + coords.y + ')');
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