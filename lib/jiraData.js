var https = require('https'),
    url = require('url'),
    _ = require('underscore'),
    moment = require('moment');

// internal implementation, helper methods, properties, etc.

// constants
var username = 's-nero',
    password = '$A#dxPZ@3',
    jiraApiRootPath = 'jira/rest/api/2/',
    jiraHostName = 'jira',

    // paths
    jqlSearchPath = 'search',
    createMetaPath = 'issue/createmeta',

    // - used to get all fields associated with the issue type 'sub-task'
    subtaskFieldsQuery = '?projectKeys=VOY&issuetypeName=Sub-Task&expand=projects.issuetypes.fields';

function jiraAuth() {
    return username + ':' + password;
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
    // hard coded for now.
    return 79;
}

function getSprintStartDate(sprintNumber) {
    // sprint 77 started on 7/9/2015.
    var motherSprint = 77,
        motherSprintStart = moment('7/9/2015'),
        sprintDiff = sprintNumber - motherSprint;

    // multiply the diff by 14 to get the number of days to add
    var addedDays = sprintDiff * 14;

    return motherSprintStart.add(addedDays, 'days');
}

function getDayOfSprint(sprintStartDay, day) {
    var curDate = sprintStartDay;
    var count = 0;
    while (curDate <= day) {
        var dayOfWeek = curDate.day();
        //excluded wknds
        //var isWeekend = (dayOfWeek == 6) || (dayOfWeek == 0);
        //if(!isWeekend)
        count++;
        curDate = curDate.add(1, 'days');
    }
    return count;
}

function getJiraData(pathname, query, callback) {

    var options = {
        pathname: jiraApiRootPath + pathname,
        protocol: 'https:',
        hostname: jiraHostName,
        auth: jiraAuth(),
        search: query
    };

    https.get(url.format(options), function(res) {
        var data = '';

        res.on('data', function(d) {
            data += d;
        });

        res.on('end', function(d) {
            if (d) {
                data += d;
            }
            callback(data);
        });
    }).on('error', function(e) {
        console.log('Error: ' + e);
    });
}

// filters
function filterBySubTask(rawData) {
    var jsonData = JSON.parse(rawData)
    return _.where(jsonData.projects[0].issuetypes, {
        id: "5"
    });
}

function filterFieldOptions(issueFields, filterField) {
    var filteredData;
    if (filterField === 'customfield_11702') {

        // customfield_11702 refers to the Team field
        filteredData = issueFields[0].fields.customfield_11702.allowedValues;
    }

    if (filterField === 'customfield_14002') {

        // customfield_14002 refers to the Sprint field
        filteredData = issueFields[0].fields.customfield_14002.allowedValues;
    }

    return (_.map(filteredData, function(val) {
        return {
            value: val.value,
            id: val.id
        };
    }));
}

// Exposed on the external API
function getTeams(callback) {
    // called like /teams
    var pathname = createMetaPath,
        query = subtaskFieldsQuery;

    getJiraData(pathname, query, function(data) {
        var filteredData = filterFieldOptions(filterBySubTask(data), 'customfield_11702');

        callback(filteredData);
    });
}

function getTasks(team, sprint, callback) {
    // called like /tasks/Alliance/77
    var pathname = jqlSearchPath,
        query = tasksQuery(team, sprint);
    console.log(query);
    getJiraData(pathname, query, callback);
}

function getSprints(callback) {
    // called like /sprints
    var pathname = createMetaPath,
        query = subtaskFieldsQuery;

    getJiraData(pathname, query, function(data) {
        var filteredData = filterFieldOptions(filterBySubTask(data), 'customfield_14002');
        callback(filteredData);
    });
}

function getSprintTeams(sprint, callback) {
    // called like /teams/77

    var pathname = jqlSearchPath,
        query = sprintTeamsQuery(sprint);

    getJiraData(pathname, query, function(data) {
        var fieldData = JSON.parse(data);
        var sprintTeams = fieldData.issues;

        sprintTeams = _.without(sprintTeams, null);
        sprintTeams = _.map(sprintTeams, function(issues) {
            if (issues.fields.customfield_11702 !== null) {
                return issues.fields.customfield_11702.value;
            };
        });

        // remove the null values
        sprintTeams = _.compact(sprintTeams);

        callback(_.uniq(sprintTeams));
    });
}

function getSprintTasks(sprint, callback) {
    // called like /tasks/77
    var pathname = 'search',
        query = sprintTasksQuery(sprint);

    getJiraData(pathname, query, callback);
}

function getSprintChartData(team, sprint) {
    		return [0, 10, 21, 10, 12, 10, 10, 8, 7, 6, 3, 2, 1, 0];
}

function getChartResult(callback) {

    var sprint = getCurrentSprint();
    var sprintStartDate = getSprintStartDate(sprint);
    var dayOfSprint = getDayOfSprint(sprintStartDate, moment());

    getSprintTasks(sprint, function(data) {

        var result = JSON.parse(data);
        var totalIssue = result.total;
        var RemainingTaskCounts = [];

        var totalDoneCount = 0;
        for (i = 0; i < dayOfSprint; i++) {

            // need to exclude weekends
            var offset = dayOfSprint - i;
            var thisDay = moment().subtract(offset, 'days');
            var doneCountThisDay = getDoneCountOnThisDay(thisDay);

            totalDoneCount += doneCountThisDay;
            RemainingTaskCounts.push(totalIssue - totalDoneCount);
        }

        function getDoneCountOnThisDay(date) {
            console.log(date);
            var dayWithoutTime = date.format('YYYY-MM-DD');

            var doneThisDay = _.filter(result.issues, function(issue) {
                resolutiondate = issue.fields.resolutiondate;
                return resolutiondate != null && resolutiondate.indexOf(dayWithoutTime) >= 0;
            });

            return doneThisDay.length;
        }

        callback(RemainingTaskCounts);
    });
}

// exports an object with the 'public' methods
// All other properties and methods in this file are
// 'private' and not visible to users of this module.
module.exports = {
    getTeams: getTeams,
    getTasks: getTasks,
    getSprints: getSprints,
    getSprintTeams: getSprintTeams,
    getSprintTasks: getSprintTasks,
    getChartResult: getChartResult,
    getSprintChartData: getSprintChartData
};