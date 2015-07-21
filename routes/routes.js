var JiraData = require('../lib/JiraData');

exports.index = function(req, res) {
    res.sendFile(process.cwd() + '/templates/index.html');
};

exports.tasksTeam = function(req, res) {
    JiraData.getTasks(req.params.team,
        req.params.sprint,
        function(data) {
            res.json(JSON.parse(data));
        });
};

exports.tasksSprint = function(req, res) {
    JiraData.getSprintTasks(req.params.sprint,
        function(data) {
            res.json(JSON.parse(data));
        });
};

exports.teams = function(req, res) {
    JiraData.getTeams(
        function(data) {
            res.json(data);
        });
};

exports.teamsSprint = function(req, res) {
    JiraData.getSprintTeams(req.params.sprint,
        function(data) {
            res.json(data);
        });
};

exports.sprints = function(req, res) {
    JiraData.getSprints(
        function(data) {
            res.json(data);
        });
};

exports.chartData = function(req, res){
    var chartResult = {
        data: {
            columns: [
                ['Tasks Remaining', 40, 32, 30, 23, 18, 12, 8, 8, 6, 4, 3, 2, 1, 0],
                ['Bugs', 0, 0, 1, 0, 2, 0, 0, 1, 0, 2, 3, 2, 1, 0]
        ]}
    };

    res.json(chartResult);
}