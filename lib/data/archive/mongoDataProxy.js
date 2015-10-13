var MongoClient = require('MongoDb').MongoClient,
	_ = require('underscore');

module.exports = {
	getTeamSprintData: function(team, sprint, callback) {
		if (!team || !sprint) {
			callback('no team or sprint');
			return;
		}
		MongoClient.connect('mongodb://localhost:27017/nero', function(err, db) {
			if (err) throw err;
			db.collection('teamData').findOne({ 'name': team }, function(err, doc) {
				if (err) throw err;
				if (!doc) {
					callback('Team not found.');
					return;
				}
				var sprintData = _.find(doc.data, function(el) {
					return el.sprint === sprint;
				});
				if (sprintData) {
					callback(null, sprintData.data);
				} else {
					callback('Sprint not found.');	
				}				
			});
		});
	}
};
