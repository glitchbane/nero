var MongoClient = require('mongodb').MongoClient,
	_ = require('underscore'),
    // mongoConnection = 'mongodb://localhost:27017/nero';
    mongoConnection = 'mongodb://chelmdbgis010.karmalab.net:27070/nero',

    getLatestStoredSprint = function (boardId) {
        MongoClient.connect(mongoConnection, function (err, db) {
            var options = [{ 'limit' : 1 },{sort: -1}];

            if (err) {
                throw err
            };

            db.collection('sprints').findOne({"originBoardId": boardId}, options, function (err, latestSprint) {
                return err || latestSprint;
            })
        })
    }



module.exports = {
    getTeamList: function (callback) {
        var teams,
            teamList = [];

        MongoClient.connect(mongoConnection, function (err, db) {
            if (err) {
                throw err
            };

            teams = db.collection('teams').find();
            teams.each (function (err, team) {
                if (err) {
                    callback(err, null);
                }

                if (team != null) {
                    teamList.push(team)
                } else {
                    callback(null, teamList);
                }
            });
        });
    },

    storeTeams: function (teamList) {
        if (teamList.length > 0) {
            MongoClient.connect(mongoConnection, function (err, db) {
                db.collection('teams').insert(teamList, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    db.close();
                });
            });
        }
    },

    getTeamSprintList: function (boardId, callback) {
        MongoClient.connect(mongoConnection, function (err, db) {
            var sprints,
                sprintList,
                thisSprint,
                sprintNameList = [];

            if (err) {
                throw err;
            }

            sprints = db.collection('sprints').find({"originBoardId": boardId});
            sprints.each(function (err, sprint) {
                if (err) {
                    callback(err, null);
                }

                sprintList = [];
                if (sprint != null) {
                    thisSprint = {};
                    thisSprint.name = sprint.name;
                    thisSprint.startDate = sprint.startDate;
                    thisSprint.endDate = sprint.endDate;

                    sprintList.push(thisSprint);
                } else {
                    if (sprintList.length === 0) {
                        callback('Sprint list data not found.');
                        return;
                    } else {
                        sprintNameList = sprintList.map(function (sprint) {
                            return sprint.name;
                        });
                    }
                    callback(null, sprintNameList);
                }
            });
        });
    },

    getSprintBurndown: function (sprintId, callback) {
        MongoClient.connect(mongoConnection, function (err, db) {
            db.collection('burndowns').findOne({'sprintId': sprintId}, function (err, burndown) {
                if (err) {
                    throw err;
                }
                if (!burndown) {
                    callback('not found');
                    return
                }

                callback(null, burndown);
            })
        })
    },

    storeBurndown: function (sprintId, burndown) {
        var sprintBurndown = {};
        sprintBurndown.sprintId = sprintId;
        sprintBurndown.data = burndown;
        MongoClient.connect(mongoConnection, function (err, db) {
            db.collection('burndowns').insert(sprintBurndown, function (err, result) {
                if (err) {
                    throw err;
                }
                db.close();
            });
        });
    },

    getSprint: function (sprintId, callback) {
        MongoClient.connect(mongoConnection, function (err, db) {
            if (err) {
                throw err;
            }

            db.collection('sprints').findOne({"id": parseInt(sprintId, 10)}, function (err, sprint) {
                if (err) {
                    callback(err);
                }
                callback(null, sprint);
            });
        });
    },

    getSprints: function (boardId, callback) {
        MongoClient.connect(mongoConnection, function (err, db) {
            var sprintList = [],
                sprints;
            if (err) {
                throw err;
            }

            sprints = db.collection('sprints').find({"originBoardId": parseInt(boardId, 10)});
            sprints.each(function (err, sprint) {
                if (err) {
                    callback(err, null);
                }

                if (sprint != null) {
                    sprintList.push(sprint);
                } else {
                    if (sprintList.length === 0) {
                        callback('Sprint list data not found.');
                        return;
                    }
                    callback(null, sprintList);
                }
            });
        });
    },

    storeSprints: function (boardId, sprintsFromRealTime) {
        var latestRealtimeSprint,
            newSprints,
            latestStoredSprint = getLatestStoredSprint(boardId),
            lastStartDateStored = new Date('1/1/1900');
        if (latestStoredSprint) {
            lastStartDateStored = new Date(latestStoredSprint.startDate);
        }

        latestRealtimeSprint = sprintsFromRealTime[(sprintsFromRealTime.length) - 1];

        if (new Date(latestRealtimeSprint.startDate) > lastStartDateStored) {
            // there is new data to store
            newSprints = _.filter(sprintsFromRealTime, function (sprint) {
                return (new Date(sprint.startDate) > lastStartDateStored)
            });

            MongoClient.connect(mongoConnection, function (err, db) {
                db.collection('sprints').insertMany(newSprints, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    db.close();
                });
            });
        }
    }
}






