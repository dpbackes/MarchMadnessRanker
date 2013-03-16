
/*
 * GET home page.
 */

exports.index = function(teamData)
{
	console.log(JSON.stringify(teamData));

	return function(req, res){
		res.render('index', { title: 'March Madness Ranker', teams: teamData});
	};
};