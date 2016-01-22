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


// populate team List
// user selects team
// sprint list is populated with sprints that are valid for that team
$('#teamsDropdown').on('change', function() {
    var $ddlSprint = $('#sprintSelect');
    $ddlSprint.empty();
    var selectedTeam = $('#teamsDropdown').find('select').val();
    $.getJSON('/team/' + selectedTeam + '/sprints', function(sprintsData) {
        //var ddlMarkup = '<select class=topBarDropDown>';
        $.each(sprintsData, function(index, sprint) {
            $ddlSprint.append($("<option></option>").attr("value", sprint.id).text(sprint.name));
        })
    })
});
