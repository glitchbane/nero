var JiraData = require('./lib/JiraData'),
    express = require('express');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app = express();

app.get('/', function(req, res) {
    JiraData.getTasks('Alliance',
        'Sprint 77',
        function(data) {
            console.log(data);
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

app.get('/teams', function(req, res) {
    JiraData.getTeams(
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

app.listen(4000, function() {
    console.log('listening');
});








