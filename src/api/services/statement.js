const ServerError = require("../../lib/error");
const Statement = require("../models/statement").statementModel;
const User = require("../models/user").userModel;
/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getStatements = async options => {
  const statements = await Statement.find({});

  return {
    status: 200,
    data: statements
  };
};

/**
 * @param {Object} options
 * @param {String} options.statementId Statement that needs to be updated
 * @throws {Error}
 * @return {Promise}
 */
module.exports.statementPut = async options => {
  const result = await Statement.findByIdAndUpdate(
    options.statementId,
    options.body
  );
  return {
    status: 200,
    data: "statementPut ok!",
  };
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.statementPost = async options => {
  const result = await Statement.create(options.body);
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
    data: result,
  };
};
