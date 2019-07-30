const ServerError = require("../../lib/error");
const Opinion = require("../models/opinion").opinionModel;
const User = require("../models/user").userModel;
const Topic = require("../models/topic").topicModel;

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getOpinions = async options => {
  var opinions;
  if(options.body.id) {
	  opinions = await Opinion.find({ topic: options.body.id });
  } else {
	  opinions = await Opinion.find({});
  }

  return {
    status: 200,
    data: opinions
  };
};

/**
 * @param {Object} options
 * @param {String} options.opinionId opinion that needs to be updated
 * @throws {Error}
 * @return {Promise}
 */
module.exports.opinionPut = async options => {
  const result = await Opinion.findByIdAndUpdate(
    options.opinionId,
    options.body
  );
  return {
    status: 200,
    data: "opinionPut ok!",
  };
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.opinionPost = async options => {
  const result = await Opinion.create(options.body);
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
