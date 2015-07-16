var JiraData = require('./lib/JiraData'),
    logger = require('morgan'),
    express = require('express');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app = express();
app.use(logger('dev'));

var portNumber = 7000;

app.get('/', function(req, res) {
    JiraData.getTasks('Alliance',
        'Sprint 77',
        function(data) {
            res.json(JSON.parse(data));
        });
});

app.get('/tasks/:team/:sprint', function(req, res) {
    JiraData.getTasks(req.params.team,
        req.params.sprint,
        function(data) {
            res.json(JSON.parse(data));
        });
});

app.get('/tasks/:sprint', function(req, res) {
    JiraData.getSprintTasks(req.params.sprint,
        function(data) {
            res.json(JSON.parse(data));
        });
});

app.get('/teams', function(req, res) {
    JiraData.getTeams(
        function(data) {
            res.json(data);
        });
});

app.get('/teams/:sprint', function(req, res) {
    JiraData.getSprintTeams(req.params.sprint,
        function(data) {
            res.json(data);
        });
});

app.get('/sprints', function(req, res) {
    JiraData.getSprints(
        function(data) {
            res.json(data);
        });
});

app.listen(portNumber, function() {
    console.log('Listening on http://localhost:' + portNumber);
});
