var RealTimeDataConnector = require('./realTime/realTimeDataConnector'),
    ArchiveDataConnector = require('./archive/archiveDataConnector');

// if the data for the team and sprint does not currently exist in mongo
//   go to jira and get the data for the sprint specified
//   and then insert it into mongo
//   return the data
// else
//   return the data from mongo
module.exports = {
    getSprintBurndown : function (boardId, sprintId, callback) {
        // try to get the burndown data from the archive and return it
        if (!boardId || !sprintId) {
            callback(null);
        }
        ArchiveDataConnector.getSprintBurndown(sprintId, function onRetrieveArchivedBurndown(err, burndown) {
            if (!err) {
                callback(null, burndown.data);
            } else {
                // if the data is not in the archive, first get the sprint from the archive
                // so that we have the right information to process the issue data
                ArchiveDataConnector.getSprint(sprintId, function (err, sprint) {
                    // get the data from Jira and process it
                    RealTimeDataConnector.getSprintBurndown(boardId, sprint, function onRetrieveBurndownData(err, burndown) {
                        if (err) {
                            throw err;
                        }

                        // store the burndown data in the archive
                        ArchiveDataConnector.storeBurndown(sprintId, burndown);

                        // send the burndown data to the callback (since the burndown was not from the archive, the data won't be embedded,
                        // so we just return what was given to us through the jira method
                        callback(null, burndown);
                    });
                })
            }
        });
    },

    getTeamList : function (callback) {
        // try to get the list from MongoDb
        ArchiveDataConnector.getTeamList(function onTeamListRetrieval(err, teamList) {
            if (err && err !== 'not found') {
                throw err
            } else {
                if (err == 'not found') {
                    // team data has not been stored yet, so get it from the seed file and store it
                    ArchiveDataConnector.getSeedTeamList(function onSeedTeamListRetrieval(err, seedTeamList) {
                        ArchiveDataConnector.storeTeams(seedTeamList);
                        teamList = seedTeamList;
                    })
                }
            }
            callback(null, teamList);
        });
    },

    getSprintList : function (boardId, callback) {

        // try to get the list from the data store
        ArchiveDataConnector.getSprints(boardId, function (err, sprintsFromArchive) {
           if (err) {
               // the sprint list was not found in the archive, so get it from real time
               // and store it in the archive for future use
               RealTimeDataConnector.getSprints(boardId, function (errRT, sprintsFromRealTime) {
                   if (errRT) {
                       callback(errRT, null);
                   }

                   ArchiveDataConnector.storeSprints(boardId, sprintsFromRealTime);
                   callback(err, sprintsFromRealTime);
               });
           } else {
               // TODO: check to see if the end date of the last sprint is prior to today
               // and if so, refresh the list from realtime
               callback(null, sprintsFromArchive);
           }
       })
    }
};
