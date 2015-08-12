var DataProvider = require('../lib/DataProvider');

function getChartData() {
    return {
                data: {
                    // columns is an array of arrays representing each line on the chart
                    columns: [ ['Tasks'].concat([0, 10, 21, 10, 12, 10, 10, 8, 7, 6, 3, 2, 1, 0]) ]
                    }
                };
}

module.exports = { getChartData : getChartData() };