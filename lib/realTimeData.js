var jiraData = require('./jiraData');

module.exports = {
	getData: function(team, sprint) {
		return jiraData.getSprintChartData(team, sprint);
	}	
	
};