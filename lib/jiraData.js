var https = require('https'),
    url = require('url'),
    _ = require('underscore');



        // constants
    var username =  's-nero',
        password = '$A#dxPZ@3',
        jiraApiRootPath = 'jira/rest/api/2/',
        jiraHostName = 'jira',
    
        // paths
        jqlSearchPath =  'search',
        createMetaPath = 'issue/createmeta',
    
        jiraAuth =  function() {
            return username + ':' + password;
        },
    
        // queries
        
        // - used to get all fields associated with the issue type 'sub-task'
        subtaskFieldsQuery = '?projectKeys=VOY&issuetypeName=Sub-Task&expand=projects.issuetypes.fields',        
        
        tasksQuery =  function(team, sprint) {
            return '?jql=project = Voyager AND Team = ' +
            team + ' AND issuetype = "Sub-task" AND Sprint = "' +
            sprint + '" AND status != "Done" ORDER BY Rank ASC&fields=id,key,summary,status';
        },
    
        sprintTasksQuery = function(sprint) {
            return '?jql=project = Voyager AND Sprint = "' +
            sprint + '" AND issuetype = "Sub-task" AND status != "Done" ORDER BY Rank ASC&fields=id,customfield_11702,key,summary,status';
        },
    
        sprintTeamsQuery =  function(sprint) {
            return '?jql=project = Voyager AND Sprint = "' +
            sprint + '" &fields=id,customfield_11702';
        },
    
        // filters
        filterBySubTask =  function (rawData) {
            var jsonData = JSON.parse(rawData)
           return _.where(jsonData.projects[0].issuetypes, {id: "5"});
        },
    
        filterFieldOptions =  function(issueFields, filterField) {
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
        },
    

        // API
        getTeams = function(callback) {
            // called like /teams
        var pathname = createMetaPath,
            query = subtaskFieldsQuery;
    
            getJiraData(pathname, query, function(data) {
                var filteredData = filterFieldOptions(filterBySubTask(data), 'customfield_11702');        
                
                callback(filteredData);
            });
        },

        getSprints = function(callback) {
            // called like /sprints
            var pathname = createMetaPath,
                query = subtaskFieldsQuery;
            
            getJiraData(pathname, query, function(data) {
                var filteredData = filterFieldOptions(filterBySubTask(data), 'customfield_14002');  
                callback(filteredData);
            });
        },

        getTasks = function(team, sprint, callback) {
            // called like /tasks/Alliance/77            
            var pathname = jqlSearchPath,
                query = tasksQuery(team, sprint);
            console.log(query);
            getJiraData(pathname, query, callback);
        },
        
        getBurndownData = function(team, sprint) {
            var pathname = jqlSearchPath,
            query = tasksQuery(team, sprint);
            getJiraData(pathname, query, prepareChartData);
            
        };
        
        prepareChartData = function(data) {
            // data is one json array of objects
            var sprintData = JSON.parse(data);
            var sprintIssues = sprintData.issues;
            var dates = getUniqueResolutionDates(sprintIssues);            
        };
        
        getSprintStartDate = function(sprintNumber) {
            // sprint 77 started on 7/9/2015.  
            var motherSprint = 77,
                motherSprintStart = new Date('7/9/2015'),
                sprintDiff = sprintNumber - motherSprint;
                
            // multiply the diff by 14 to get the number of days to add
            var addedDays = sprintDiff * 14;
            
            return motherSprintStart.addDays(addedDays);
        }
        
        Date.prototype.addDays = function(days) {
                var laterDate = new Date(this.valueOf());
                laterDate.setDate(laterDate.getDate() + days);
                return laterDate;
        };
            
        getUniqueResolutionDates = function(issues) {
            var resDates = _.map(issues, function(issue) {
                var resDate = issue.fields.resolutiondate;
                if (resDate !== null) {
                    return resDate.split('T')[0];                    
                }
                
            return _.uniq(resDates);
        })
            
        };

        getSprintTasks = function(sprint, callback) {
            // called like /tasks/77
            var pathname = 'search',
                query = sprintTasksQuery(sprint);
            
            getJiraData(pathname, query, callback);
        },

        getSprintTeams = function(sprint, callback) {
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
        },

        getJiraData = function(pathname, query, callback) {

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
                    if(d) {
                        data += d;
                    }
                    callback(data);
                });
            }).on('error', function(e) {
                console.log('Error: ' + e);
            });
        }


module.exports = {
        getTeams: getTeams,
        getTasks: getTasks,
        getSprints: getSprints,
        getSprintTeams: getSprintTeams,
        getSprintTasks: getSprintTasks
    };
