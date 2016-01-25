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

function getAgileDataWithQuery(path, query, callback) {
        var options = {
        pathname: agileApiRootPath + path,
        protocol: 'https:',
        hostname: jiraHostName,
        auth: jiraAuth(),
        search: query
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
function getSprints(boardId, callback) {
    // called like /sprints        
    var path = '/board/' + boardId + '/sprint'

    getAgileData(path,  function(data) {

        // filter out sprints where the parent Board id is not the same as the team board id 
        var jsonData = JSON.parse(data);
        var filteredData = _.filter(jsonData.values,  {originBoardId: parseInt(boardId, 10)});
        
        //var filteredData = _.where(data.values, {originBoardId: boardId});
        callback(null, filteredData);
    });
}

function getSprintBurndown(boardId, sprint, callback) { 
    var burndown = [];   

    var startDate = new Date(sprint.startDate);
    var endDate = new Date(sprint.endDate);
    var dayDate,
        createdDate,
        resolvedDate,
        thisIssue;
   // https://jira/jira/rest/agile/1.0/board/1443/sprint/7925/issue?jql=issuetype%20=%20%22Sub-task%22&fields=summary,customfield_15005,resolution,created

    var path = '/board/' + boardId + '/sprint/' + sprint.id + '/issue';
    var query = 'jql=issuetype=Sub-task&fields=summary,customfield_15005,resolution,created';
    
    getAgileDataWithQuery(path, query, function(issues) {
        var jsonIssues = JSON.parse(issues);
        var issueData = jsonIssues.issues;
        
        for(dayDate = startDate; dayDate <= endDate; dayDate = addDays(dayDate, 1)){
            var issuesRemaining = 0;
            var createdPriorToThisDate = 0;
            var resolvedPriorToThisDate = 0;  
                      
            for (var i = 0; i < issueData.length; i++) {
                
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



function getSprintChartData(team, sprint) {
    		return [0, 10, 21, 10, 12, 10, 10, 8, 7, 6, 3, 2, 1, 0];
}



// exports an object with the 'public' methods
// All other properties and methods in this file are
// 'private' and not visible to users of this module.
module.exports = {
    getTeams: getTeams,    
    getSprints: getSprints,
    getSprintBurndown: getSprintBurndown
};