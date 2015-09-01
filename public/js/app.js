$('#queryBtn').click(function() {
	var selectedTeam = $('#teamsDropdown').find('select').val(),
		selectedSprint = $('#sprintsDropdown').find('select').val();
	$.ajax('/chartData/' + selectedTeam + '/' + selectedSprint, function(data) {
		console.log(data);
	});
})