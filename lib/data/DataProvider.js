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
    getTeamList : function() {
        return ['Alliance', 'Orca', 'Venetian', 'Spartans'];
    },
    //this too
    getSprintList : function() {
        return [78, 77, 76, 75, 74];
    }
};