const ServerError = require("../../lib/error");
const jwt = require("jsonwebtoken");
const User = require("../models/user").userModel;
const uuid = require('uuid/v4');


module.exports.reclaimUser = async options => {
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
in case of A + D: if we are sure, that the phrase is unique,j
                  we might conclude, the dptUUID from the cookie
                  is maybe a new device and we set the cookies
                  dptUUID value to the assigned to the phrase in
                  the database. but how can we be sure? only, if
                  we generate the phrase and check it's uniqueness
                  in our system.
in case of B + D: this must be a new user, lets create one.

	 */

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
			var user = await User.create(new_user);
			console.log(user);
			return({
				newCookie: new_user.publicKey,
				status: 200
			});
		}
	}
	
	return {
		status: 401
	};
}

module.exports.onlineUsers = async options => {
	const users = global.dptNS.online;
	return {
		status: 200,
		data: users
	};
}

module.exports.getUsers = async options => {
	const users = await User.find();
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
module.exports.createUser = async options => {
  let body = options.body;
  body.signupTime = new Date();
  const user = await User.create(body);
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
module.exports.loginUser = async options => {
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

	const result = await User.findOne({ publicKey: options.body.publicKey});
	
	if(result != null) {
		// don't transmit the pass phrase
		result.phrase = 'exists';
		return {
			status: 200,
			data: result,
		};
	} else {	
		return {
			status: 403,
			data: 'not found',
		};
	}
};

/**
 * @param {Object} options
 * @param {String} options.publicKey User that needs to be updated
 * @throws {Error}
 * @return {Promise}
 */
module.exports.updateUser = async options => {
  const result = await User.updateOne(
    { publicKey: options.publicKey },
    options.body
  );
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: "updateUser ok!",
  };
};

/**
 * @param {Object} options
 * @param {String} options.publicKey The name that needs to be deleted
 * @throws {Error}
 * @return {Promise}
 */
module.exports.deleteUser = async options => {
  const result = await User.remove({ publicKey: options.publicKey });
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: "deleteUser ok!",
  };
};
