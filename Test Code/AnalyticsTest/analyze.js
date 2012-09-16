// example of returned json object, needing to be parsed.
jsonTestObjOLD = '[[{"y": 160, "x": 42, "screen": 0, "hit": 1, "time": 8387}, {"y": 61, "x": 336, "screen": 1, "hit": 0, "time": 3787}, {"y": 47, "x": 44, "screen": 1, "hit": 1, "time": 4934}, {"y": 297, "x": 43, "screen": 2, "hit": 1, "time": 23006}], [{"y": 160, "x": 42, "screen": 0, "hit": 1, "time": 8387}, {"y": 61, "x": 336, "screen": 1, "hit": 0, "time": 3787}, {"y": 47, "x": 44, "screen": 1, "hit": 1, "time": 4934}, {"y": 297, "x": 43, "screen": 2, "hit": 1, "time": 23006}, {"y": 281, "x": 28, "screen": 2, "hit": 1, "time": 23966}], [{"y": 160, "x": 42, "screen": 0, "hit": 1, "time": 8387}, {"y": 61, "x": 336, "screen": 1, "hit": 0, "time": 3787}, {"y": 47, "x": 44, "screen": 1, "hit": 1, "time": 4934}, {"y": 297, "x": 43, "screen": 2, "hit": 1, "time": 23006}, {"y": 281, "x": 28, "screen": 2, "hit": 1, "time": 23966}, {"y": 262, "x": 31, "screen": 2, "hit": 1, "time": 24487}], [{"y": 160, "x": 42, "screen": 0, "hit": 1, "time": 8387}, {"y": 61, "x": 336, "screen": 1, "hit": 0, "time": 3787}, {"y": 47, "x": 44, "screen": 1, "hit": 1, "time": 4934}, {"y": 297, "x": 43, "screen": 2, "hit": 1, "time": 23006}, {"y": 281, "x": 28, "screen": 2, "hit": 1, "time": 23966}, {"y": 262, "x": 31, "screen": 2, "hit": 1, "time": 24487}, {"y": 238, "x": 89, "screen": 2, "hit": 1, "time": 24887}], [{"y": 160, "x": 42, "screen": 0, "hit": 1, "time": 8387}, {"y": 61, "x": 336, "screen": 1, "hit": 0, "time": 3787}, {"y": 47, "x": 44, "screen": 1, "hit": 1, "time": 4934}, {"y": 297, "x": 43, "screen": 2, "hit": 1, "time": 23006}, {"y": 281, "x": 28, "screen": 2, "hit": 1, "time": 23966}, {"y": 262, "x": 31, "screen": 2, "hit": 1, "time": 24487}, {"y": 238, "x": 89, "screen": 2, "hit": 1, "time": 24887}, {"y": 275, "x": 114, "screen": 2, "hit": 1, "time": 25321}], [{"y": 160, "x": 42, "screen": 0, "hit": 1, "time": 8387}, {"y": 61, "x": 336, "screen": 1, "hit": 0, "time": 3787}, {"y": 47, "x": 44, "screen": 1, "hit": 1, "time": 4934}, {"y": 297, "x": 43, "screen": 2, "hit": 1, "time": 23006}, {"y": 281, "x": 28, "screen": 2, "hit": 1, "time": 23966}, {"y": 262, "x": 31, "screen": 2, "hit": 1, "time": 24487}, {"y": 238, "x": 89, "screen": 2, "hit": 1, "time": 24887}, {"y": 275, "x": 114, "screen": 2, "hit": 1, "time": 25321}, {"y": 288, "x": 20, "screen": 2, "hit": 1, "time": 25679}], [{"y": 142, "x": 51, "screen": 0, "hit": 1, "time": 4400}, {"y": 50, "x": 48, "screen": 1, "hit": 1, "time": 2317}, {"y": 269, "x": 38, "screen": 2, "hit": 1, "time": 6355}]]'

jsonTestObj = '[[{"y": 88, "x": 246, "screen": 0, "hit": 0, "time": 15549}, {"y": 305, "x": 264, "screen": 0, "hit": 0, "time": 16412}, {"y": 24, "x": 289, "screen": 0, "hit": 0, "time": 17580}, {"y": 81, "x": 41, "screen": 0, "hit": 1, "time": 18780}, {"y": 84, "x": 266, "screen": 1, "hit": 0, "time": 6674}, {"y": 340, "x": 187, "screen": 1, "hit": 0, "time": 9106}, {"y": 20, "x": 44, "screen": 1, "hit": 1, "time": 11257}, {"y": 304, "x": 135, "screen": 2, "hit": 0, "time": 21087}, {"y": 151, "x": 22, "screen": 2, "hit": 1, "time": 22445}], [{"y": 144, "x": 64, "screen": 0, "hit": 1, "time": 3376}, {"y": 43, "x": 60, "screen": 1, "hit": 1, "time": 2441}, {"y": 275, "x": 54, "screen": 2, "hit": 1, "time": 4303}]]';

jsonDataObject = jsonTestObj // CHANGE- make this query the server to get the json object
//analyzeData(jsonDataObject);
var analytics = analyzeData(jsonDataObject);
//alert("shizzle");
function analyzeData(jsonDataObject) {
	data = jQuery.parseJSON( jsonDataObject );
	console.log(data);
	
	analytics = {};
	analytics['totalClicks'] = 0;
	analytics['totalTime'] = 0; // test accuracy
	analytics['totalUsers'] = 0;
	analytics['screens'] = 0;
	analytics['totalMistakes'] = 0;
	analytics['heatmapData'] = {max: 100, data: []};
	analytics['screenMistakes'] = [];
	analytics['screenTime'] = [];
	
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
			timeDiff = click['time']-lastTime
			analytics['totalTime'] += timeDiff;
			
			if(isNaN(analytics['screenTime'][click['screen']])){analytics['screenTime'][click['screen']] = 0;}
			analytics['screenTime'][click['screen']] += timeDiff;
			
			lastTime = click['time'];
			
			if(click['hit']==0) {
				analytics['totalMistakes']+=1;
				if(isNaN(analytics['screenMistakes'][click['screen']])){analytics['screenMistakes'][click['screen']] = 0;}
				analytics['screenMistakes'][click['screen']] += 1;
			}
			if((click['screen']+1)>analytics['screens'])
				analytics['screens'] = click['screen']+1;
			
		}
	}
	
	// compute aggregate fields:
	analytics['avgTotalTime'] = analytics['totalTime'] / analytics['totalUsers'];
	analytics['avgTotalMistakes'] = analytics['totalMistakes'] / analytics['totalUsers'];
	analytics['totalHitPercentage'] = (analytics['totalClicks']-analytics['totalMistakes'])/analytics['totalClicks'];
	i = 0;
	analytics['avgScreenMistakes'] = [];
	for(mistakes in analytics['screenMistakes']) {
		analytics['avgScreenMistakes'][i] = (analytics['screenMistakes'][mistakes])/analytics['totalUsers'];
		i+=1;
	}
	
	//console.log(analytics['totalClicks']);
	console.log(analytics);
	return analytics;
}