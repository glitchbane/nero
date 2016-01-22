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

function getSprintBurndown(boardId, sprintId, callback) {
    // first get the information about the sprint itself
    var path = '/board/' + boardId + '/sprint/' + sprintId
    getAgileData(path, function(sprint) {
        
    
        // then get the issues in the sprint
        var path = path + '/issue';
        
        getAgileData(path, function(data) {
            // now figure out the daily tasks remaining for each day of the sprint
        })
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