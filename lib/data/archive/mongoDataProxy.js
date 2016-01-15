var MongoClient = require('mongodb').MongoClient,
	_ = require('underscore');

var mongoConnection = 'mongodb://localhost:27017/nero';
//var mongoConnection = 'mongodb://chelmdbgis011.karmalab.net:27080/nero';

module.exports = {
	getTeamSprintData: function(team, sprint, callback) {
		if (!team || !sprint) {
			callback('no team or sprint');
			return;
		}
        var returnData;
        if (sprint === "76" && team === 'Orca') {
			returnData =  [50, 10, 21, 10, 12, 10, 10, 8, 7, 6, 3, 2, 1, 40];
		} else {
			returnData = [0, 15, 235, 13, 98, 42, 17, 33, 141, 6, 3, 2, 36, 40];
		}
        callback(null, returnData);
		// MongoClient.connect(mongoConnection, function(err, db) {
		// 	if (err) throw err;
		// 	db.collection('TeamSprintBurndowns').findOne({ 'team': team }, function(err, doc) {
		// 		if (err) throw err;
		// 		if (!doc) {
		// 			callback('Team not found.');
		// 			return;
		// 		};
		// 		var sprintData = _.find(doc.sprintBurndowns, function(el) {
		// 			return el.sprint === sprint;
		// 		});
		// 		if (sprintData) {
		// 			callback(null, sprintData.sprintBurndowns);
		// 		} else {
		// 			callback('Sprint not found.');
		// 		};
		// 	});
		// });
	},

//remember this is going to be async
    getTeamList : function(callback) {
        callback(null, ['Alliance', 'Orca', 'Venetian', 'Spartans']);
    },
    //this too
    getSprintList : function(callback) {
        callback(null, [78, 77, 76, 75, 74]);
    }

	// getTeamList: function(callback) {
	// 		MongoClient.connect(mongoConnection, function(err, db) {
	// 			if (err) throw err;
	// 			db.collection('Options').find({"optionCategory":"team"},function(err, doc) {
	// 				if (err) throw err;
	// 				if (!doc) {
	// 					callback('Team list data not found.');
	// 					return;
	// 				}

	// 				/// TODO start here!!!!
	// 				return doc.options;
	// 			});
	// 		});
	// 	},

	// getSprintList: function(callback) {
	// 		MongoClient.connect(mongoConnection, function(err, db) {
	// 			if (err) throw err;
	// 			db.collection('Options').find({"optionCategory": "sprint"}, function(err, doc) {
	// 				if (err) throw err;
	// 				if (!doc) {
	// 					callback('Sprint list data not found.');
	// 					return;
	// 				}

	// 				/// TODO start here!!!!
	// 				return doc.options;
	// 			});
	// 		});
	// 	}

};
