var http = require('http');
var htmlparser = require("htmlparser");

/////////////////////////////////
// parser setup
/////////////////////////////////

var handler = new htmlparser.DefaultHandler(function (error, dom) {
    if (error)
	{
        console.log("Parsing error: %j", error);
	}        
});


var parser = new htmlparser.Parser(handler);



//////// End Parser Setup ///////

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
	
	parser.parseChunk(chunk);
	
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
	parser.done();
	//console.log(JSON.stringify(handler.dom, null, 1));
    console.log(str);
  });
}

http.request(options, callback).end();