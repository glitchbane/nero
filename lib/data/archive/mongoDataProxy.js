var MongoClient = require('MongoDb').MongoClient,
	_ = require('underscore');

//var mongoConnection = 'mongodb://localhost:27017/nero';
var mongoConnection = 'mongodb://chelmdbgis011.karmalab.net:27080/nero';

module.exports = {
	getTeamSprintData: function(team, sprint, callback) {
		if (!team || !sprint) {
			callback('no team or sprint');
			return;
		}
		MongoClient.connect(mongoConnection, function(err, db) {
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
	},
	
	getTeamList: function(callback) {
			MongoClient.connect(mongoConnection, function(err, db) {
				if (err) throw err;
				db.collection('options').find({"type":"team"},function(err, doc) {
					if (err) throw err;
					if (!doc) {
						callback('Team list data not found.');
						return;
					}
					
					/// TODO start here!!!!
					return doc.data;			
				});
			});
		},
		
	getSprintList: function(callback) {
			MongoClient.connect(mongoConnection, function(err, db) {
				if (err) throw err;
				db.collection('options').find({"type": "sprint"}, function(err, doc) {
					if (err) throw err;
					if (!doc) {
						callback('Sprint list data not found.');
						return;
					}
					
					/// TODO start here!!!!
					return doc.data;			
				});
			});
		}
		
			
		
	
};
