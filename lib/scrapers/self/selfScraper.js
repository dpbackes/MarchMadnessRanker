var http = require('https');

module.exports = function(teams)
{

	teams = teams || [];

	var options = {
	  host: 'raw.github.com',
	  path: '/jeffself/collegebasketballrankings/master/cbrank2013.txt'
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
		
		var lines = data.split('\n');
		
		//all the teams are in the parameter "DI"
		
		for(teamIndex in lines)
		{
			
			//most of the line is delimited by multiple whitespace characters
			var tokens = lines[teamIndex].split(/[\s][\s][\s]/);
			
			//however, the rank and team name are separated by a single space
			//so, right now, the zeroth item in tokens is the rank and the team
			//name
			
			tokens[0] = tokens[0].replace(/^[\s]*/, "");
			var rank = tokens[0].split(/[\s]/, 1)[0];
			var teamName = tokens[0].substring(tokens[0].indexOf(" "), tokens[0].length).trim();
			
			if(teamName !== "")
			{
				
				var team = teams.getTeam(teamName);
				
				team.rankings = team.rankings || {};
				
				team.rankings.Self = team.rankings.Self || {};
				
				team.rankings.Self.name = "Self";
				team.rankings.Self.rank = rank;
			}			
		}		
	}
}