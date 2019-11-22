const ServerError = require("../../lib/error");
const config = require("../../lib/config");
const Context = require("../models/context").contextModel;


/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getContext = async (options) => {
	var context;
	try {
		context = await Context.find({_id: options.body.opinionId});
	} catch(error) {
		throw({
			status: 500,
			data: error.message,
		});
	}

	return({
		status: 200,
		data: context,
	});
}

/**
 * @param {Object} options
 * @param {String} context.contextId context that needs to be updated
 * @throws {Error}
 * @return {Promise}
 */
module.exports.contextPut = async (context) => {
	var result;
	if(context.body.content.length > config.api.maxContentLength) {
		throw {
			status: 500,
			data: "Context text is to long",
		};
	}
	try {
		result = await Context.findByIdAndUpdate(
			context.contextId,
			context.body
		);
	} catch(error) {
		throw({
			status: 500,
			data: error.message
		});
	}
	return({
		status: 200,
		data: context.body
	});
}

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.contextPost = async (context) => {
	var result;
	if(context.body.content.length > config.api.maxContentLength) {
		throw {
			status: 500,
			data: "Context text is to long",
		};
	}
	try {
		result = await Context.create(context.body);
	} catch(error) {
		throw({
			status: 500,
			data: error.message
		});
	}

	return {
		status: 200,
		data: result,
	};
}
