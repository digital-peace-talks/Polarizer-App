/**
 * http://usejsdoc.org/
 */

const mongoose 		= require('mongoose');
const Lo_			= require('lodash');
const cookieParser	= require('cookie-parser');
const util			= require('util');
var io				= require('socket.io')();

const userService		= require('./services/user');
const topicService		= require('./services/topic');
const opinionService	= require('./services/opinion');
const dialogService		= require('./services/dialog');

const User			= require('./models/user');
const Topic			= require('./models/topic');
const Opinion		= require('./models/opinion');
const Dialog		= require('./models/dialog');

const config		= require("../lib/config");
const logger	= require("../lib/logger");
const log		= logger(config.logger);


var cookieKey		= "geheim";

const uuidReg		= "([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})";
const mongoReg		= "([0-9a-fA-F]{24})";
const topicIdReg	= mongoReg;
const opinionIdReg	= mongoReg;
const dialogIdReg	= mongoReg;

const match = [];
match.push({path: "/metadata/user/"+ uuidReg +"/", method: "get", fun: function() { console.log("get user metadata") }});
match.push({path: "/user/", method: "get", fun: async () => { return userService.getUsers()} });
match.push({path: "/user/", method: "post",
	fun: async (data, dptUUID) => {
		data.id = "";
		return(userService.createUser({body: data}));
	}});
match.push({path: "/user/online/", method: "get", fun: async () => { return userService.onlineUsers()} });
match.push({path: "/user/login/", method: "post", fun: function() { console.log("user login") }});
match.push({path: "/user/"+ uuidReg +"/", method: "put", fun: function() { console.log("update user data") }});
match.push({path: "/user/"+ uuidReg +"/", method: "delete", fun: function() { console.log("delete user data") }});
match.push({path: "/topic/", method: "get", fun: async () => { return topicService.getTopics()} });
match.push({path: "/topic/", method: "post",
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
	}});
match.push({path: "/topic/"+ topicIdReg +"/", method: "put", fun: function() { console.log("update a topic") }});
match.push({path: "/opinion/", method: "get", fun: function() { return opinionService.getOpinions()} });
match.push({path: "/opinion/"+ opinionIdReg +"/", method: "get",
	fun: function(data) {
		data.id = mongoose.Types.ObjectId(data.id);
		return opinionService.getOpinions({body: data})
	}});
match.push({path: "/opinion/", method: "post",
	fun: async (data, dptUUID) => {
		var user;
		if(user = userRegistered(dptUUID)) {
			data.user = user.user._id;
			const ret = await opinionService.opinionPost({body: data});
			io.emit('update', { path: '/opinion/'+data.topic+'/', method: 'get', data: { id: data.topic }});
			return(ret);
		} else {
			return({});
		}
	}});
match.push({path: "/opinion/"+ opinionIdReg +"/", method: "put", fun: function() { console.log("update a opinion") }});
match.push({path: "/dialog/", method: "get", fun: function() { console.log("get dialogs list") }});
match.push({path: "/dialog/", method: "post", fun: function() { console.log("create a new dialog") }});
match.push({path: "/dialog/"+ dialogIdReg +"/", method: "put", fun: function() { console.log("update a dialog") }});
match.push({path: "/dialog/"+ dialogIdReg +"/message/", method: "post", fun: function() { console.log("create a new message") }});
match.push({path: "/dialog/"+ dialogIdReg +"/crisis/", method: "post", fun: function() { console.log("escalate dialog") }});

function userRegistered(dptUUID) {
	var user = Lo_.find(global.dptNS.online, {dptUUID: dptUUID});
	if(user.registered) {
		return(user);
	} else {
		return(false);
	}
}


async function triggerService(obj, dptUUID) {
	try {
		var res;
		if(obj.method == "post") {
			for(var i=0; i < match.length; i++) {
			    if(obj.path.match('^'+match[i].path+'$') && match[i].method == "post") {

			        res = await match[i].fun(obj.data, dptUUID); 
			        // clone the data
			        res = JSON.parse(JSON.stringify(res.data));
			        // hide the users mongodb id.
			        res = res.map(e => ({...e, user: "Cafe-C0ffe-C0de"}));
			        // re-pack it.
			        res = { method: match[i].method, path: match[i].path, data: res };
			        return(res);
			    }
			}
		} else if(obj.method == 'get') {
			for(var i=0; i < match.length; i++) {
			    if(obj.path.match('^'+match[i].path+'$') && match[i].method == "get") {

			        res = await match[i].fun(obj.data); 
			        // clone the data
			        res = JSON.parse(JSON.stringify(res.data));
			        // hide the users mongodb id.
			        res = await res.map(e => ({...e, user: "Cafe-C0ffe-C0de"}));
			        // re-pack it.
			        res = { method: match[i].method, path: match[i].path, data: res };
			        return(res);
			    }
			}
		}
	} catch(err) {
		log.error("error: " + err);
	}
	return(res);
}
/*
Setup of the socket.io service
*/
io.on('connection', function(socket) {
	console.log("socket.id: "+socket.id);

	socket.on('kanal', function(msg) {
		io.emit('kanal', { username: socket.username, message: msg });
		//log.info("rooms: "+JSON.stringify(io.sockets.adapter.rooms, null, 2));
		log.info("rooms: "+JSON.stringify(socket.adapter.rooms, null, 2));
		log.info("sids: "+JSON.stringify(io.sockets.adapter.sids, null, 2));
		log.info("got message: "+msg);
	});

	socket.on('channel', function(msg) {
		io.emit('channel', { username: socket.username, message: msg });
		log.info("got message: "+msg);
	});

	socket.on('add user', async (payload) => {
		if(payload) {
			var testUUID = require('cookie').parse(payload)['dptUUID'];
			var dptUUID = cookieParser.signedCookie(testUUID, cookieKey);
			log.info("check dptUUID: "+dptUUID);
			if(dptUUID != false) {
				socket.dptUUID = dptUUID;
				socket.username = socket.id;
				log.info("uuid -> socket.dptUUID: "+socket.dptUUID +' socket.username: '+socket.username);
				var user = await User.userModel.find({publicKey: dptUUID});
				if(user.length && dptUUID) {
					global.dptNS.online.push( { socketid: socket.id, dptUUID: dptUUID, registered: true, user: user[0]});
					log.info('updated global online (user+): '+require('util').inspect(global.dptNS.online));
					socket.emit('private', {method: 'post', path: "/info/", payload: {message: 'Welcome back to digitial peace talks, '+socket.username+'.', status: 200}});
				} else {
					global.dptNS.online.push( { socketid: socket.id, dptUUID: dptUUID, registered: false });
					log.info('updated global online (user+): '+require('util').inspect(global.dptNS.online));
					if(dptUUID) {
						socket.emit('private', {method: 'post', path: '/info/', payload: {message: "user unknown", dptUUID: dptUUID, status: 404}});
					} else {
						socket.emit('private', {method: 'post', path: '/info', payload: {message: "maybe cookies are disabled?", status: 404}});
					}
				}
			}
		}
	});
	
	socket.on('api', async (payload) => {
		log.debug('sio request: '+util.inspect(payload));
		var ret = await triggerService(payload, socket.dptUUID);
		socket.emit('api', ret);
		log.debug('answer sio request: '+util.inspect(ret));
	});

	socket.on('disconnect', (reason) => {
		log.info(socket.id+" disconnected, reason: "+reason);
		Lo_.pull(global.dptNS.online, Lo_.find(global.dptNS.online, {socketid: socket.id}));
		log.info('updated global online (user-): '+require('util').inspect(global.dptNS.online));
	});
});

module.exports = io;