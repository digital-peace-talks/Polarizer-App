const io = require('socket.io-client');
const util = require('util');
var expect = require("chai").expect();
const assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
var whoami = {};
var socket;

function sleep(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

//-----------------------------------
// Der Test(args) (siehe DPT-openapi)
function putTopicTest(newTopic, topicId, dptUUID) {
//-----------------------------------

console.log("dptUUID: " + util.inspect(dptUUID));
console.log("topicId: " + topicId);

	describe('request', function() {
		it('should send string', async function() {
			this.timeout(10000);
			await socket.emit("api", {
				
				//------------------------------------
				method: 'put',	// siehe DTP-openapi			 
				path: '/topic/'+topicId+"/", // siehe DTP-openapi 
				data: {
				body: {content:  newTopic},  	// args für die function
				dptUUID: dptUUID,
				topicId: topicId}
				//------------------------------------

			});
		});

	    it('it should receive an anwer', function(done) {
			this.timeout(10000);
			socket.on('api', async function(payload) {
				console.log('output: '+util.inspect(payload));
		
				//----------------------------------------------------------------------
				assert.equal(payload.data.content, newTopic, topicId);
				//----------------------------------------------------------------------

				done();
				socket.disconnect();		
				await sleep(100);
				process.exit();
			});
		});
	});
}

async function main() {
	describe('connect and login', function() {
		it('it will connect to the server', function(done) {
			this.timeout(10000);
		    socket = io.connect(
				"ws://localhost:3100",
				{
					transports: ['websocket'],
					forceNew: true,
					reconnection: false
				}
			);
			done();
		});
		it('it will send the cookie to the server', (done) => {
			this.timeout(10000);
			socket.on('connect', async () => {
				assert.equal(socket.connected, true);
				await socket.emit("login", {
					method: 'post',
					path: '/user/login/',
					data: {
						publicKey: dptcookie,
					}
				});

				done();
			});
		});
		it('it will receive a login message', (done) => {
			this.timeout(10000);
			socket.on('private', function(restObj) {
				try {
					assert.equal(restObj.data.message, 'logged in');
				} catch(err) {
					console.log(err);
				}
				if(restObj.method == 'post') {
					if(restObj.path == '/user/login/') {
						whoami.dptUUID = restObj.data.dptUUID;
						if(restObj.data.message == 'logged in') {
							whoami.user = restObj.data.user;

							//--------------------------
							putTopicTest("newTopic", topicId, whoami.dptUUID); // aufruf der function (args siehe DPT-openapi) 
							//--------------------------

						}
						if(restObj.data.message == 'user unknown') {
							whoami.user = {};
						}
					}
				}
				done();
			});
		});
	});
}

const fs = require("fs");
const dptcookie = fs.readFileSync("test/dptcookie.txt").toString();
const topicId = fs.readFileSync("test/topicID.txt").toString();
main();