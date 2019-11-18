#!/usr/bin/node
const util = require("util");
const Lo_ = require('lodash');
const mongoose = require("mongoose");

function mapRange(from, to, s) {
	return(to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]));
};


const connection = mongoose.connect("mongodb://localhost:27017/dpt-dev", { useUnifiedTopology: true , useNewUrlParser: true, });
const UserSchema = require("../api/models/user");
const TopicSchema = require("../api/models/topic");
const OpinionSchema = require("../api/models/opinion");
const DialogSchema = require("../api/models/dialog");

const Opinion = OpinionSchema.opinionModel;
const User = UserSchema.userModel;
const Topic = TopicSchema.topicModel;
const Dialog = DialogSchema.dialogModel;


async function updateDialog(dialog) {
	try {

		var opinion = await Opinion.findOne({_id: dialog.opinion});
		await Dialog.updateOne({_id: dialog._id}, {topic: opinion.topic});
		var opinion2 = await Opinion.findOne({user: dialog.initiator, topic: opinion.topic});
		await Dialog.updateOne({_id: dialog._id}, {initiatorOpinion: opinion2._id});
		

	} catch(error) {
		throw {
			status: 500,
			data: error.message,
		};
	}
}

async function updateUser(user) {
	try {
		await User.updateOne({_id: user._id}, {preferences: {colorSchema: 0}});
	} catch(error) {
		throw {
			status: 500,
			data: error.message,
		};
	}
}

async function main(argv) {
	console.log(util.inspect(argv));
	try {
		var dialogs = await Dialog.find({});
		for(var i in dialogs) {
			await updateDialog( dialogs[i] );
		}
		var users = await User.find({});
		for(var i in users) {
			await updateUser( users[i] );
		}
	} catch(err) {
		console.log(err);
	}
	process.exit(0);
}

main({ body: { opinionId: process.argv[2] } });
