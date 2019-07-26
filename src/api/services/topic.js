const ServerError = require("../../lib/error");
const Topic = require("../models/topic").topicModel;
//const User = require("../models/user").userModel;
/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getTopics = async options => {
  const topics = await Topic.find({});

  return {
    status: 200,
    data: topics
  };
};

/**
 * @param {Object} options
 * @param {String} topic.topicId topic that needs to be updated
 * @throws {Error}
 * @return {Promise}
 */
module.exports.topicPut = async topics => {
  const result = await Topic.findByIdAndUpdate(
    topic.topicId,
    topic.body
  );
  return {
    status: 200,
    data: "topicPut ok!",
  };
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.topicPost = async topics => {
  const result = await Topic.create(topics.body);
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
