var http = require('http');

module.exports.teams = [];

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

	//this will contain the team data.
	//we'll populated as it is parsed
	var teams = module.exports.teams;
	
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
			
			var whitespacesplit = strLine.split(/[\s][\s]/);
			
			whitespacesplit = RemoveEmptyStringsFromArray(whitespacesplit);
						
			//console.log(JSON.stringify(whitespacesplit, null, 1));
			
			var team = {};
			
			team.rank = whitespacesplit[0].trim();
			team.name = whitespacesplit[1];
			 
			teams.push(team);
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