var https = require('https'),
    url = require('url'),
    _ = require('underscore'),
    moment = require('moment'),
    util = require('../../util/sprintUtils');

// internal implementation, helper methods, properties, etc.

// constants
var username = 's-nero',
    password = '$A#dxPZ@3',
    jiraHostName = 'jira',

    // paths
    jiraApiRootPath = 'jira/rest/api/2/',
    agileApiRootPath = 'jira/rest/agile/1.0'
   // jqlSearchPath = 'search',
    // createMetaPath = 'issue/createmeta',

    // - used to get all fields associated with the issue type 'sub-task'
    // subtaskFieldsQuery = '?projectKeys=VOY&issuetypeName=Sub-Task&expand=projects.issuetypes.fields';

function jiraAuth() {
    return username + ':' + password;
}



function getAgileData(path, callback) {
        var options = {
        pathname: agileApiRootPath + path,
        protocol: 'https:',
        hostname: jiraHostName,
        auth: jiraAuth(),
        // search: query
    };

    var link = url.format(options);
    console.log(link);
    https.get(link, function(res) {
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

// *****************************
// Exposed on the external API
// *****************************


// this is not very useful and could probably go away.  When new teams are added we need to add them to mongo
function getTeams(callback) {
    // called like /teams
    // var pathname = createMetaPath,
    //     query = subtaskFieldsQuery;

    // getJiraData(pathname, query, function(data) {
    //     var filteredData = filterFieldOptions(filterBySubTask(data), 'customfield_11702');

    //     callback(filteredData);
   // });
}


// this function should get sprints only for a given team
// because the number of sprints varies from team to team
function getSprints(team, callback) {
    // called like /sprints
    
    // get the board id for the team if we don't already have it
    var path = '/board/1443/sprint'

    getAgileData(path,  function(data) {
        // TODO:  we need to filter out sprints where the parent Board id is not the same as the team board id
        //var filteredData = filterFieldOptions(filterBySubTask(data), 'customfield_14002');
        var filteredData = data;
        callback(filteredData);
    });
}

function getTasks(team, sprint, callback) {
    // called like /tasks/Alliance/77
    var pathname = jqlSearchPath,
        query = tasksQuery(team, sprint);
    console.log(query);
    getJiraData(pathname, query, callback);
    // once we get this data we have to look at the resolution dates and figure out how many tasks remained open each day of the sprint
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
    //var dayOfSprSint = util.dayOfSprint(sprintStartDate);

    getSprintTasks(sprint, function(data) {

        var result = JSON.parse(data);
        var totalIssue = result.total;
        var RemainingTaskCounts = [];

        var totalDoneCount = 0,
            i;
            
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