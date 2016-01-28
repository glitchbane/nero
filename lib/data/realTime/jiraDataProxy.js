var https = require('https'),
    url = require('url'),
    _ = require('underscore'),
    moment = require('moment'),

// internal implementation, helper methods, properties, etc.

// constants
    username = 's-nero',
    password = '$A#dxPZ@3',
    jiraHostName = 'jira',

    // paths
    jiraApiRootPath = 'jira/rest/api/2/',
    agileApiRootPath = 'jira/rest/agile/1.0',

    // other
    resolvedDateField = 'customfield_15005'


function jiraAuth() {
    return username + ':' + password;
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function getAgileData(path, callback) {
    var link,
        options = {
        pathname: agileApiRootPath + path,
        protocol: 'https:',
        hostname: jiraHostName,
        auth: jiraAuth()
    };

    link = url.format(options);

    https.get(link, function (res) {
        var data = '';

        res.on('data', function (d) {
            data += d;
        });

        res.on('end', function (d) {
            if (d) {
                data += d;
            }
            callback(data);
        });
    }).on('error', function (e) {
        console.log('Error: ' + e);
    });
}

function getAgileDataWithQuery(path, query, callback) {
    var link,
        options = {
        pathname: agileApiRootPath + path,
        protocol: 'https:',
        hostname: jiraHostName,
        auth: jiraAuth(),
        search: query
    };

    link = url.format(options);
    console.log(link);
    https.get(link, function (res) {
        var data = '';

        res.on('data', function (d) {
            data += d;
        });

        res.on('end', function (d) {
            if (d) {
                data += d;
            }
            callback(data);
        });
    }).on('error', function (e) {
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

    https.get(url.format(options), function (res) {
        var data = '';

        res.on('data', function (d) {
            data += d;
        });

        res.on('end', function (d) {
            if (d) {
                data += d;
            }
            callback(data);
        });
    }).on('error', function (e) {
        console.log('Error: ' + e);
    });
}

// *****************************
// Exposed on the external API
// *****************************

// this function should get sprints only for a given team
// because the number of sprints varies from team to team
function getSprints(boardId, callback) {

    var jsonData,
        filteredData,
        path = '/board/' + boardId + '/sprint'

    getAgileData(path,  function (data) {

        // filter out sprints where the parent Board id is not the same as the team board id
        jsonData = JSON.parse(data);
        filteredData = _.filter(jsonData.values,  {originBoardId: parseInt(boardId, 10)});

        callback(null, filteredData);
    });
}

function getSprintBurndown(boardId, sprint, callback) {
    var startDate,
        endDate,
        dayDate,
        createdDate,
        resolvedDate,
        thisIssue,
        path,
        query,
        burndown = [];

    startDate = new Date(sprint.startDate);
    endDate = new Date(sprint.endDate);

    // https://jira/jira/rest/agile/1.0/board/1443/sprint/7925/issue?jql=issuetype%20=%20%22Sub-task%22&fields=summary,customfield_15005,resolution,created

    path = '/board/' + boardId + '/sprint/' + sprint.id + '/issue';
    query = 'jql=issuetype=Sub-task&fields=summary,customfield_15005,resolution,created';

    getAgileDataWithQuery(path, query, function (issues) {
        var jsonIssues,
            issueData,
            issuesRemaining,
            createdPriorToThisDate,
            resolvedPriorToThisDate,
            i;

        if (!issues || issues.length == 0) {
            callback('not found');
        }

        jsonIssues = JSON.parse(issues);
        issueData = jsonIssues.issues;

        for (dayDate = startDate; dayDate <= endDate; dayDate = addDays(dayDate, 1)) {
            issuesRemaining = 0;
            createdPriorToThisDate = 0;
            resolvedPriorToThisDate = 0;

            for (i = 0; i < issueData.length; i++) {

                thisIssue = issueData[i];

                createdDate = new Date(thisIssue.fields.created);
                resolvedDate = new Date((thisIssue.fields.customfield_15005) || new Date('12/31/2099'));

                if (createdDate < dayDate) {
                    createdPriorToThisDate++;
                }
                if (resolvedDate < dayDate) {
                    resolvedPriorToThisDate++;
                }
            }
            issuesRemaining = createdPriorToThisDate - resolvedPriorToThisDate;
            burndown.push(issuesRemaining);
        }
        callback(null, burndown);
    })
}

module.exports = {
    getSprints: getSprints,
    getSprintBurndown: getSprintBurndown
};
