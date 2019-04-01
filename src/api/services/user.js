const ServerError = require("../../lib/error");
const jwt = require("jsonwebtoken");
const User = require("../models/user").userModel;
/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.createUser = async options => {
  const user = await User.create(options.body);
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

  return {
    status: 200,
    data: "loginUser ok!",
  };
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
