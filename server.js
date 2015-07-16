var logger = require('morgan'),
    express = require('express'),
    routes = require('./routes/routes');


process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app = express();
app.use(logger('dev'));

var portNumber = process.argv[2] || 7000;

app.get('/', routes.index);
app.get('/tasks/:team/:sprint', routes.tasksTeam);
app.get('/tasks/:sprint', routes.tasksSprint);
app.get('/teams', routes.teams);
app.get('/teams/:sprint', routes.teamsSprint);
app.get('/sprints', routes.sprints);

app.listen(portNumber, function() {
    console.log('Listening on http://localhost:' + portNumber);
});
