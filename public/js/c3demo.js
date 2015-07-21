/// <reference path="../../framework/d3js-3.4.11/d3.js" />
/// <reference path="../../framework/c3/c3.js" />


$.getJSON('/chartData', function(resultData){
	c3.generate({
		bindto: '#chart',
	    data: {
	        columns: [
	            resultData.data
	        ]
	    }
	});
});
