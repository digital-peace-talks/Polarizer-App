const ServerError = require("../../lib/error");
const config = require("../../lib/config");
const jwt = require("jsonwebtoken");
const User = require("../models/user").userModel;
const uuid = require('uuid/v4');
const Lo_ = require('lodash');



module.exports.userReclaim = async (options) => {
	var status = 200;
	const userByPhraseGuess = await User.findOne({ phrase: options.body.phraseGuess });
	const newPhrase = await User.findOne({ phrase: options.body.newPhrase });
	const userBydptUUID = await User.findOne({ publicKey: options.body.publicKey });
	
	/*
		we got a keyboard entered phrase
		we got a cookie stored dptUUID
		
		possible states in the database:
		A record with the exact phrase exists.
		B record with the exact phrase didn't exists.
		
		C record with the dptUUID exists.
		D record with the dptUUID didn't exists.
		
		in case of A + C: nothing needs to be done here.
		in case of B + C: the phrase is maybe misspelled
		in case of A + D: if we are sure, that the phrase is unique,
		                  we might conclude, the dptUUID from the cookie
		                  is maybe a new device and we set the cookies
		                  dptUUID value to the assigned to the phrase in
		                  the database. but how can we be sure? only, if
		                  we generate the phrase and check it's uniqueness
		                  in our system.
		in case of B + D: this must be a new user, lets create one.
	 */

	// recover only.
	if(userByPhraseGuess == null && options.body.phraseGuess.length > 0) {
		return {
			status: 401,
			data: "Can't reclaim the account."
		};
	}

	// case A + D
	if(userByPhraseGuess != null
	&& userBydptUUID === null) {
		console.log('--------------------------');
		console.log('user with existing phrase set token in cookie');
		console.log('--------------------------');
		return({
			newCookie: userByPhraseGuess.publicKey,
			status: 200
		});
	} else {
	// case B + D
		if(newPhrase === null
		&& userBydptUUID === null) {
			var new_user = new User;
			new_user.publicKey = uuid();
			new_user.phrase = options.body.newPhrase;
			new_user.signupTime = new Date();
			new_user.preferences = {
				colorScheme: 0,
			}
			var user = await User.create(new_user);
			console.log(user);
			return({
				newCookie: new_user.publicKey,
				status: 200
			});
		}
	}
	
	return {
		status: 401,
		data: "Can't reclaim the account."
	};
}


module.exports.userReclaimMetamask = async (options) => {
	var status = 200;
	const userByAddress = await User.findOne({ publicAddress: options.body.publicAddress });
	const newPhrase = await User.findOne({ phrase: options.body.newPhrase });
	const userBydptUUID = await User.findOne({ publicKey: options.body.publicKey });

	/*
		we got a keyboard entered phrase
		we got a cookie stored dptUUID

		possible states in the database:
		A record with the exact phrase exists.
		B record with the exact phrase didn't exists.

		C record with the dptUUID exists.
		D record with the dptUUID didn't exists.

		in case of A + C: nothing needs to be done here.
		in case of B + C: the phrase is maybe misspelled
		in case of A + D: if we are sure, that the phrase is unique,
		                  we might conclude, the dptUUID from the cookie
		                  is maybe a new device and we set the cookies
		                  dptUUID value to the assigned to the phrase in
		                  the database. but how can we be sure? only, if
		                  we generate the phrase and check it's uniqueness
		                  in our system.
		in case of B + D: this must be a new user, lets create one.
	 */

	// recover only.
	if(userByPhraseGuess == null && options.body.phraseGuess.length > 0) {
		return {
			status: 401,
			data: "Can't reclaim the account."
		};
	}

	// case A + D
	if(userByPhraseGuess != null
		&& userBydptUUID === null) {
		console.log('--------------------------');
		console.log('user with existing phrase set token in cookie');
		console.log('--------------------------');
		return({
			newCookie: userByPhraseGuess.publicKey,
			status: 200
		});
	} else {
		// case B + D
		if(newPhrase === null
			&& userBydptUUID === null) {
			var new_user = new User;
			new_user.publicKey = uuid();
			new_user.phrase = options.body.newPhrase;
			new_user.signupTime = new Date();
			new_user.preferences = {
				colorScheme: 0,
			}
			var user = await User.create(new_user);
			console.log(user);
			return({
				newCookie: new_user.publicKey,
				status: 200
			});
		}
	}

	return {
		status: 401,
		data: "Can't reclaim the account."
	};
}

module.exports.onlineUsers = async (options) => {
	var users;

	try {
		users = global.dptNS.online;
	} catch(error) {
		throw({
			status: 500,
			data: error.message
		});
	}

	return {
		status: 200,
		data: users
	};
}

module.exports.whoamiByDptUUID = async (options) => {
	var user = Lo_.find(global.dptNS.online, {dptUUID: options.body.dptUUID});
	if(user.registered) {
		return(user);
	} else {
		return(false);
	}
}

module.exports.getUsers = async (options) => {
	var users;

	try {
		users= await User.find();
	} catch(error) {
		throw({
			status: 500,
			data: error.message
		});
	}

	return {
		status: 200,
		data: users
	};
}

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.createUser = async (options) => {
	var user;

	try {
		options.body.signupTime = new Date();
		user = await User.create(options.body);
	} catch(error) {
		throw({
			status: 500,
			data: error.message
		});
	}

	return {
		status: 200,
		data: user,
	};
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.loginUser = async (options) => {

	var result

	try {
		result = await User.findOne({ publicKey: options.body.publicKey});
	
		if(result != null) {
			// don't transmit the pass phrase
			result.phrase = 'exists';
		} else {	
			return({
				status: 400,
				data: 'User not found',
			});
		}
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

/**
 * @param {Object} options
 * @param {String} options.publicKey User that needs to be updated
 * @throws {Error}
 * @return {Promise}
 */
module.exports.updateUser = async (options) => {
	var result;

	try {
		result = await User.updateOne(
				{ publicKey: options.publicKey },
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
		data: result
	});
}

/**
 * @param {Object} options
 * @param {String} options.publicKey The name that needs to be deleted
 * @throws {Error}
 * @return {Promise}
 */
module.exports.deleteUser = async (options) => {
	var result;
	
	try {
		result = await User.remove({ publicKey: options.publicKey });
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
