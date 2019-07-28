#!/usr/bin/env node

const util = require('util');
//const pathToRegexp = require('path-to-regexp');

const mongoose = require('mongoose');
const userService = require('../src/api/services/user');
const topicService = require('../src/api/services/topic');
const opinionService = require('../src/api/services/opinion');
const dialogService = require('../src/api/services/dialog');

const User = require('../src/api/models/user');
const Topic = require('../src/api/models/topic');
const Opinion = require('../src/api/models/opinion');
const Dialog = require('../src/api/models/dialog');

const server = "http://localhost:3100";
const request = require('request-promise');

mongoose.set('useNewUrlParser',true);
mongoose.set('useCreateIndex',true);
mongoose.connect("mongodb://localhost/dpt-dev");


function say(x) { console.log(x); }

const uuidReg = "([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})";
const mongoReg = "([0-9a-fA-F]{24})";
const topicIdReg = mongoReg;
const opinionIdReg = mongoReg;
const dialogIdReg = mongoReg;

var match = [];
match.push({path: "^/metadata/user/"+ uuidReg +"/$", method: "get", fun: function() { console.log("get user metadata") }});
match.push({path: "^/user/$", method: "get", fun: async () => { return userService.getUsers()} });
match.push({path: "^/user/$", method: "post", fun: async (data) => { return userService.createUser(data)} });
match.push({path: "^/user/online/$", method: "get", fun: async () => { return userService.onlineUsers()} });
match.push({path: "^/user/login/$", method: "post", fun: function() { console.log("user login") }});
match.push({path: "^/user/"+ uuidReg +"/$", method: "put", fun: function() { console.log("update user data") }});
match.push({path: "^/user/"+ uuidReg +"/$", method: "delete", fun: function() { console.log("delete user data") }});
match.push({path: "^/topic/$", method: "get", fun: async () => { return topicService.getTopics()} });
match.push({path: "^/topic/$", method: "post", fun: function() { console.log("create a new topic") }});
match.push({path: "^/topic/"+ topicIdReg +"/$", method: "put", fun: function() { console.log("update a topic") }});
match.push({path: "^/opinion/$", method: "get", fun: function() { console.log("get opinions list") }});
match.push({path: "^/opinion/$", method: "post", fun: function() { console.log("create a new opinion") }});
match.push({path: "^/opinion/"+ opinionIdReg +"/$", method: "put", fun: function() { console.log("update a opinion") }});
match.push({path: "^/dialog/$", method: "get", fun: function() { console.log("get dialogs list") }});
match.push({path: "^/dialog/$", method: "post", fun: function() { console.log("create a new dialog") }});
match.push({path: "^/dialog/"+ dialogIdReg +"/$", method: "put", fun: function() { console.log("update a dialog") }});
match.push({path: "^/dialog/"+ dialogIdReg +"/message/$", method: "post", fun: function() { console.log("create a new message") }});
match.push({path: "^/dialog/"+ dialogIdReg +"/crisis/$", method: "post", fun: function() { console.log("escalate dialog") }});


async function triggerService(obj) {
	try {
		var res;
		if(obj.method == "post") {
			for(var i=0; i < match.length; i++) {
			    if(obj.path.match(match[i].path) && match[i].method == "post") {
			        res = await match[i].fun(obj.data); 
			        console.log(">> "+res);
			    }
			}
		} else if(obj.method == 'get') {
			for(var i=0; i < match.length; i++) {
			    if(obj.path.match(match[i].path) && match[i].method == "get") {
			        res = await match[i].fun(); 
			    }
			}
		}
	} catch(err) {
		say("error: " + err);
	}
	return(res);
}
/*
				var res = await topicService.createTopic(obj.data);
				var list = await topicService.getTopics();
*/
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
} 

async function main() {
	await sleep(5000);
	ret = await triggerService({method: "get", path: "/user/"});	
	console.log(ret);

//	ret = await triggerService({method: "get", path: "/user/online/"});	
//	console.log(ret);

	ret = await triggerService({method: "get", path: "/topic/"});	
	console.log(ret);

	var new_user = new User.userModel;
	new_user.publicKey = "publicKey23";
	ret = await triggerService({method: "post", path: "/user/", data: { body: new_user }});	
	say(ret);


//	process.exit();
}

main();
