const io = require('socket.io-client');
const util = require('util');
require('assert');

var whoami = {};
var socket;

async function postNilsTestPath(nilsTestString) {

	socket.on('api', async (payload) => {
		console.log('sio request: '+require('util').inspect(payload));
//		process.exit();
//		return(1);
	});

	socket.emit("api", {
		method: 'post',
		path: '/nilsTestPath/',
		data: {
			content: nilsTestString
		}
	});
}

// in this function add your tests
async function test() {
	await postNilsTestPath('string');
//	process.exit();
}

async function main() {
    socket = io.connect(
        "ws://localhost:3100",
        { transports: ['websocket'] }
	);
	
	socket.on('connect', () => {
		mysocketid = socket.id;
		socket.emit("login", {
			method: 'post',
			path: '/user/login/',
			data: {
				publicKey: "dptUUID=s%3A099f0fa3-9d96-479f-9cc3-642c54e31e3b.4TmfeSNnQUDubTDU9XTZvHoTDqUn9Q%2BCpmH%2Fg6GfZ6Y"
			}
		});
	});

	socket.on('xapi', (payload) => {
		console.log('sio request: '+require('util').inspect(payload));
		return(1);
	});

	socket.on('private', function(restObj) {
		if(restObj.method == 'post') {
			if(restObj.path == '/info/') {
				whoami.dptUUID = restObj.data.dptUUID;
				if(restObj.data.message == 'logged in') {
					whoami.user = restObj.data.user;
					test();
				}
				if(restObj.data.message == 'user unknown') {
					whoami.user = {};
				}
			}
		}
	});
}

// main will call test()
// when the connection to the server is established.
main();