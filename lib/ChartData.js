var DataProvider = require('../lib/DataProvider');

function getChartData(team, sprint) {
    return {
                data: {
                    // columns is an array of arrays representing each line on the chart
                    columns: [ [team + ' Tasks'].concat(DataProvider.getData(team, sprint)) ]
                    }
                };
}

module.exports = { getChartData : getChartData };