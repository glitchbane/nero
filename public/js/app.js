$('#queryBtn').click(function() {
	var selectedTeam = $('#teamsDropdown').find('select').val(),
		selectedSprint = $('#sprintsDropdown').find('select').val();
	$.ajax('/chartData/' + selectedTeam + '/' + selectedSprint)
	.done(function (data) {
		console.log(data);		
		$('#chart').load(data);
	});
})
