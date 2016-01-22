var RealTimeDataConnector = require('./realTime/realTimeDataConnector'),
    ArchiveDataConnector = require('./archive/archiveDataConnector');

// if the data for the team and sprint does not currently exist in mongo
//   go to jira and get the data for the sprint specified
//   and then insert it into mongo
//   return the data
// else
//   return the data from mongo
module.exports = {
    getData : function(boardId, sprintId, callback) {
        // if (sprint === null){
        //     return RealTimeDataConnector.getData(team, sprint, callback);
        // } else {
        //     return ArchiveDataConnector.getData(team, sprint, callback);
        // }
 //uncomment below       
        // ArchiveDataConnector.getData(team, sprint,  function onArchiveDataResult (err, data) {
        //     if (err) throw err;
        //     console.log(data);
        //     if (data) {
        //         callback(null, data);
        //         return;
        //     }
            
            RealTimeDataConnector.getData(boardId, sprintId, function onRetrieveRealTimeData (err, data) {
                if (err) throw err;           
            });
      //  });
    },
    //remember this is going to be async
    getTeamList : function(callback) {
        // get the list from MongoDb
        return ArchiveDataConnector.getTeamList(callback)        
    },
    //this too
    getSprintList : function(boardId, callback) {
        // return ArchiveDataConnector.getSprintList(callback)
       // return [78, 77, 76, 75, 74];
       return RealTimeDataConnector.getSprints(boardId, callback);
    }
};