var https = require('https'),
	url = require('url'),
	express = require('express');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function getData(callback) {
	var options = {
		auth: 's-nero:$A#dxPZ@3',
		hostname: 'jira',
		pathname: '/jira/rest/api/2/issue/1051293',
		protocol: 'https:'
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

var app = express();

app.get('/', function(req, res) {
	getData(function(data) {
		res.json(JSON.parse(data));
	});
});

app.listen(3000);








