var chart,
    $,

    renderChart = function () {

        var selectedTeam = $('#teamsDropdown').find('select').val(),
          selectedSprint = $('#sprintsDropdown').find('select').val();

        console.log('query click selectedTeam: ' + selectedTeam);
        console.log('query click selectedSprint: ' + selectedSprint);

        $.getJSON('/chartData/' + selectedTeam + '/' + selectedSprint, function (resultData) {
            if (resultData) {
                chart.load({
                    columns: resultData.data.columns,
                    unload: chart.columns
                });
            } else {
                chart.unload();
            }
        });
    },

populateSprintDropdown = function () {
    var $ddlSprint = $('#sprintSelect'),
        selectedTeam = $('#teamsDropdown').find('select').val();

    $ddlSprint.empty();

    $.getJSON('/team/' + selectedTeam + '/sprints', function (sprintsData) {

        $.each(sprintsData, function (index, sprint) {
            $ddlSprint.append($("<option></option>").attr("value", sprint.id).text(sprint.name));
        })
        // set the selected sprint to the last one in the list
        $('#sprintSelect option:last').attr("selected", "selected");
    })
};

$('#teamsDropdown').on('change', populateSprintDropdown);

$('#queryBtn').click(renderChart);


