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

function userRegistered(dptUUID) {
	var user = Lo_.find(global.dptNS.online, {dptUUID: dptUUID});
	if(user.registered) {
		return(user);
	} else {
		return(false);
	}
}



match.push({
	path: "/metadata/user/"+ uuidReg +"/",
	method: "get",
	fun: function() {
		console.log("get user metadata")
	}
});

match.push({
	path: "/user/",
	method: "get",
	fun: async () => {
		return userService.getUsers();
	}
});

match.push({path: "/user/", method: "post",
	fun: async (data, dptUUID) => {
		data.id = "";
		return(userService.createUser({body: data}));
	}
});

match.push({
	path: "/user/online/",
	method: "get",
	fun: async () => {
		return userService.onlineUsers();
	}
});

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

match.push({
	path: "/topic/",
	method: "get",
	fun: async () => {
		return topicService.getTopics();
	}
});

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

match.push({
	path: "/opinion/",
	method: "get",
	fun: function() {
		return opinionService.getOpinions()
	}
});

match.push({
	path: "/opinion/"+ opinionIdReg +"/",
	method: "get",
	fun: function(data) {
		data.id = mongoose.Types.ObjectId(data.id);
		return(opinionService.getOpinions({body: data}));
	}
});

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
