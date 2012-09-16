///////OLD use other file!

// example of returned json object, needing to be parsed.
jsonTestObj = '[[{"y": 160, "x": 42, "screen": 0, "hit": 1, "time": 8387}, {"y": 61, "x": 336, "screen": 1, "hit": 0, "time": 3787}, {"y": 47, "x": 44, "screen": 1, "hit": 1, "time": 4934}, {"y": 297, "x": 43, "screen": 2, "hit": 1, "time": 23006}], [{"y": 160, "x": 42, "screen": 0, "hit": 1, "time": 8387}, {"y": 61, "x": 336, "screen": 1, "hit": 0, "time": 3787}, {"y": 47, "x": 44, "screen": 1, "hit": 1, "time": 4934}, {"y": 297, "x": 43, "screen": 2, "hit": 1, "time": 23006}, {"y": 281, "x": 28, "screen": 2, "hit": 1, "time": 23966}], [{"y": 160, "x": 42, "screen": 0, "hit": 1, "time": 8387}, {"y": 61, "x": 336, "screen": 1, "hit": 0, "time": 3787}, {"y": 47, "x": 44, "screen": 1, "hit": 1, "time": 4934}, {"y": 297, "x": 43, "screen": 2, "hit": 1, "time": 23006}, {"y": 281, "x": 28, "screen": 2, "hit": 1, "time": 23966}, {"y": 262, "x": 31, "screen": 2, "hit": 1, "time": 24487}], [{"y": 160, "x": 42, "screen": 0, "hit": 1, "time": 8387}, {"y": 61, "x": 336, "screen": 1, "hit": 0, "time": 3787}, {"y": 47, "x": 44, "screen": 1, "hit": 1, "time": 4934}, {"y": 297, "x": 43, "screen": 2, "hit": 1, "time": 23006}, {"y": 281, "x": 28, "screen": 2, "hit": 1, "time": 23966}, {"y": 262, "x": 31, "screen": 2, "hit": 1, "time": 24487}, {"y": 238, "x": 89, "screen": 2, "hit": 1, "time": 24887}], [{"y": 160, "x": 42, "screen": 0, "hit": 1, "time": 8387}, {"y": 61, "x": 336, "screen": 1, "hit": 0, "time": 3787}, {"y": 47, "x": 44, "screen": 1, "hit": 1, "time": 4934}, {"y": 297, "x": 43, "screen": 2, "hit": 1, "time": 23006}, {"y": 281, "x": 28, "screen": 2, "hit": 1, "time": 23966}, {"y": 262, "x": 31, "screen": 2, "hit": 1, "time": 24487}, {"y": 238, "x": 89, "screen": 2, "hit": 1, "time": 24887}, {"y": 275, "x": 114, "screen": 2, "hit": 1, "time": 25321}], [{"y": 160, "x": 42, "screen": 0, "hit": 1, "time": 8387}, {"y": 61, "x": 336, "screen": 1, "hit": 0, "time": 3787}, {"y": 47, "x": 44, "screen": 1, "hit": 1, "time": 4934}, {"y": 297, "x": 43, "screen": 2, "hit": 1, "time": 23006}, {"y": 281, "x": 28, "screen": 2, "hit": 1, "time": 23966}, {"y": 262, "x": 31, "screen": 2, "hit": 1, "time": 24487}, {"y": 238, "x": 89, "screen": 2, "hit": 1, "time": 24887}, {"y": 275, "x": 114, "screen": 2, "hit": 1, "time": 25321}, {"y": 288, "x": 20, "screen": 2, "hit": 1, "time": 25679}], [{"y": 142, "x": 51, "screen": 0, "hit": 1, "time": 4400}, {"y": 50, "x": 48, "screen": 1, "hit": 1, "time": 2317}, {"y": 269, "x": 38, "screen": 2, "hit": 1, "time": 6355}]]'

jsonDataObject = jsonTestObj // CHANGE- make this query the server to get the json object
//analyzeData(jsonDataObject);
var analytics = analyzeData(jsonDataObject);
//alert("shizzle");
function analyzeData(jsonDataObject) {
	data = jQuery.parseJSON( jsonDataObject );
	console.log(data);
	
	analytics = {};
	analytics['totalClicks'] = 0;
	analytics['totalTime'] = 0;// not currently accurate
	analytics['totalUsers'] = 0;
	analytics['screens'] = 0;
	analytics['totalMistakes'] = 0;
	analytics['heatmapData'] = {max: 100, data: []};
	
	// build screen based list
	for(sx in data) {
		lastTime = 0;
		session = data[sx];
		analytics['totalUsers']+=1;
		//console.log(session);
		for(clk in session) {
			click = session[clk];
			//console.log(click);
			
			analytics['heatmapData']['data'][analytics['totalClicks']] = {x: click['x'], y: click['y'], count: 20}
			
			analytics['totalClicks'] += 1;
			analytics['totalTime'] += click['time']-lastTime;
			lastTime = click['time'];
			
			if(click['hit']==0)
				analytics['totalMistakes']+=1;
			
		}
	}
	
	//console.log(analytics['totalClicks']);
	console.log("total time: " + analytics['totalTime']);
	console.log("total mistakes: " + analytics['totalMistakes']);
	console.log(analytics['heatmapData']);
	return analytics;
}