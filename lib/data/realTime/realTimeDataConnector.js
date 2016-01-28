var jiraDataProxy = require('./jiraDataProxy');

module.exports = {
    getSprints: function (boardId, callback) {
        return jiraDataProxy.getSprints(boardId, callback);
    },
    getSprintBurndown: function (boardId, sprintId, callback) {
        return jiraDataProxy.getSprintBurndown(boardId, sprintId, callback);
    }
};
