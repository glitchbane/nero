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
            console.log(data);
            res.json(JSON.parse(data));
        });
});

app.get('/fields', function(req, res) {
    JiraData.getFields(
        function(data) {
            console.log(data);
            res.json(data);
        });
});

app.listen(4000, function() {
    console.log('listening');
});








