#!/usr/bin/node 
const util = require("util");
const Lo_ = require('lodash');
const mongoose = require("mongoose");

var OpinionSchema;
var UserSchema;
var TopicSchema;
var DialogSchema;

var connection;
var Dialog;
var Opinion;
var Topic;
var User;

function mapRange(from, to, s) {
	return(to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]));
};

async function getRatings(topicId) {

	var connection = await mongoose.connect("mongodb://localhost:27017/dpt-dev", { useUnifiedTopology: true , useNewUrlParser: true, });
	UserSchema = require("../api/models/user");
	TopicSchema = require("../api/models/topic");
	OpinionSchema = require("../api/models/opinion");
	DialogSchema = require("../api/models/dialog");

	Opinion = OpinionSchema.opinionModel;
	User = UserSchema.userModel;
	Topic = TopicSchema.topicModel;
	Dialog = DialogSchema.dialogModel;

	
	console.log("topicId: "+topicId);
	var topic = await Topic.findOne({_id: topicId}, {_id: 1}).populate('opinions', {_id: 1});
	console.log("TOPIC: "+util.inspect(topic, {depth: 5}));

	var users = [];
	var opinions = [];
	for(var i in topic.opinions) {
		var opinion = await Opinion.findOne({_id: topic.opinions[i]._id});
		users[opinion.user] = opinion._id;
		opinions[opinion._id] = {rating: 0, num: 0, content: opinion.content};
	}
	for(var i in topic.opinions) {
		var dialogs = await Dialog.find({opinion: topic.opinions[i]._id});
		for(var j in dialogs) {
			for(var k in dialogs[j].crisises) {
				console.log("opinion: "+users[dialogs[j].crisises[k].initiator]+" rating: "+dialogs[j].crisises[k].rating);
				opinions[users[dialogs[j].crisises[k].initiator]].rating += dialogs[j].crisises[k].rating;
				opinions[users[dialogs[j].crisises[k].initiator]].num++;
			}
		}
	}

	console.log();
	for(var i in opinions) {
		console.log("opinion: "+opinions[i].content+" rating: "+mapRange([-1, 1], [0, 1], opinions[i].rating / opinions[i].num));
	}
}

async function main() {
	await getRatings(process.argv[2]);

	process.exit(0);
}

main();
