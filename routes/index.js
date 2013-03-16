
/*
 * GET home page.
 */

exports.index = function(teamDataFunction, teamDataParam)
{

	return function(req, res){
		res.render('index', { title: 'March Madness Ranker', teams: teamDataFunction(teamDataParam)});
	};
};