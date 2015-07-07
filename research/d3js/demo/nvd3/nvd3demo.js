/// <reference path="../../framework/d3js-3.4.11/d3.js" />
/// <reference path="../../framework/nvd3/build/nv.d3.js" />

nv.addGraph(function() {
  var chart = nv.models.lineChart()
                .margin({left: 50, right: 50})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                .showLegend(true)
                .width(500)
                .height(500);
  
  var myData = [{
      key: 'dataset1',
      color: '#444',
      values: [ {x: 0, y: 30}, {x: 10, y: 200}, {x: 20, y: 100}, {x: 30, y: 400}, {x: 40, y: 150}, {x: 50, y: 250} ]
  }];

  d3.select('#chart svg')    //Select the <svg> element you want to render the chart in.   
      .datum(myData)         //Populate the <svg> element with chart data...
      .call(chart);          //Finally, render the chart!
      
  nv.utils.windowResize(function() { chart.update() });
  return chart;
});

