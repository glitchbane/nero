var RealTimeDataConnector = require('./realTime/realTimeDataConnector'),
    ArchiveDataConnector = require('./archive/archiveDataConnector');

module.exports = {
    getData : function(team, sprint, callback) {
        if (sprint === null){
            return RealTimeDataConnector.getData(team, sprint, callback);
        } else {
            return ArchiveDataConnector.getData(team, sprint, callback);
        }
    },
    //remember this is going to be async
    getTeamList : function(callback) {
        // get the list from MongoDb
        return ArchiveDataConnector.getTeamList(callback)        
    },
    //this too
    getSprintList : function(callback) {
        return ArchiveDataConnector.getSprintList(callback)
       // return [78, 77, 76, 75, 74];
    }
};