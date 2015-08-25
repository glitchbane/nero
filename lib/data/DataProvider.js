var RealTimeData = require('./realTime/realTimeDataConnector'),
    ArchiveDataConnector = require('./archive/archiveDataConnector');

module.exports = {
                getData : function(team, sprint) {
                    if(sprint === null){
                        return RealTimeData.getData(team, sprint);
                    }
                    else {
                        return ArchiveDataConnector.getData(team, sprint);
                    }
                    
                }
};