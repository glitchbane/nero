var logger = require('morgan'),
    express = require('express'),
    routes = require('./routes/routes'),
    cons = require('consolidate'),
    mongoClient = require('mongodb').MongoClient;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app = express(),
    portNumber = process.argv[2] || 7000;

app.use(logger('dev'));
//for static files. Anything in the public dir is visible
app.use(express.static('public'));

app.engine('hbs', cons.handlebars);

app.set('view engine', 'hbs');
app.set('views', __dirname + '/templates');

app.get('/', routes.index);
app.get('/tasks/:team/:sprint', routes.tasksTeam);
app.get('/tasks/:sprint', routes.tasksSprint);
app.get('/teams', routes.teams);
app.get('/teams/:sprint', routes.teamsSprint);
app.get('/sprints', routes.sprints);
app.get('/teams/:teamId/sprints', routes.sprintsForTeam);
app.get('/chartData/:team/:sprint', routes.chartData);
app.get('/chartData', routes.chartData)

app.listen(portNumber, function() {
    console.log('Listening on http://localhost:' + portNumber);
});
