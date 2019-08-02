const mongoose 		= require('mongoose');
const Lo_			= require('lodash');

const userService	= require('./services/user');
const topicService	= require('./services/topic');
const opinionService= require('./services/opinion');
const dialogService	= require('./services/dialog');

const uuidReg		= "([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})";
const mongoReg		= "([0-9a-fA-F]{24})";
const topicIdReg	= mongoReg;
const opinionIdReg	= mongoReg;
const dialogIdReg	= mongoReg;

const match = [];


var io;
module.exports = (importIo) => { io = importIo; return(match); }	

/*
	userRegistered is a little helper function, to check if a
	current online user is registered or not. unregistered users can't
	post something, etc.
 */
function userRegistered(dptUUID) {
	var user = Lo_.find(global.dptNS.online, {dptUUID: dptUUID});
	if(user.registered) {
		return(user);
	} else {
		return(false);
	}
}


/*
	from here on we setup the match array, which will be used in the
	apiBroker function. this array defines each api entry point. the associated
	function will work with the data it may receive via the apiBroker and
	it will also return an object, the data part of an object, which looks like
	a mutation of the request object itself. if a return value is required.
	most times, the action of the functions is the call of a service function.
 */


match.push({
	path: "/metadata/user/"+ uuidReg +"/",
	method: "get",
	fun: function() {
		console.log("get user metadata")
	}
});

// not in the api and maybe needs to protected, somehow.
// this entry point will return a list of all users.
match.push({
	path: "/user/",
	method: "get",
	fun: async () => {
		return userService.getUsers();
	}
});


// creates a new user.
match.push({path: "/user/", method: "post",
	fun: async (data, dptUUID) => {
		data.id = "";
		return(userService.createUser({body: data}));
	}
});

// returns a list of current online users
match.push({
	path: "/user/online/",
	method: "get",
	fun: async () => {
		return userService.onlineUsers();
	}
});

// this entrypoint will never be called in the socket.io environment
// instead we use a socket.on("login", ...), not via socket.on("api", ...)
match.push({
	path: "/user/login/",
	method: "post",
	fun: function() {
		console.log("user login");
	}
});

match.push({
	path: "/user/"+ uuidReg +"/",
	method: "put",
	fun: function() {
		console.log("update user data");
	}
});

// users with login difficulties will end up here.
match.push({
	path: "/userReclaim/",
	method: "put",
	fun: async (data) => {
		return userService.reclaimUser(data);
	}
});

match.push({
	path: "/user/"+ uuidReg +"/",
	method: "delete",
	fun: function() {
		console.log("delete user data");
	}
});

// get a list of all topics
match.push({
	path: "/topic/",
	method: "get",
	fun: async () => {
		return topicService.getTopics();
	}
});

// creates a new socket. it also informs all online users about this event.
match.push({
	path: "/topic/",
	method: "post",
	fun: async (data, dptUUID) => {
		var user;
		if(user = userRegistered(dptUUID)) {
			data.user = user.user._id;
			const ret = await topicService.topicPost({body: data});
			io.emit('update', { path: '/topic/', method: 'get'});
			return(ret);
		} else {
			return({});
		}
	}
});

match.push({
	path: "/topic/"+ topicIdReg +"/",
	method: "put",
	fun: function() {
		console.log("update a topic");
	}
});

// returns a list of all opinions
match.push({
	path: "/opinion/",
	method: "get",
	fun: function() {
		return opinionService.getOpinions()
	}
});

// returns a list of all opinions associated to a specific topic
match.push({
	path: "/opinion/"+ topicIdReg +"/",
	method: "get",
	fun: function(data) {
		data.id = mongoose.Types.ObjectId(data.id);
		return(opinionService.getOpinions({body: data}));
	}
});

// returns a bool value, if the user is allowed to post an opinion
match.push({
	path: "/opinionPostAllowed/",
	method: "get",
	fun: async (data, dptUUID) => {
		var user;
		if(user = userRegistered(dptUUID)) {
			var bool = await opinionService.opinionPostAllowed({body: data}, user.user);
			return({ data: {value: bool}});
		}
	}
});

// creates a new opinion and informs all connected clients about this event
match.push({
	path: "/opinion/",
	method: "post",
	fun: async (data, dptUUID) => {
		var user;
		if(user = userRegistered(dptUUID)) {
			data.user = user.user._id;
			const ret = await opinionService.opinionPost({body: data});
			io.emit('update', {
				path: '/opinion/'+data.topic+'/',
				method: 'get',
				data: { id: data.topic }
			});
			return(ret);
		} else {
			return({});
		}
	}
});

match.push({
	path: "/opinion/"+ opinionIdReg +"/",
	method: "put",
	fun: function() {
		console.log("update a opinion");
	}
});

match.push({
	path: "/dialog/",
	method: "get",
	fun: function() {
		console.log("get dialogs list");
	}
});

match.push({
	path: "/dialog/",
	method: "post",
	fun: function() {
		console.log("create a new dialog");
	}
});

match.push({
	path: "/dialog/"+ dialogIdReg +"/",
	method: "put",
	fun: function() {
		console.log("update a dialog")
	}
});

match.push({
	path: "/dialog/"+ dialogIdReg +"/message/",
	method: "post",
	fun: function() {
		console.log("create a new message");
	}
});

match.push({
	path: "/dialog/"+ dialogIdReg +"/crisis/",
	method: "post",
	fun: function() {
		console.log("escalate dialog");
	}
});
