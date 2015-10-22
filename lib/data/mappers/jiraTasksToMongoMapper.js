"use strict";

exports.map = function (data) {
	// filter jira task objects use the issues array, find the resolution date and the status where the status is done
	// also need to know what day of the sprint that resolution date fell on
	
	
	// {
	// 	expand: "schema,names",
	// 	startAt: 0,
	// 	maxResults: 50,
	// 	total: 72,
	// 	issues: [
	// 		{
	// 			expand: "operations,editmeta,changelog,transitions,renderedFields",
	// 			id: "1366039",
	// 			self: "https://jira/jira/rest/api/2/issue/1366039",
	// 			key: "VOY-44288",
	// 			fields: {
	// 				summary: "Code Coverage: Add testing for anonymous callback found in the case of ajax errors",
	// 				--> resolutiondate: "2015-10-01T07:56:54.000-0700",
	// 				resolution: {
	// 					self: "https://jira/jira/rest/api/2/resolution/1",
	// 					id: "1",
	// 					description: "A fix for this issue is checked into the tree and tested.",
	// 					name: "Fixed"
	// 				},
	// 				status: {
	// 					self: "https://jira/jira/rest/api/2/status/10013",
	// 					description: "",
	// 					iconUrl: "https://jira/jira/images/icons/statuses/closed.png",
	// 					--> name: "Done",
	// 					id: "10013",
	// 					statusCategory: {
	// 						self: "https://jira/jira/rest/api/2/statuscategory/3",
	// 						id: 3,
	// 						key: "done",
	// 						colorName: "green",
	// 						name: "Complete"
	// 					}
	// 				}
	// 			}
	// 		},
	
}