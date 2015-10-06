var chart;

$('#queryBtn').click(function() {
	var selectedTeam = $('#teamsDropdown').find('select').val(),
		selectedSprint = $('#sprintsDropdown').find('select').val();
    $.getJSON('/chartData/' + selectedTeam + '/' + selectedSprint, function(resultData) {
        console.log(resultData);
        chart.load({columns: resultData.data.columns,
            unload: chart.columns});
    });
})
