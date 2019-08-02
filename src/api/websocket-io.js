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


<<<<<<< HEAD
=======

>>>>>>> branch 'master' of git@github.com:digital-peace-talks/DPT-server.git
async function apiBroker(obj, dptUUID) {
	try {
		var ret;
		if(obj.method == "post"
		|| obj.method == "get"
		|| obj.method == "put"
		|| obj.method == "update"
		|| obj.method == "delete") {
			for(var i=0; i < match.length; i++) {
			    if(obj.path.match('^'+match[i].path+'$')
			    && obj.method == match[i].method) {

			    	// call the matching function
			        ret = await match[i].fun(obj.data, dptUUID); 

			        // clone the data
			        ret = JSON.parse(JSON.stringify(ret.data));

			        // hide the users mongodb id.
			        if(Lo_.isArray(ret)) {
			        	ret = ret.map(e => ({...e, user: "Cafe-C0ffe-C0de"}));
			        } else {
			        	// ret.name = "Cafe-C0ffe-C0de";
			        }

			        // re-pack it.
			        ret = {
			        	method: match[i].method,
			        	path: match[i].path,
			        	data: ret
			        };
			        return(ret);
			    }
			}
		}
	} catch(err) {
		log.error("error: " + err);
	}
	return(ret);
}


/*
	setup of the socket.io service.
	the io object handles the whole set of connected messages
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

	/*
		we decided to pull the login api endpoint from the standard api
		in the socket.io environment. it's to special.

		the client will send the dptUUID cookie, packed in the payload message,
		when it connects to our io space.
	*/
	socket.on('login', async (payload) => {
		if(payload
		&& payload.path == '/user/login/') {
			var testUUID = require('cookie').parse(payload.data.publicKey)['dptUUID'];
			var dptUUID = cookieParser.signedCookie(testUUID, cookieKey);
			log.info("check dptUUID: "+dptUUID);

			if(dptUUID != false) {

				socket.dptUUID = dptUUID;
				socket.username = socket.id;

				// log.info("uuid -> socket.dptUUID: "+ socket.dptUUID + ' socket.username: '+socket.username);

				// check, if we can find our new connected user via the cookie
				// stored dptUUID in the mongodb, don't like to delay it so much,
				// thats why we query via mongoose right here.
				var user = await User.userModel.find({publicKey: dptUUID});
				
				if(user.length && dptUUID) {

					// yes, we found a user with the dptUUID
					global.dptNS.online.push( {
						socketid: socket.id,
						dptUUID: dptUUID,
						registered: true,
						user: user[0]
					});

					// log.info('updated global online (user+): '+require('util').inspect(global.dptNS.online));
					socket.emit('private', {
						method: 'post',
						path: "/info/",
						data: {
							message: 'logged in',
							data: user,
							status: 200
						}
					});
				} else {
					// no such user in the database, an obvious unregistered one.
					global.dptNS.online.push( {
						socketid: socket.id,
						dptUUID: dptUUID,
						registered: false
					});

					// log.info('updated global online (user+): '+require('util').inspect(global.dptNS.online));
					// the user is obvious unknown to the system. the user shall
					// know the user is not logged in.
					if(dptUUID) {
						socket.emit('private', {
							method: 'post',
							path: '/info/',
							data: {
								message: "user unknown",
								dptUUID: dptUUID,
								status: 404
							}
						});
					} else {
						socket.emit('private', {
							method: 'post',
							path: '/info',
							data: {
								message: "maybe cookies are disabled?",
								status: 404
							}
						});
					}
				}
			}
		}
	});
	
	/*
		take the api message (sio request message) and let them
		be processed by the socket.io api broker. this broker
		returns the results which will sended back to the client.
	*/
	socket.on('api', async (payload) => {
		log.debug('sio request: '+util.inspect(payload));
		var ret = await apiBroker(payload, socket.dptUUID);
		socket.emit('api', ret);
		log.debug('answer sio request: '+util.inspect(ret));
	});

	/*
		let a user disconnect. remove it from the table of
		online users.
	 */
	socket.on('disconnect', (reason) => {
		log.info(socket.id+" disconnected, reason: "+reason);
		Lo_.pull(global.dptNS.online, Lo_.find(global.dptNS.online, {socketid: socket.id}));
		//log.info('updated global online (user-): '+require('util').inspect(global.dptNS.online));
	});
});

module.exports = io;