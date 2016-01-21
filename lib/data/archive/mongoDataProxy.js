var MongoClient = require('mongodb').MongoClient,
	_ = require('underscore');

<<<<<<< HEAD
//var mongoConnection = 'mongodb://localhost:27017/nero';
var mongoConnection = 'mongodb://chelmdbgis010.karmalab.net:27070/nero';

var teamList = [];

function getBoardIdByTeam(team) {
    
};
=======
//var mongoConnection = 'mongodb://bitnami:jqwWqeLTjL5A@localhost:27017/nero';
var mongoConnection = 'mongodb://chelmdbgis010.karmalab.net:27070/nero';
var teamList = [];
var sprintList = [];
>>>>>>> 54864722d4759bbfaeaa1e3545a8a9b9e8f763c9
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
    // getTeamList : function(callback) {
    //     callback(null, ['Alliance', 'Orca', 'Venetian', 'Spartans']);
    // },
<<<<<<< HEAD
    // //this too
    // getSprintList : function(callback) {
    //     callback(null, [78, 77, 76, 75, 74]);
    // },

	getTeamList: function(callback) {
			MongoClient.connect(mongoConnection, function(err, db) {
				if (err) throw err;
            
                //var teamList = [];

=======
    //this too
    getSprintList : function(callback) {
        callback(null, [78, 77, 76, 75, 74]);
    },


	getTeamList: function(callback) {
			MongoClient.connect(mongoConnection, function(err, db) {
				if (err) throw err;
            
                teamList = [];

>>>>>>> 54864722d4759bbfaeaa1e3545a8a9b9e8f763c9
                var teams = db.collection('teams').find();
                teams.each(function(err, team) {
                    if (err) callback(err, null);
                    
                    if(team != null) {
                        teamList.push(team)
                    }
                    else {
<<<<<<< HEAD
                        var teamNameList = teamList.map(function(team) {
                            return team.name;
                        });
                        
                        callback(null, teamNameList);
=======
                        // var teamNameList = teamList.map(function(team) {
                        //     return team.name;
                        // });
                        
                        callback(null, teamList);
>>>>>>> 54864722d4759bbfaeaa1e3545a8a9b9e8f763c9
                    }
                        
                    });
                })
<<<<<<< HEAD
            },
                
        

	getSprintList: function(team, callback) {
			MongoClient.connect(mongoConnection, function(err, db) {
				if (err) throw err;
                var boardId = getBoardIdByTeam(team);
				var sprints = db.collection('sprints').find({"boardId": boardId});
                sprints.each(function(err, sprint) {
					if (err) callback(err, null);                    

                    var sprintList = [];
                    if(sprint != null) {
                        var thisSprint = {};
                        thisSprint.name = sprint.name;
                        thisSprint.startDate = sprint.startDate;
                        thisSprint.endDate = sprint.endDate;
                        
                        sprintList.push(thisSprint);
                    } else {
                        if (sprintList.length === 0) {
                            callback('Sprint list data not found.');
                            return;
                        } else {
                            var sprintNameList = sprintList.map(function(sprint) {
                                return sprint.name;
                            });
                        }
                        callback(null, sprintNameList);
                    }
				});
			});
		}
    }
=======
            }

    // getSprintList: function(teamId, callback) {
	// 		MongoClient.connect(mongoConnection, function(err, db) {
	// 			if (err) throw err;

	// 			var sprints = db.collection('sprints').find({"originBoardId": teamId});
    //             sprints.each(function(err, sprint) {
	// 				if (err) callback(err, null);                    

    //                 var sprintList = [];
    //                 if(sprint != null) {
    //                     var thisSprint = {};
    //                     thisSprint.name = sprint.name;
    //                     thisSprint.startDate = sprint.startDate;
    //                     thisSprint.endDate = sprint.endDate;
                        
    //                     sprintList.push(thisSprint);
    //                 } else {
    //                     if (sprintList.length === 0) {
    //                         callback('Sprint list data not found.');
    //                         return;
    //                     } else {
    //                         var sprintNameList = sprintList.map(function(sprint) {
    //                             return sprint.name;
    //                         });
    //                     }
    //                     callback(null, sprintNameList);
    //                 }
	// 			});
	// 		});
	// 	}
    // }

>>>>>>> 54864722d4759bbfaeaa1e3545a8a9b9e8f763c9

