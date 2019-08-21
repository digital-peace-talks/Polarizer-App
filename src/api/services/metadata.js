const ServerError = require('../../lib/error');
const User = require("../models/user").userModel;


/**
 * @param {Object} options
 * @param {String} options.publicKey User that needs to be updated
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getUserMetadata = async (options) => {
	const user = await User.findOne({ publicKey: options.body.publicKey })
				.populate('topics').populate('opinions').populate('dialogs');
	return {
		status: 200,
		data: user
  };
};

