var logger = require('morgan'),
    express = require('express'),
    routes = require('./routes/routes'),
    cons = require('consolidate'),
    app,
    portNumber;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app = express();
portNumber = process.argv[2] || 7000;

app.use(logger('dev'));
//for static files. Anything in the public dir is visible
app.use(express.static('public'));

app.engine('hbs', cons.handlebars);

app.set('view engine', 'hbs');
app.set('views', __dirname + '/templates');

app.get('/', routes.index);
app.get('/teams', routes.teams);
app.get('/team/:teamId/sprints', routes.sprintsForTeam);
app.get('/sprints', routes.sprints);
app.get('/chartData/:team/:sprint', routes.chartData);
app.get('/chartData', routes.chartData);

app.listen(portNumber, function () {
    console.log('Listening on http://localhost:' + portNumber);
});
