#!/usr/bin/env node
const mongoose = require('mongoose');
const User = require('../src/api/models/user');
const Topic = require('../src/api/models/topic');
const Opinion = require('../src/api/models/opinion');
const Dialog = require('../src/api/models/dialog');

const server = "http://localhost:3100";
const request = require('request-promise');

mongoose.set('useNewUrlParser',true);
mongoose.set('useCreateIndex',true);
mongoose.connect("mongodb://localhost/dpt-dev");


async function sendRequest(path, body) {
	try {
		const ret = await request( server + path, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				"Content-Type": 'application/json',
			},
			body: body
		});
		return(ret);
	} catch(err) {
		return(err.response.body);
	}
}

async function main() {

	await User.userModel.deleteMany();
	await Topic.topicModel.deleteMany();
	await Opinion.opinionModel.deleteMany();
	await Dialog.dialogModel.deleteMany();
	
	var new_user = new User.userModel;
	new_user.publicKey = "publicKey1";
	var res = await sendRequest('/user/', JSON.stringify(new_user));
//	console.log('new user 1: '+res);
	const user1 = JSON.parse(res);
	
	var new_user = new User.userModel;
	new_user.publicKey = "publicKey2";
	var res = await sendRequest('/user/', JSON.stringify(new_user));
//	console.log('new user 2: '+res);
	const user2 = JSON.parse(res);

	var new_topic = new Topic.topicModel;
	new_topic.user = user1._id;
	new_topic.content = "Do we really need a money based economy?";
	res = await sendRequest('/topic/', JSON.stringify(new_topic));
//	console.log(res);
	const topic1 = JSON.parse(res);
	
	var new_opinion = new Opinion.opinionModel;
	new_opinion.user = user1._id;
	new_opinion.topic = topic1._id;
	new_opinion.content = "No. There are alternatives. I've heared of a resource based economy. Maybe this could work."
	res = await sendRequest('/opinion/', JSON.stringify(new_opinion));
//	console.log(res);
	const opinion1 = JSON.parse(res);
	
	var new_opinion = new Opinion.opinionModel;
	new_opinion.user = user2._id;
	new_opinion.topic = topic1._id;
	new_opinion.content = "Yes. Money is God given."
	res = await sendRequest('/opinion/', JSON.stringify(new_opinion));
//	console.log(res);
	const opinion2 = JSON.parse(res);

	var new_dialog = new Dialog.dialogModel;
	new_dialog.opinion = opinion1._id;
	new_dialog.initiator = user1._id;
	new_dialog.recipient = user2._id;
	res = await sendRequest('/dialog/', JSON.stringify(new_dialog));
//	console.log(res);
	const dialog1 = JSON.parse(res);

	var new_message = {
		sender: user2._id,
		content: "Hey, as i said: people need to work. They wont do without money."
	}
    res = await sendRequest('/dialog/'+dialog1._id+'/message', JSON.stringify(new_message));
//	console.log(res);
	
	new_message = {
		sender: user1._id,
		content: "But have you read about alternatives?"
	}
    res = await sendRequest('/dialog/'+dialog1._id+'/message', JSON.stringify(new_message));
//	console.log(res);
	
	
	process.exit();
}
main();
