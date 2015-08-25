var realTimeData = require('./realTimeData'),
    archiveData = require('./archiveData');

module.exports = {
                getData : function(team, sprint) {
                    if(sprint === null){
                        return realTimeData.getData(team, sprint);
                    }
                    else {
                        return archiveData.getData(team, sprint);
                    }
                    
                }
};