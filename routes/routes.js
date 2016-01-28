var JiraData = require('../lib/data/realTime/jiraDataProxy'),
    ChartData = require('../lib/data/ChartData'),
    DataProvider = require('../lib/data/DataProvider');

exports.index = function (req, res) {
    DataProvider.getTeamList(function (err, teamList) {

        DataProvider.getSprintList(teamList[0].boardId, function (err, sprintList) {

            res.render('index', {
                teams : teamList,
                sprints : sprintList
            });
        });
    });
};

exports.tasksTeam = function (req, res) {
    JiraData.getTasks(req.params.team,
        req.params.sprint,
        function (data) {
            res.json(JSON.parse(data));
        });
};

exports.tasksSprint = function (req, res) {
    JiraData.getSprintTasks(req.params.sprint,
        function (data) {
            res.json(JSON.parse(data));
        });
};

exports.teams = function (req, res) {
    JiraData.getTeams(
        function (data) {
            res.json(data);
        });
};

exports.teamsSprint = function (req, res) {
    JiraData.getSprintTeams(req.params.sprint,
        function (data) {
            res.json(data);
        });
};

exports.sprints = function (req, res) {
    JiraData.getSprints(
        function (data) {
            res.json(data);
        });
};

exports.sprintsForTeam = function (req, res) {
    DataProvider.getSprintList(req.params.teamId,
    function (err, data) {
        res.json(data);
    });
};

exports.chartData = function (req, res) {
    ChartData.getChartData(req.params.team, req.params.sprint, function (err, data) {

        if (err) {
            res.json(err);
        } else {
            console.log(data);
            res.json(data);
        }
    });
};
