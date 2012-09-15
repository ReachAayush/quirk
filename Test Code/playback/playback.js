

data = {};
data.screen1 = [];
click = {x:130, y:250, hit:0, timestamp:2500}
data.screen1.push(click);
click = {x:230, y:30, hit:1, timestamp:3900}
data.screen1.push(click);


for(var i = 0; i < data.screen1.length; i++) {
	var click = data.screen1[i];
	setTimeout(function() {console.log('(' + click.x + ', ' + click.y + ') ' + click.hit);},click.timestamp);
}

function playTouch(x,y,hit) {
	console.log('(' + x + ', ' + y + ') ' + hit);
}