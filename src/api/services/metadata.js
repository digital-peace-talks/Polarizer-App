const ServerError = require('../../lib/error');
const config = require("../../lib/config");
const User = require("../models/user").userModel;
const Topic = require("../models/topic").topicModel;
const Opinion = require("../models/opinion").opinionModel;


/**
 * @param {Object} options
 * @param {String} options.publicKey User that needs to be updated
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getUserMetadata = async (options) => {
	var user;
	try {
		user= await User.findOne({ publicKey: options.body.publicKey })
				.populate('topics').populate('opinions').populate('dialogs');
	} catch(error) {
		throw({
			status: 500,
			data: error.message
		});
	}
	return {
		status: 200,
		data: user
	};
};

module.exports.searchTopicsAndOpinions = async (options) => {
	var ids = {};

	try {
		var topics = await Topic.find({$text: {$search: options.body.searchString}});
		for(var i in topics) {
			if(ids[topics[i]._id]) {
				ids[topics[i]._id] += 1;
			} else {
				ids[topics[i]._id] = 1;
			}
		}
	
		var opinions = await Opinion.find({$text: {$search: options.body.searchString}});
		for(var i in opinions) {
			if(ids[opinions[i].topic]) {
				ids[opinions[i].topic] += 1;
			} else {
				ids[opinions[i].topic] = 1;
			}
		}
	
		var keys = Object.keys(ids);
		keys.sort(function(a, b) {
			return(ids[a] - ids[b]);
		}).reverse();
	
		var result = [];
		for(var i in keys) {
			var topic = await Topic.findOne({_id: keys[i]});
			result.push({"topicId": keys[i], "topic": topic.content, "count": ids[keys[i]]});
		}
	} catch(error) {
		throw({
			status: 500,
			data: error.message
		});
	}

	return {
		status: 200,
		data: result
	};
};
