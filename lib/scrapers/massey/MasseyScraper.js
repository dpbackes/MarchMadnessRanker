var http = require('http');

module.exports = function(teams)
{

	teams = teams || [];
	
	//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	var options = {
	  host: 'masseyratings.com',
	  path: '/ratejson.php?soid=193573&suboid=11590&mid=1&conf=0'
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
		
		var jsonResult = JSON.parse(data);
		
		//all the teams are in the parameter "DI"
		
		for(teamIndex in jsonResult.DI)
		{
			var masseyTeam = jsonResult.DI[teamIndex];
			
			var teamName = masseyTeam[0][0];
			
			//get the team
			
			var team = teams.getTeam(teamName);
			
			team.rankings = team.rankings || {};
			
			team.rankings.Massey = team.Massey || {};
			
			team.rankings.Massey.rank = masseyTeam[3][0];
		}		
	}
}