var MongoDataProxy = require('./mongoDataProxy');
var MongoMapper = require('../mappers/jiraTasksToMongoMapper');

module.exports = {
	//getData: MongoDataProxy.getTeamSprintData,
    getData: MongoMapper.getJson,
	getTeamList: MongoDataProxy.getTeamList,
	getSprintList: MongoDataProxy.getSprintList,
    getSprints: MongoDataProxy.getSprints,
    storeSprints: MongoDataProxy.storeSprints
};