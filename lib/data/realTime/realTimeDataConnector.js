var jiraDataProxy = require('./jiraDataProxy');

module.exports = {
	getData: function(team, sprint, callback) {
        return jiraDataProxy.getSprints(1443, callback);
		//return jiraDataProxy.getSprintChartData(team, sprint);
	}	
	
};