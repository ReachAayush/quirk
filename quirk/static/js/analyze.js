var analytics;

$(document).ready(function() {
  $.getJSON('http://quirk-quirk.dotcloud.com/api/' + privateKey + '/getresponses/', function(data) {
  		analytics = analyzeData(data);
	});
});

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
		analytics['avgScreenMistakes'][i] = mistakes/analytics['totalUsers'];
		i+=1;
	}
	
	//console.log(analytics['totalClicks']);
	console.log(analytics);
	return analytics;
}