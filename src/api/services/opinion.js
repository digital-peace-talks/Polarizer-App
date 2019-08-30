const ServerError = require("../../lib/error");
const config = require("../../lib/config");
const Opinion = require("../models/opinion").opinionModel;
const User = require("../models/user").userModel;
const Topic = require("../models/topic").topicModel;
const Dialog = require("../models/dialog").dialogModel;
const util = require("util");

const mongoose = require("mongoose");
const Schema = mongoose.Schema


module.exports.opinionPostAllowed = async (options, oid) => {
	if(options.body.topicId && oid) {
		var opinions = await Opinion.findOne({topic: mongoose.Types.ObjectId(options.body.topicId), user: oid._id});
		if(opinions == null) {
			return(true);
		}
	}
	return(false);
}

module.exports.getOpinionsByTopicId = async (options, userId) => {
	if(options.body.id) {
		var opinions;
		try {
			opinions = await Opinion.find({ topic: options.body.id });
	  
			for(i=0; i < opinions.length; i++) {
				opinions[i]._doc.blocked = 0;
				var worker = await Dialog.find({
					$or: [
						{ $and: [
							{ opinion: opinions[i]._id },
							{ recipient: opinions[i].user },
							{ initiator: userId },
						]},

						{ $and: [
							{ opinion: opinions[i]._id },
							{ recipient: userId },
							{ initiator: opinions[i].user },
						]}
					]
				});
				if(worker.length) {
					opinions[i]._doc.blocked = 1;
				}
			}

			return({
				status: 200,
				data: opinions
			});
		} catch(error) {
			throw({
				status: 500,
				data: error.message
			});
		}
	} else {
		return({
			status: 400,
			data: "Opinion can't found"
		});
	}
};


/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getOpinions = async (options) => {
	var opinions;
	try {
		opinions = await Opinion.find([]);
	} catch(error) {
		throw({
			status: 500,
			data: error.message
		});
	}
	return({
		status: 200,
		data: opinions
	});
};

/**
 * @param {Object} options
 * @param {String} options.opinionId opinion that needs to be updated
 * @throws {Error}
 * @return {Promise}
 */
module.exports.opinionPut = async (options) => {
	var result

	if(options.body.content.length > config.api.maxContentLength) {
		throw {
			status: 500,
			data: "Topic text is to long",
		};
	}

	try {
		result = await Opinion.findByIdAndUpdate(
			options.opinionId,
			options.body
		);
	} catch(error) {
		throw({
			status: 500,
			data: error.message
		});
	}

	return({
		status: 200,
		data: result,
	});
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.opinionPost = async options => {
	var result;

	if(options.body.content.length > config.api.maxContentLength) {
		throw {
			status: 500,
			data: "Topic text is to long",
		};
	}	

	try {
		result = await Opinion.create(options.body);
	} catch(error) {
		throw({
			status: 500,
			data: error.message
		});
	}

	return({
		status: 200,
		data: result,
	});
};
