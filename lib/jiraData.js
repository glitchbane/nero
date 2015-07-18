var https = require('https'),
    url = require('url'),
    _ = require('underscore');

var JiraData = {

    // constants
    username: 's-nero',
    password: '$A#dxPZ@3',
    jiraApiRootPath: 'jira/rest/api/2/',
    jiraHostName: 'jira',
    
    // paths
    jqlSearchPath: 'search',
    createMetaPath: 'issue/createmeta',
    
    jiraAuth: function() {
        return this.username + ':' + this.password;
    },
    
    // queries
    
    // - used to get all fields associated with the issue type 'sub-task'
    subtaskFieldsQuery: '?projectKeys=VOY&issuetypeName=Sub-Task&expand=projects.issuetypes.fields',        
    
    tasksQuery: function(team, sprint) {
        return '?jql=project = Voyager AND Team = ' +
        team + ' AND issuetype = "Sub-task" AND Sprint = "' +
        sprint + '" AND status != "Done" ORDER BY Rank ASC&fields=id,key,summary,status';
    },
    
    sprintTasksQuery: function(sprint) {
        return '?jql=project = Voyager AND Sprint = "' +
        sprint + '" AND issuetype = "Sub-task" AND status != "Done" ORDER BY Rank ASC&fields=id,customfield_11702,key,summary,status';
    },
    
    sprintTeamsQuery: function(sprint) {
        return '?jql=project = Voyager AND Sprint = "' +
        sprint + '" &fields=id,customfield_11702';
    },
    
    // filters
    filterBySubTask: function (rawData) {
        var jsonData = JSON.parse(rawData)
       return _.where(jsonData.projects[0].issuetypes, {id: "5"});
    },
    
    filterFieldOptions: function(issueFields, filterField) {
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
                return { value: val.value, id: val.id };
        }));
    }
    
};

JiraData.getTeams = function(callback) {
    var pathname = this.createMetaPath,
        query = this.subtaskFieldsQuery;
    
    getJiraData(pathname, query, function(data) {
        var filteredData = JiraData.filterFieldOptions(JiraData.filterBySubTask(data), 'customfield_11702');        
        
        callback(filteredData);
    });
};

JiraData.getSprints = function(callback) {
    var pathname = this.createMetaPath,
        query = this.subtaskFieldsQuery;
    
    getJiraData(pathname, query, function(data) {
        var filteredData = JiraData.filterFieldOptions(JiraData.filterBySubTask(data), 'customfield_14002');  
        callback(filteredData);
    });
};

JiraData.getTasks = function(team, sprint, callback) {
    var pathname = this.jqlSearchPath,
        query = this.tasksQuery;
    
    getJiraData(pathname, query, callback);
};

JiraData.getSprintTasks = function(sprint, callback) {
    var pathname = 'search',
        query = this.sprintTasksQuery(sprint);
    
    getJiraData(pathname, query, callback);
};

JiraData.getSprintTeams = function(sprint, callback) {
    
    var pathname = this.jqlSearchPath,       
        query = this.sprintTeamsQuery(sprint);
    
    getJiraData(pathname, query, function(data) {
        var fieldData = JiraData.JSON.parse(data);
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
};

function getJiraData(pathname, query, callback) {
    var options = {
        pathname: 'jira/rest/api/2/' + pathname,
        protocol: 'https:',
        hostname: 'jira',
        auth: 's-nero:$A#dxPZ@3',
        search: query
    };
    // var options = {
    //     pathname: this.jiraApiRootPath + pathname,
    //     protocol: 'https:',
    //     hostname: this.jiraHostName,
    //     auth: this.jiraAuth,
    //     search: query
    // };

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
