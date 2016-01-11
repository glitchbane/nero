var Moment = require("moment");
// this will represent the "mother sprint" start date, from which we can calculate the days of each sprint
var sprintEpochStartDate = Moment("2014-08-06");
var sprintEpochSprintNumber = 53;
var daysInASprint = 14; //normally

module.exports.dayOfSprint = function(date) {
	var dayOfSprint;
	
	if (!date._isAMomentObject)  {// make it one
		date = Moment(date);
		if(!date.isValid()) {
			throw new Error("dayOfSprint: date was invalid");
		}
	}
		// number of days between the beginning of the epoch and the given date
	dayOfSprint =  (Moment.utc(Moment(date,"DD/MM/YYYY HH:mm:ss").diff(Moment(sprintEpochStartDate,"DD/MM/YYYY HH:mm:ss"))).format("DD")) % daysInASprint;
	console.log("dayOfSprint: " + dayOfSprint);
	
	return dayOfSprint;
}

module.exports.sprintStartDate = function(sprintNumber) {
	// sprint 53 started on 8/6/2014
	// get difference between sprint number and 53, multiply by 2 to get number of weeks then add that to epoch start date
	var numWeeksSinceEpoch = ((sprintNumber - sprintEpochSprintNumber) * 2);
	var sprintStartDate = Moment.add(numWeeksSinceEpoch, 'weeks');
	
	return sprintStartDate;
}