module.exports.TeamContainer = TeamContainer;

function TeamContainer()
{
	this.teams = {};
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
			//console.log("Team: "+ team);
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
