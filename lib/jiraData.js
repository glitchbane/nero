var https = require('https'),
	url = require('url');

var JiraData = {};

JiraData.getTeams = function() {

};

JiraData.getTasks = function(team, sprint, callback) {
	var pathname = 'search',
		query = '?jql=project = Voyager AND Team = ' +
		team + ' AND issuetype = "Sub-task" AND Sprint = "' +
		sprint + '" ORDER BY Rank ASC';
	get(pathname, query, callback);
};

function get(pathname, query, callback) {
	var options = {
		pathname: 'jira/rest/api/2/' + pathname,
		protocol: 'https:',
		hostname: 'jira',
		auth: 's-nero:$A#dxPZ@3',
		search: query
	}

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