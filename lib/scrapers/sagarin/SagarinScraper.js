var http = require('http');

module.exports = function(teams)
{

	teams = teams || [];
	
	//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	var options = {
	  host: 'usatoday30.usatoday.com',
	  path: '/sports/sagarin/bkt1213.htm'
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
		
		var lines = data.split('\n');
		for(lineIndex in lines)
		{
			var strLine = lines[lineIndex];
			
			
			
			//data lines start with some number of whitespace characters
			//and then a digit
			if(strLine.match(/^([\s]*[\d])/))
			{
				//remove the html tags
				strLine = strLine.replace(/<(?:.|\n)*?>/gm, '');
				
				//the data columns are mostly delimited by whitespace,
				//so we'll split on that and then index into the array
				//to get teh data we want
				var whitespacesplit = strLine.split(/[\s][\s]/);
				
				//the above regex could be written better so that we don't 
				//get a bunch of empty strings in the array, but since I'm bad
				//at regex, I'll just remove them with brute force
				whitespacesplit = RemoveEmptyStringsFromArray(whitespacesplit);
								
				var teamName = whitespacesplit[1];
				
				var team = teams.getTeam(teamName);
				
				team.rankings = team.rankings || {};
				
				
				
				team.rankings.Sagarin = team.Sagarin || {};
				
				team.rankings.Sagarin.name = "Sagarin";
				team.rankings.Sagarin.rank  = whitespacesplit[0].trim();
				team.rankings.Sagarin.rating = whitespacesplit[3].trim();
				
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