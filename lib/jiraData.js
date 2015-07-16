var https = require('https'),
    url = require('url'),
    _ = require('underscore');

var JiraData = {};

JiraData.getTeams = function(callback) {
    var pathname = 'issue/createmeta',
        query = '?projectKeys=VOY&issuetypeName=Sub-Task&expand=projects.issuetypes.fields';
    get(pathname, query, function(data) {
        var fieldData = JSON.parse(data);
        var filteredData = _.where(fieldData.projects[0].issuetypes, {id: "5"});
        filteredData = filteredData[0].fields.customfield_11702.allowedValues;
        callback(_.map(filteredData, function(val) {
            return { value: val.value, id: val.id };
        }));
    });
};

JiraData.getSprints = function(callback) {
    var pathname = 'issue/createmeta',
        query = '?projectKeys=VOY&issuetypeName=Sub-Task&expand=projects.issuetypes.fields';
    get(pathname, query, function(data) {
        var fieldData = JSON.parse(data);
        var filteredData = _.where(fieldData.projects[0].issuetypes, {id: "5"});
        filteredData = filteredData[0].fields.customfield_14002;
        console.log(filteredData);
        callback(filteredData);
    });
};

JiraData.getTasks = function(team, sprint, callback) {
    var pathname = 'search',
        query = '?jql=project = Voyager AND Team = ' +
        team + ' AND issuetype = "Sub-task" AND Sprint = "' +
        sprint + '" AND status != "Done" ORDER BY Rank ASC&fields=id,key,summary,status';
    get(pathname, query, callback);
};

JiraData.getSprintTasks = function(sprint, callback) {
    var pathname = 'search',
        query = '?jql=project = Voyager AND Sprint = "' +
        sprint + '" AND issuetype = "Sub-task" AND status != "Done" ORDER BY Rank ASC&fields=id,customfield_11702,key,summary,status';
    get(pathname, query, callback);
};

JiraData.getSprintTeams = function(sprint, callback) {
    var pathname = 'search',
        query = '?jql=project = Voyager AND Sprint = "' +
        sprint + '" ORDER BY Rank ASC&fields=id,customfield_11702';
    
    get(pathname, query, function(data) {
        var fieldData = JSON.parse(data);
        var uniqueTeams = fieldData.issues;
        uniqueTeams = _.map(uniqueTeams, function(issues) { 
            return issues.fields.customfield_11702.value; 
        });
        uniqueTeams = _.uniq(uniqueTeams);
        console.log(uniqueTeams);
        callback(fieldData);
    });
};

function get(pathname, query, callback) {
    var options = {
        pathname: 'jira/rest/api/2/' + pathname,
        protocol: 'https:',
        hostname: 'jira',
        auth: 's-nero:$A#dxPZ@3',
        search: query
    };
console.log(url.format(options));
    https.get(url.format(options), function(res) {
        var data = '';
        res.on('data', function(d) {
            data += d;
        });
        res.on('end', function(d) {
            if(d) {
                data += d;
            }
            callback(data);
        });
    }).on('error', function(e) {
        console.log('Error: ' + e);
    });
}


module.exports = JiraData;
