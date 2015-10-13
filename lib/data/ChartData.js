var DataProvider = require('./DataProvider');

function getChartData(team, sprint, callback) {
    if (!team || !sprint) {
        team = 'Orca';
        sprint = '76';
    }
    DataProvider.getData(team, sprint, function(err, data) {
        if (err) callback(err);
        else callback(null, {
            data: {
                // columns is an array of arrays representing each line on the chart
                columns: [ [team + ' Tasks'].concat(data) ]
            }
        });
    });
}

module.exports = { getChartData : getChartData };