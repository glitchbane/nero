(function($) {

  // jQuery.document.ready() shortcut
  $(function() {
    $.getJSON('/chartData', function(resultData) {
      c3.generate({
        bindto: '#chart',
        data: resultData.data
      });
    });
  });

})(jQuery);