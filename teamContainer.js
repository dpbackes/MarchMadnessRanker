var util = require('util');
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
			
				if(teamRankIndex !== 'Average' && teamRankIndex !=='StandardDev')
				{
			
					if(team.rankings[teamRankIndex].rank < rank)
					{
						teamsBetterRanked[team.name]=team;
					}
				}
			}
		}
		
		return teamsBetterRanked;
}

TeamContainer.prototype.OrderByRanking = function(teamList, strRanking)
{
	var teamArray = [];
	
	
	for(team in teamList)
	{
		teamArray.push(teamList[team]);
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
		
		if(parseFloat(left.rankings[strRanking].rank) == parseFloat(right.rankings[strRanking].rank))
		{
			return 0;
		}
		else if(parseFloat(left.rankings[strRanking].rank) < parseFloat(right.rankings[strRanking].rank))
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


	var show = false;

	var patterns = [
	
		// ["UT Arlington", "Texas Arlington"],
		// ["UT San Antonio", "Texas Arlington"],
		// just do dashes as spaces
		[ /-/, " "],
		[ /=/,""],
		
		// state and saint should be spelled out
		[ /St$|St\.$/, "State"],
		[ /^St |^St\. /, "Saint "],
		
		////// U. and Univ should be "University" /////
		[ /U\.$|Univ/, "University"],
		
		////// directions /////////////////////////////
		[ /^N[\s]/, "North "],
		[ /^S[\s]/, "South "],
		[ /^E[\s]/, "East "],
		[ /^W[\s]/, "West "],
		[ /^Eastern[\s]/, "East "],
		[ /^Western[\s]/, "West "],
		[ /So$|S\.$/, "Southern"],
		[/^West\./, 'West'],
		
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
		[/^Fla/, 'Florida'],
		[/Ill\.$/, 'Illinois'],
		[/^Ark\.|^Ark|^AR/, "Arkansas"],
		
		
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
		[ /^SC Upstate$|^USC Upstate$/, "South Carolina Upstate"],
		[ /\(FL\)$/, 'Florida'],
		[ /\(OH\)$/, 'Ohio'],
		[/^N\.C\./, "NC"],
		[/^Loyola Marymnt$/, 'Loyola Marymount'],
		[/Florida\./, 'Florida'],
		[/Intl\.$/, 'International'],
		[/^South\. Methodist$/, 'SMU'],
		[/^Loyola \(MD\)$/, "Loyola Maryland"],
		[/^Loyola \(IL\)$/, "Loyola Chicago"],
		[/^Geo\./, "George"],
		[/^Charleston$/, "College of Charleston"],
		[/^Wisc\. Green Bay$/, "Green Bay"],
		[/^Cal Poly$/, "Cal Poly SLO"],
		[/^Albany$/, "Albany NY"],
		[/^Brigham Young$/, "BYU"],
		[/^Saint Joseph's$/, "Saint Joseph's PA"],
		[/^Middle Tenn\. State$/, "Middle Tennessee"],
		[/^Saint Mary's$/, "Saint Mary's California"],
		[/^Central Conn. State$|^Central Conn$/, "Central Connecticut State"],
		[/\(.*\)/, ""] //removes anything in parenthesis
		
	
	];
	
	for(index in patterns)
	{
		teamName = replaceIfMatch(teamName, patterns[index][0], patterns[index][1]).trim();
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

TeamContainer.prototype.DoCalculatedRankings = function()
{
	if(!this.dirty)
	{
		return;
	}
	
	this.CalculateAverageRankings();
	this.CalculateStandardDeviation();
	
	this.dirty = false;
}

TeamContainer.prototype.CalculateAverageRankings = function()
{
	
	
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
		team.rankings.Average.rank = parseFloat(rankingSum/rankingCount).toFixed(2);
	}
}

TeamContainer.prototype.CalculateStandardDeviation = function()
{
	for(thisTeam in this.teams)
	{
		var team = this.teams[thisTeam];
		
		var rankingCount = 0;
		var rankingDiff = 0;
		
		for(ranking in team.rankings)
		{
			if(ranking !== 'Average' && ranking !== 'StandardDev')
			{
				var avDiff = parseFloat(team.rankings[ranking].rank) - parseFloat(team.rankings['Average'].rank);
				var avDiffSq = Math.pow(avDiff, 2);
				
				rankingDiff = rankingDiff + avDiffSq;
				rankingCount++;
			}
		}
		team.rankings.StandardDev = team.rankings.StandardDev || {};
		
		team.rankings.StandardDev.name = "StandardDev";
		team.rankings.StandardDev.rank = Math.sqrt((rankingDiff/(rankingCount-1))).toFixed(2);
	}
}
