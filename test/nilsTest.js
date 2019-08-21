const io = require('socket.io-client');
const util = require('util');
var expect = require("chai").expect();
const assert = require('assert');
var chai = require('chai');
var expect = chai.expect;

var whoami = {};
var socket;


// sleep with a returned promise, works in an async/await environment, argument is in milliseconds
function sleep(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// here is the API test, we call a service with
// a string and the service returns the reversed string
function postNilsTestPath(nilsTestString) {

	describe('request', function() {

		// send the string to the server
		it('should send string', async function() {
			await socket.emit("api", {
				method: 'post',
				path: '/nilsTestPath/',
				data: {
					content: nilsTestString
				}
			});
		});

	    it('it should receive an anwer', function(done) {

	    	// get the reversed string back
			socket.on('api', async function(payload) {

				// test method: standard assert
				assert.equal(payload.data, nilsTestString.split("").reverse().join(""));

				// alternative test method: chai.expect
				//expect(payload.data).equal(nilsTestString.split("").reverse().join(""));

				// now finish the test
				done();

				socket.disconnect();
				console.log(' input: '+nilsTestString);
				console.log('output: '+payload.data);
				await sleep(100);
				
				// and exit the program
				process.exit();
			});
		});

	});

}


async function main() {

	describe('connect and login', function() {

		// first, we get a fresh socket to the web server
		it('it will connect to the server', function(done) {
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
			
			// now we have a connection
			socket.on('connect', async () => {

				// standard test via assert
				assert.equal(socket.connected, true);

				// alternative test via chia.expect
				//expect(socket.connected).equal(true);

				// and we send our identification (signed publicKey)
				await socket.emit("login", {
					method: 'post',
					path: '/user/login/',
					data: {
						publicKey: "dptUUID=s%3Afa59e97e-1ebd-40ce-b7d9-3f6d31fb902b.vEf3yukbDh7vhwETPLkJ656zHsZ2XlfPVpCWfokmzJ0"
					}
				});
				done();
			});
		});

		it('it will receive a login message', (done) => {
			
			// as a result to our login request, we get a message on channel 'private'
			// with the some fundamental informations about the new logged in client
			socket.on('private', function(restObj) {
				if(restObj.method == 'post') {
					if(restObj.path == '/info/') {
						whoami.dptUUID = restObj.data.dptUUID;
						
						// here we go, we are logged in
						if(restObj.data.message == 'logged in') {
							whoami.user = restObj.data.user;
							
							// and we can start our api test
							postNilsTestPath("reit nie ein tier");

							done();
						}

						if(restObj.data.message == 'user unknown') {
							whoami.user = {};
							done();
						}
					}
				}
			});
		});
	});
}

// main will call postNilsTestPath() when the connection
// to the server is established and authentication is confirmed.
main();
