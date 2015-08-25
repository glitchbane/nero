var MongoClient = require('MongoDb').MongoClient;

module.exports = {
	getTeamSprintData: function(team, sprint) {
		if (sprint === 62){
			return [0, 10, 21, 10, 12, 10, 10, 8, 7, 6, 3, 2, 1, 40];
		}
		else {
			return [0, 15, 235, 13, 98, 42, 17, 33, 141, 6, 3, 2, 36, 40];
		}
	}
};
