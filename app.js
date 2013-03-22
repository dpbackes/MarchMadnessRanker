
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
  
  
  var TeamContainer = require('./teamContainer').TeamContainer;
  
  
  
   
var teams = new TeamContainer();

var sagarin = require('./lib/scrapers/sagarin')(teams);
var massey = require('./lib/scrapers/massey')(teams);
var rpi = require('./lib/scrapers/rpi')(teams);
var self = require('./lib/scrapers/self')(teams);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.locals.pretty = true;
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res)
{
	res.redirect('/ByRanking/Sagarin');
});

app.get('/ByRanking/:rankingName', function(req, res)
{
	
	var ct = {};
	var dc = false;
	
	
	ct = {};
	
	for(team in req.query)
	{
		dc = true;
		ct[team] = teams.getTeam(team);
	}
	
	ct = teams.OrderByRanking(ct, req.params.rankingName);
	teams.DoCalculatedRankings();
	res.render('index', { 
			title: 'March Madness Ranker', 
			teams: teams.OrderByRanking(teams.GetTeamsWithBetterRank(200), req.params.rankingName), 
			rankings: ['Sagarin', 'Self', 'RPI', 'Average', 'StandardDev'], 
			compareTeams: ct, 
			doCompare: dc,
			queryString: req._parsedUrl.search || ""
	});

});


app.get('/all', function(req, res)
{
	res.render('index', { 
			title: 'March Madness Ranker', 
			teams: teams.OrderByRanking(teams.GetTeamsWithBetterRank(400), req.params.rankingName), 
			rankings: ['Sagarin', 'Self', 'RPI', 'Average', 'StandardDev'], 
			compareTeams: [], 
			doCompare: false,
			queryString: ""
	});
});


app.get('/debug', function(req, res)
{

	teams.CalculateAverageRankings();
	
	res.send(JSON.stringify(teams.OrderByRanking(teams.GetTeamsWithBetterRank(200), 'Sagarin'), null, 1));
});

app.get('/json', function(req, res)
{
	teams.CalculateAverageRankings();
	res.send(JSON.stringify(teams.teams));
});
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
