var http = require('http');

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
		if(strLine.match('^([\\s]*[\\d])'))
		{
			console.log(strLine);
		}
	}
}