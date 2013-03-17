var MergeSort = require('./sorting').MergeSort;

module.exports.TeamContainer = TeamContainer;

function TeamContainer()
{
	this.teams = {};
	this.dirty = false;
}

TeamContainer.prototype.addTeam = function(teamName, team)
{

	
	teamName = normalizeTeamName(teamName);
	
	
	this.teams[teamName] = team;
			
}

TeamContainer.prototype.getTeam = function(teamName)
{
	
	teamName = normalizeTeamName(teamName);
	
	if(this.teams[teamName])
	{
		return this.teams[teamName];
	}
	
	else
	{
		var team = {};
		team.name = teamName;
		this.teams[teamName] = team;
		return team;
	}
}

TeamContainer.prototype.GetTeamsWithBetterRank = function(rank)
{
		var teamsBetterRanked = {};
		for(teamIndex in this.teams)
		{
			var team = this.teams[teamIndex];
			
			for(teamRankIndex in team.rankings)
			{
			
				if(team.rankings[teamRankIndex].rank < rank)
				{
					teamsBetterRanked[team.name]=team;
				}
			}
		}
		
		return teamsBetterRanked;
}

TeamContainer.prototype.OrderByRanking = function(teamList, strRanking)
{
	var teamArray = [];
	
	for(team in this.teams)
	{
		teamArray.push(this.teams[team]);
	}
	
	var sortedTeams = MergeSort(teamArray, function(left, right)
	{
		if(!(left.rankings[strRanking]))
		{
			return 1;
		}
		
		if(!(right.rankings[strRanking]))
		{
			return -1;
		}
		
		if(parseInt(left.rankings[strRanking].rank) == parseInt(right.rankings[strRanking].rank))
		{
			return 0;
		}
		else if(parseInt(left.rankings[strRanking].rank) < parseInt(right.rankings[strRanking].rank))
		{
			return -1;
		}
		else
		{
			return 1;
		}
	});
	
	return sortedTeams;
}


function normalizeTeamName(teamName)
{

	var patterns = [
	
		// ["UT Arlington", "Texas Arlington"],
		// ["UT San Antonio", "Texas Arlington"],
		// just do dashes as spaces
		[ /-/, " "],
		[ /=/,""],
		
		// state and saint should be spelled out
		[ /St$/, "State"],
		[ /^St |^St. /, "Saint "],
		
		////// U. and Univ should be "University" /////
		[ /U\.$|Univ/, "University"],
		
		////// directions /////////////////////////////
		[ /^N[\s]/, "North "],
		[ /^S[\s]/, "South "],
		[ /^E[\s]/, "East "],
		[ /^W[\s]/, "West "],
		[ /^Eastern[\s]/, "East "],
		[ /^Western[\s]/, "West "],
		[ /So$/, "Southern"],
		
		//// states ///////////////////////////////////
		[ /FL$/, "Florida"],
		[ /^FL[\s]/, "Florida "],
		[ /^UT[\s]/, "Texas "],
		[ /CA$|Cal\.$/, "California"],
		[ /Tenn State/, "Tennessee"],
		[ /Pa\.$/, "PA"],
		[ /MD$/, "Maryland"],
		[ /^TX/, "Texas"],
		[ /^GA/, "Georgia"],
		[ /^IL/, "Illinois"],
		
		
		////// special cases//////////////////////////
		[ "Xavier Ohio", "Xavier"],
		[ "Stony Brook NY", "Stony Brook"],
		[ "SF Austin", "Stephen F. Austin"],
		[ "Southern California", "USC"],
		[ "VA Commonwealth", "VCU(Va. Commonwealth)"],
		[ /^Kent$/, "Kent State"],
		[ /^G[\s]/, "George "],
		[ /^UCF$/, "Central Florida(UCF)"],
		[ /^WI[\s]/, ""],
		[ "Northwestern LA", "Northwestern State"],
		[ "Col Charleston", "College of Charleston"],
		[ /^Long Island$/, "Long Island University"],
		[ "Grambling State", "Grambling"],
		[ /^Florida Intl$|^Fla. International$/, "Florida International"],
		[ /^South Illinois$/, "Southern Illinois"],
		[ /^Loy[\s]/, "Loyola "],
		[ "Hawai'i", "Hawaii"],
		[ "Mt St Mary's", "Mount St. Mary's"],
		[ "Oakland Mich.", "Oakland"],
		[ /^SC Upstate$/, "USC Upstate"],
		[/\(.*\)/, ""] //removes anything in parenthesis
		
	
	];
	
	for(index in patterns)
	{
		teamName = replaceIfMatch(teamName, patterns[index][0], patterns[index][1]);
	}
	
	teamName = teamName.trim();
	
	return teamName;

}

function replaceIfMatch(string, regex, replaceString)
{
	
	if(string.match(regex))
	{
		string = string.replace(regex, replaceString);
	}
	
	return string;
}

TeamContainer.prototype.CalculateAverageRankings = function()
{

	if(!this.dirty)
	{
		return false;
	}
	
	
	for(thisTeam in this.teams)
	{
		var team = this.teams[thisTeam];
		
		var rankingCount = 0;
		var rankingSum = 0;
		
		for(ranking in team.rankings)
		{
			if(ranking !== 'Average')
			{
				rankingSum = rankingSum + parseInt(team.rankings[ranking].rank);
				rankingCount++;
			}
		}
		
		
		team.rankings.Average = team.rankings.Average || {};
		
		team.rankings.Average.name = "Average";
		team.rankings.Average.rank = (rankingSum/rankingCount);
	}
	
	this.dirty= false;
}
