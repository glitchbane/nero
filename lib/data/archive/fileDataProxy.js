var fs = require("fs")

module.exports = {

    getTeamList: function (callback) {

        var teamData = fs.readFileSync("\lib\\data\\fixtures\\voyager-teams.json");

        callback(null, JSON.parse(teamData));
    }
}
