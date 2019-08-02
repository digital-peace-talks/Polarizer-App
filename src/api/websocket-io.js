/**
 * http://usejsdoc.org/
 */

const mongoose 		= require('mongoose');
const Lo_			= require('lodash');
const cookieParser	= require('cookie-parser');
const util			= require('util');
var io				= require('socket.io')();

const User			= require('./models/user');

const config		= require("../lib/config");
const logger	= require("../lib/logger");
const log		= logger(config.logger);


var cookieKey		= process.env.DPT_SECRET;

var match = require('./websocket-resolver.js')(io);



async function apiBroker(obj, dptUUID) {
	try {
		var res;
		if(obj.method == "post"
		|| obj.method == "get"
		|| obj.method == "put"
		|| obj.method == "update"
		|| obj.method == "delete") {
			for(var i=0; i < match.length; i++) {
			    if(obj.path.match('^'+match[i].path+'$')
			    && obj.method == match[i].method) {
			    	// call the matching function
			        res = await match[i].fun(obj.data, dptUUID); 
			        // clone the data
			        res = JSON.parse(JSON.stringify(res.data));
			        // hide the users mongodb id.
			        if(Lo_.isArray(res)) {
			        	res = res.map(e => ({...e, user: "Cafe-C0ffe-C0de"}));
			        } else {
//			        	res.name = "Cafe-C0ffe-C0de";
			        }
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
		var ret = await apiBroker(payload, socket.dptUUID);
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