var http = require('http');

module.exports = function(teams)
{

	teams = teams || [];
	
	//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	var options = {
	  host: 'realtimerpi.com',
	  path: '/rpi_Men.html'
	};

	callback = function(response) {
	  var str = '';

	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
		str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
		ParseAsString(str);
		
	  });
	}

	http.request(options, callback).end();

	function ParseAsString(data)
	{
	
		teams.dirty = true;
		
		var tableString = data.match(/<table width="468" cellpadding="0" cellspacing="1" border="0">/);
		
		var lines = data.split('\n');
		for(lineIndex in lines)
		{
			var strLine = lines[lineIndex];
			
			//data lines start with some number of whitespace characters
			//and then a digit
			if(strLine.match(/^<tr><td align=right>.*<\/td><\/tr>$/))
			{
			
				//remove the html tags
				strLine = strLine.replace(/<(?:.|\n)*?>/gm, '');				
				
				
				//the data columns are mostly delimited &nbsp;,
				//so we'll split on that and then index into the array
				//to get teh data we want
				var spaceSplit = strLine.split(/&nbsp;/);
				
				//the above regex could be written better so that we don't 
				//get a bunch of empty strings in the array, but since I'm bad
				//at regex, I'll just remove them with brute force
				spaceSplit = RemoveEmptyStringsFromArray(spaceSplit);
								
				var teamName = spaceSplit[1].trim();
				
				var team = teams.getTeam(teamName);
				
				team.rankings = team.rankings || {};
				
				team.rankings.RPI = team.rankings.RPI || {};
				
				team.rankings.RPI.name = "RPI";
				team.rankings.RPI.rank  = spaceSplit[0].trim();
				team.rankings.RPI.rating = spaceSplit[3].trim();
				
			}
		}
	}

	function RemoveEmptyStringsFromArray(array)
	{
		var newArray = [];
		for(index in array)
		{
			if(array[index] != '')
			{
				newArray.push(array[index]);
			}
		}
		
		return newArray;
	}
}