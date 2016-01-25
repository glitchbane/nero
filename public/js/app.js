


// var renderChart = function() {
// 	var selectedTeam = $('#teamsDropdown').find('select').val(),
// 		selectedSprint = $('#sprintsDropdown').find('select').val();
//         console.log('selectedTeam: ' + selectedTeam);
//         console.log('selectedSprint: ' + selectedSprint);
//     $.getJSON('/chartData/' + selectedTeam + '/' + selectedSprint, function(resultData) {
//         console.log(resultData);
//         chart.load({columns: resultData.data.columns,
//             unload: chart.columns});
//     });
// };

// var populateSprintDropdown = function() {
//     var $ddlSprint = $('#sprintSelect');
//     $ddlSprint.empty();
//     var selectedTeam = $('#teamsDropdown').find('select').val();
//     $.getJSON('/team/' + selectedTeam + '/sprints', function(sprintsData) {
//         //var ddlMarkup = '<select class=topBarDropDown>';
//         $.each(sprintsData, function(index, sprint) {
//             $ddlSprint.append($("<option></option>").attr("value", sprint.id).text(sprint.name));
//         })
//     })
//     // set the selected sprint to the last one in the list
//     $('#sprintSelect option:last').attr("selected", "selected");
//    // renderChart();
// };

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
    // set the selected sprint to the last one in the list
    $('#sprintSelect option:last').attr("selected", "selected");
   // renderChart();
});

$('#queryBtn').click(function() {
	var selectedTeam = $('#teamsDropdown').find('select').val(),
		selectedSprint = $('#sprintsDropdown').find('select').val();
        console.log('selectedTeam: ' + selectedTeam);
        console.log('selectedSprint: ' + selectedSprint);
    $.getJSON('/chartData/' + selectedTeam + '/' + selectedSprint, function(resultData) {
        console.log(resultData);
        chart.load({columns: resultData.data.columns,
            unload: chart.columns});
    });
});


