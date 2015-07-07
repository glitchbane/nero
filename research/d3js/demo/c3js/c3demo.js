/// <reference path="../../framework/d3js-3.4.11/d3.js" />
/// <reference path="../../framework/c3/c3.js" />

var chart = c3.generate({
	bindto: '#chart',
    data: {
        columns: [
            ['dataset1', 30, 200, 100, 400, 150, 250]
        ]
    }
});

