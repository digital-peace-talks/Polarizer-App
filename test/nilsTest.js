const io = require('socket.io-client');
const util = require('util');
var expect = require("chai").expect();
const assert = require('assert');
var chai = require('chai');
var expect = chai.expect;

var whoami = {};
var socket;

function postNilsTestPath(nilsTestString) {

	describe('request', function() {
		it('should send string', async function() {
			await socket.emit("api", {
				method: 'post',
				path: '/nilsTestPath/',
				data: {
					content: nilsTestString
				}
			});
		});
	});

	describe('answer', function() {
	    it('it should receive an anwer', function() {
			socket.on('api', function(payload) {

				// test method: standard assert
				assert.equal(payload.data, nilsTestString.split("").reverse().join(""));

				// test method: chai.expect
				expect(payload.data).equal(nilsTestString.split("").reverse().join(""));
				process.exit();
			});
		});
	});

}

// in this function add your tests
async function test() {
	await postNilsTestPath('string');
//	process.exit();
}

async function main() {
	describe('connect', function() {
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
	});
	
	describe('send login', () => {
		it('it will send the cookie to the server', (done) => {
			socket.on('connect', async () => {
				await socket.emit("login", {
					method: 'post',
					path: '/user/login/',
					data: {
						publicKey: "dptUUID=s%3A099f0fa3-9d96-479f-9cc3-642c54e31e3b.4TmfeSNnQUDubTDU9XTZvHoTDqUn9Q%2BCpmH%2Fg6GfZ6Y"
					}
				});
				done();
			});
		});
	});

	describe('logged in', () => {
		it('it will receive a login message', (done) => {
			socket.on('private', function(restObj) {
				if(restObj.method == 'post') {
					if(restObj.path == '/info/') {
						whoami.dptUUID = restObj.data.dptUUID;
						if(restObj.data.message == 'logged in') {
							whoami.user = restObj.data.user;
							test();
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

// main will call test()
// when the connection to the server is established.
main();
