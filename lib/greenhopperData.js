var https = require('https'),
    url = require('url'),
    _ = require('underscore'),
    moment = require('moment');

// internal implementation, helper methods, properties, etc.

// constants
var username = 's-nero',
    password = '$A#dxPZ@3',
    greenhopperApiRootPath = 'jira/rest/greenhopper/1.0/',
    greenhopperHostName = 'jira',

    // paths
    jqlSearchPath = 'search',
    createMetaPath = 'issue/createmeta',

    // - used to get all fields associated with the issue type 'sub-task'
    subtaskFieldsQuery = '?projectKeys=VOY&issuetypeName=Sub-Task&expand=projects.issuetypes.fields';

function jiraAuth() {
    return username + ':' + password;
}

function rapidViewsQuery() {
	return "rapidview/list";
}

function sprintsByBoardQuery(teamBoardNumber){
	return "sprintquery/" + teamBoardNumber + "?includeFutureSprints=true&includeHistoricSprints=false"
	
	// sample return from greenhopper API
		// 	sprints: [
		// {
		// id: 2619,
		// sequence: 2619,
		// name: "Sprint 52",
		// state: "CLOSED",
		// linkedPagesCount: 0
		// },
		// ...
		// {
		// id: 6276,
		// sequence: 6276,
		// name: "Alliance - Sprint 78",
		// state: "CLOSED",
		// linkedPagesCount: 0
		// },
		// {
		// id: 6585,
		// sequence: 6585,
		// name: "Alliance - Sprint 79",
		// state: "ACTIVE",
		// linkedPagesCount: 0
		// },
		// {
		// id: 6729,
		// sequence: 6729,
		// name: "Orca Sprint 79",
		// state: "ACTIVE",
		// linkedPagesCount: 0
		// },
		// {
		// id: 6933,
		// sequence: 6933,
		// name: "Alliance Sprint 80",
		// state: "FUTURE",
		// linkedPagesCount: 0
		// }
		// ],
		// rapidViewId: 1443
		// }
}
function tasksQuery(team, sprint) {
    return '?jql=project = Voyager AND Team = ' +
        team + ' AND issuetype = "Sub-task" AND Sprint = "' +
        sprint + '"&fields=id,key,summary,status,resolution,resolutiondate';
}

function sprintTasksQuery(sprint) {
    return '?jql=project = Voyager AND Sprint = "' +
        sprint + '" AND issuetype = "Sub-task"&fields=resolutiondate,customfield_11702';
}

function sprintTeamsQuery(sprint) {
    return '?jql=project = Voyager AND Sprint = "' +
        sprint + '" &fields=id,customfield_11702';
}

function getCurrentSprint() {

	
	// use Alliance board to find out which sprint current
	// TODO: make it generic
	
	// TODO: put in the code
	// get the results of the sprints by board for alliance
	
	// filter on state: "ACTIVE"
	
	// parse out the sprint number and return it
	
	// hard coded for now.
    return 79;
}
