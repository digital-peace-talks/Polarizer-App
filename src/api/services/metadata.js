const ServerError = require('../../lib/error');
const config = require("../../lib/config");
const User = require("../models/user").userModel;


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

