var analytics;
var heatMaps = new Array();

$(document).ready(function() {
  $.getJSON('http://www.tryquirk.com/api/' + privateKey + '/getresponses/', function(data) {
  		analytics = analyzeData(data);

	  $.getJSON('http://www.tryquirk.com/api/getTaskPrivate/' + privateKey, function(data) {
		$.each(data, function(key, val) {
			if (key == 0) {
				$('.infoBox h1').html('Task: ' + val);
			} else {
				$('#main').append('<div id="' + key + '" class="screenWide"><div id="' + key + 'heatmap" class="left"></div><div class="right"><h2>Average Number of Mistakes</h2><p class="avgMistakes"><p><h2>Average Time Taken</h2><p class="avgTime"><p></div></div>')
				$('#' + key + 'heatmap').css('background-image', 'url("' + val[0] + '")');
				heatMaps[key-1] = h337.create( {"element":document.getElementById(key + "heatmap"), "radius":50, "visible":true});
				heatMaps[key-1].store.setDataSet(analytics['heatmapData']);
			}
		});
		showIndividualData();
	  });

  });

function analyzeData(data) {
	
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

	$('#main .infoBox') = analytics[totalUsers];
	$('#main .infoBox') = ' / ' + analytics[avgTotalMistakes];
	
	console.log(analytics);
	return analytics;
}

function showIndividualData() {
	analytics['avgTotalTime'] = analytics['totalTime'] / analytics['totalUsers'];
	analytics['avgTotalMistakes'] = analytics['totalMistakes'] / analytics['totalUsers'];
	analytics['totalHitPercentage'] = (analytics['totalClicks']-analytics['totalMistakes'])/analytics['totalClicks'];
	i = 0;
	analytics['avgScreenMistakes'] = [];
	for(mistakes in analytics['screenMistakes']) {
		analytics['avgScreenMistakes'][i] = (analytics['screenMistakes'][mistakes])/analytics['totalUsers'];
		i+=1;
	}

	for(i=1; i<=analytics['avgScreenMistakes'].length; i++) {
		$('#' + i + ' .avgMistakes').html(analytics['avgScreenMistakes'][i-1]);
	}

	for(n=1; n<=analytics['avgScreenMistakes'].length; n++) {

	}
}

});