var jiraDataProxy = require('./jiraDataProxy');

module.exports = {
	getData: function(team, sprint) {
		return jiraDataProxy.getSprintChartData(team, sprint);
	}	
	
};