const ServerError = require("../../lib/error");
const config = require("../../lib/config");
const Topic = require("../models/topic").topicModel;


/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getTopics = async (options) => {
	var topics;
	try {
	  topics = await Topic.find();
	} catch(error) {
		return({
			status: 500,
			data: error.message
		});
	}

	return({
		status: 200,
		data: topics
	});
}

/**
 * @param {Object} options
 * @param {String} topic.topicId topic that needs to be updated
 * @throws {Error}
 * @return {Promise}
 */
module.exports.topicPut = async (topic) => {
	var result;
	try {
		result = await Topic.findByIdAndUpdate(
			topic.topicId,
			topic.body
		);
	} catch(error) {
		return({
			status: 500,
			data: error.message
		});
	}
	return({
		status: 200,
		data: "topicPut ok!",
	});
}

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.topicPost = async (topics) => {
	var result;
	try {
		result = await Topic.create(topics.body);
	} catch(error) {
		return({
			status: 500,
			data: error.message
		});
	}

	return {
		status: 200,
		data: result,
	};
}
