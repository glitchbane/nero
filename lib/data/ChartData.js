var DataProvider = require('./DataProvider');

function getChartData(team, sprint) {
    console.log("we're getting Chart data, maybe");
    return {
                data: {
                    // columns is an array of arrays representing each line on the chart
                    columns: [ [team + ' Tasks'].concat(DataProvider.getData(team, sprint)) ]
                    }
                };
}

module.exports = { getChartData : getChartData };