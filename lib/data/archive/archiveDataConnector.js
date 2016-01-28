var MongoDataProxy = require('./mongoDataProxy'),
    FileDataProxy = require('./fileDataProxy');

module.exports = {
    getSeedTeamList: FileDataProxy.getTeamList,
    storeTeams:    MongoDataProxy.storeTeams,
    getTeamList:   MongoDataProxy.getTeamList,
    getSprintList: MongoDataProxy.getSprintList,
    getSprints:    MongoDataProxy.getSprints,
    storeSprints:  MongoDataProxy.storeSprints,
    getSprint:     MongoDataProxy.getSprint,
    getSprintBurndown: MongoDataProxy.getSprintBurndown,
    storeBurndown: MongoDataProxy.storeBurndown
};
