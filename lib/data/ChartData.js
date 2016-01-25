var DataProvider = require('./DataProvider');

function getChartData(boardId, sprintId, callback) {
    // if (!team || !sprint) {
    //     team = 'Orca';
    //     sprint = '76';
    // }
            console.log('getChartData boardId: ' + boardId);
        console.log('getChartData sprintId: ' + sprintId);
    if (!boardId || !sprintId) callback('no params');
    DataProvider.getSprintBurndown(boardId, sprintId, function(err, data) {

        if (err) callback(err);
        else callback(null, {
            data: {
                // columns is an array of arrays representing each line on the chart
                columns: [ ['Tasks'].concat(data) ]
            }
        });
    });
}

module.exports = { getChartData : getChartData };