(function ($) {

    // jQuery.document.ready() shortcut
    $(function () {
      var path = '/chartData/1443/2924';
      $.getJSON(path, function (resultData) {
          chart = c3.generate({
            bindto: '#chart',
            data: resultData.data,
            axis: {
                x: {
                    label: 'Day of Sprint'
                },
                y: {
                    label: 'Tasks'
                }
            }
        });
      });
  });

})(jQuery);
