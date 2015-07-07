var request = require('request-json');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var client = request.createClient('https://jira.sea.corp.expecn.com');

client.setBasicAuth('chgeorge', 'password');

client.get('jira/rest/api/2/issue/1051293', function (err, res, body) {
    return console.log(body.rows[0].title);
});