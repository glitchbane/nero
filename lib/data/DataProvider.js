var RealTimeDataConnector = require('./realTime/realTimeDataConnector'),
    ArchiveDataConnector = require('./archive/archiveDataConnector');

module.exports = {
                getData : function(team, sprint) {
                    if(sprint === null){
                        return RealTimeDataConnector.getData(team, sprint);
                    }
                    else {
                        return ArchiveDataConnector.getData(team, sprint);
                    }
                }
};