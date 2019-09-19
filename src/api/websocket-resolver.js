const mongoose 		= require('mongoose');
const Lo_			= require('lodash');

const userService		= require('./services/user');
const topicService		= require('./services/topic');
const opinionService	= require('./services/opinion');
const dialogService		= require('./services/dialog');
const metadataService	= require('./services/metadata');

const uuidReg		= "([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})";
const mongoReg		= "([0-9a-fA-F]{24})";
const topicIdReg	= mongoReg;
const opinionIdReg	= mongoReg;
const dialogIdReg	= mongoReg;

const config		= require("../lib/config");
const logger	= require("../lib/logger");
const log		= logger(config.logger);

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
	Send an update info of modified dialog.
 */
async function publishDialogUpdate(dialogId) {
	var dialog = await dialogService.getDialog({body: {dialogId: dialogId}});
	for(var i = 0; i < global.dptNS.online.length; i++) {
		if(global.dptNS.online[i].user.id == dialog.data.initiator.toString()
		|| global.dptNS.online[i].user.id == dialog.data.recipient.toString()) {
			global.dptNS.online[i].socket.emit('update', {path: '/dialog/'+dialogId+'/', method: 'get'});
		}
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

// test path for nils
match.push({
	path: "/nilsTestPath/",
	method: "post",
	fun: async (data, dptUUID) => {
		return({
			status: 200,
			data: data.content.split("").reverse().join("")
		});
	}
});

match.push({
	path: "/user/registrered/"+ uuidReg +"/",
	method: "get",
	fun: async (data, dptUUID) => {
		return(await userRegistered(dptUUID));
	}
});

match.push({
	path: "/metadata/user/"+ uuidReg +"/",
	method: "get",
	fun: async function(data, dptUUID) {
		const user = metadataService.getUserMetadata({body: {publicKey: dptUUID}});
		delete(user.phrase);
		delete(user._id);
		delete(user.__v);
		return(user);
	}
});


// not in the api and maybe needs to get protected, somehow.
// this entry point will return a list of all users.
match.push({
	path: "/user/",
	method: "get",
	fun: async () => {
		return userService.getUsers();
	}
});


// creates a new user.
match.push({
	path: "/user/",
	method: "post",
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
	path: "/user/reclaim/"+ uuidReg +"/",
	method: "put",
	fun: async (data) => {
		var userData = await userService.userReclaim(data);
		if(userData.newCookie) {
			var cookie = require('cookie-signature');
			userData.newCookie = 's:' + cookie.sign(userData.newCookie, process.env.DPT_SECRET);
		}
		var ret = {
			path: '/user/reclaim',
			method: 'put',
			data: userData
		};
		return(ret);
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

// creates a new topic. it also informs all online users about this event.
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
	fun: async function(data, dptUUID) {
		var user;
		if(user = userRegistered(dptUUID)) { // && user.user._id ==) {
			const ret = await topicService.topicPut({topicId: data.topicId, body: data.body});
			io.emit('update', {
				path: '/topic/',
				method: 'get',
				data:  {}
			});
			return(ret);
		} else {
			return({});
		}
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
	fun: async function(data, dptUUID) {
		var user = userRegistered(dptUUID)
		data.id = mongoose.Types.ObjectId(data.id);
		var ret = await opinionService.getOpinionsByTopicId({body: data}, user.user.id);
		return(ret);
	}
});

// returns a bool value, if the user is allowed to post an opinion
match.push({
	path: "/opinion/postAllowed/",
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
	fun: async function(data, dptUUID) {
		var user;
		if(user = userRegistered(dptUUID)) { // && user.user._id ==) {
			const ret = await opinionService.opinionPut({opinionId: data.opinionId, body: data.body});
			io.emit('update', {
				path: '/opinion/'+data.topicId+'/',
				method: 'get',
				data: { id: data.topicId }
			});
			return(ret);
		} else {
			return({status: 400, data: "User not found"});
		}
	}
});

match.push({
	path: "/dialog/list/",
	method: "get",
	fun: async function(data, dptUUID) {
		console.log("get my dialogs list");
		var user = userRegistered(dptUUID);
		var ret;
		if(user) {
			ret = await dialogService.getDialogList({userId: mongoose.Types.ObjectId(user.user.id)});
			return({data: ret});
		}
		return(data);
	}
});

match.push({
	path: "/dialog/listAll/",
	method: "get",
	fun: async function(data, dptUUID) {
		console.log("get all dialogs list");
		var user = userRegistered(dptUUID);
		var ret;
		if(user) {
			ret = await dialogService.getDialogListAll({userId: mongoose.Types.ObjectId(user.user.id)});
			return({data: ret});
		}
		return(data);
	}
});

match.push({
	path: "/dialog/"+dialogIdReg+"/",
	method: "get",
	fun: async function(data, dptUUID, socket) {
		console.log("get a dialog");
		var user = userRegistered(dptUUID);
		var dialog = {};
		dialog.messages = [];
		dialog.crisises = [];
		dialog.extensionRequests = [];
		if(user) {
			var ret = await dialogService.getDialog(data);
			ret = ret.data;
//			dialog.crisises = ret.crisises;
			dialog.status = ret.status;
			dialog.opinionProposition = ret.opinionProposition;
			dialog.extension = ret.extension;
			dialog.dialog = ret._id.toString();
			
			if(ret.initiator.toString() == user.user.id) {
				dialog.initiator = 'me';
				dialog.recipient = 'notme';
			} else {
				dialog.initiator = 'notme';
				dialog.recipient = 'me';
			}

			for(var i=0; i < ret.crisises.length; i++) {
				var crisis = {};
				crisis.crisisesId = ret.crisises[i]._id.toString();
				if(ret.crisises[i].initiator.toString() == user.user.id) {
					crisis.initiator = 'me';
				} else {
					crisis.initiator = 'notme';
				}
				if(ret.status == 'CLOSED') {
					crisis.reason = ret.crisises[i].reason;
					crisis.rating = ret.crisises[i].rating;
				}
				dialog.crisises.push(crisis);
			}

			for(var i=0; i < ret.messages.length; i++) {
				var message = {};
				message.messageId = ret.messages[i]._id.toString();
				message.content = ret.messages[i].content;
				if(ret.messages[i].sender.toString() == user.user.id) {
					message.sender = 'me';
				} else {
					message.sender = 'notme';
				}
				dialog.messages.push(message);
			}
			
			for(var i=0; i < ret.extensionRequests.length; i++) {
				var request = {};
				request.extensionRequestId = ret.extensionRequests[i]._id.toString();
				if(ret.extensionRequests[i].sender.toString() == user.user.id) {
					request.sender = 'me';
				} else {
					request.sender = 'notme';
				}

				dialog.extensionRequests.push(request);
			}

			return({data: dialog});
		}
	}
});

match.push({
	path: "/dialog/",
	method: "post",
	fun: async function(data, dptUUID, socket) {
		var user = userRegistered(data.dptUUID);
		if(user) {
			data.body.initiator = user.user.id;
			const ret = await dialogService.createDialog(data.body);
			socket.emit('update', {path: '/dialog/list/', method: 'get'});
			return({data: ret});
		}
	}
});

match.push({
	path: "/dialog/"+ dialogIdReg +"/",
	method: "put",
	fun: async function(data, dptUUID, socket) {
		console.log("update a dialog")
		dialogService.updateDialog(data);
	}
});

match.push({
	path: "/dialog/"+ dialogIdReg +"/message/",
	method: "post",
	fun: async function(data, dptUUID, socket) {
		var user = userRegistered(data.publicKey);
		if(user) {
			console.log("create a new message");
			const ret = await dialogService.postMessage({
				dialogId: data.dialogId,
				body: {
					content: data.message,
					sender: user.user.id
				}
			});
			if(ret.status == 200) {
				publishDialogUpdate(data.dialogId);
			}
			return({data: ret});
		} else {
			return({data: {status: 400, data: "User not found" }});
		}
	}
});

match.push({
	path: "/dialog/"+ dialogIdReg +"/crisis/",
	method: "post",
	fun: async function(data, dptUUID, socket) {
		var user = userRegistered(data.initiator);
		if(user) {
			console.log("escalate dialog");
			const ret = await dialogService.createCrisis({
				dialogId: data.dialogId,
				body: {
					causingMessage: data.causingMessage,
					reason: data.reason,
					rating: data.rating,
					initiator: user.user.id,
				}
			});
			return(ret);
		} else {
			return({data: {status: 400, data: "User not found" }});
		}
	}
});

match.push({
	path: "/dialog/"+ dialogIdReg +"/extensionRequest/",
	method: "post",
	fun: async function(data, dptUUID, socket) {
		var user = userRegistered(data.sender);
		if(user) {
			console.log("dialog extension requested");
			ret = await dialogService.extensionRequest({ dialogId: data.dialogId, body: { sender: user.user.id }});
			/*
			for(var i=0; i < ret.length; i++) {
				if(ret.sender == user.user.id) {
					ret.sender = 'me';
				} else {
					ret.sender = 'notme';
				}
			}
			*/
			if(ret.status == 200) {
				publishDialogUpdate(data.dialogId);
			}
			return({ data: {} });
		} else {
			return({data: {status: 400, data: "User not found" }});
		}
	}
});
