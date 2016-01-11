var MongoDataProxy = require('./mongoDataProxy');

module.exports = {
	getData: MongoDataProxy.getTeamSprintData,
	getTeamList: MongoDataProxy.getTeamList,
	getSprintList: MongoDataProxy.getSprintList
};