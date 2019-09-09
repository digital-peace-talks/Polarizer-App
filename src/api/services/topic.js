const ServerError = require("../../lib/error");
const config = require("../../lib/config");
const Topic = require("../models/topic").topicModel;

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getTopics = async options => {
  var topics;
  try {
    topics = await Topic.find();
    // console.log(topics.content);
  } catch (error) {
    throw {
      status: 500,
      data: error.message,
    };
  }

  return {
    status: 200,
    data: topics,
  };
};

/**
 * @param {Object} options
 * @param {String} topic.topicId topic that needs to be updated
 * @throws {Error}
 * @return {Promise}
 */
module.exports.topicPut = async topic => {
  var result;
  if (topic.body.content.length > config.api.maxContentLength) {
    throw {
      status: 500,
      data: "Topic text is to long",
    };
  }
  try {
    result = await Topic.findByIdAndUpdate(topic.topicId, topic.body);
  } catch (error) {
    throw {
      status: 500,
      data: error.message,
    };
  }
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
module.exports.topicPost = async topic => {
  var result;
  if (topic.body.content.length > config.api.maxContentLength) {
    throw {
      status: 500,
      data: "Topic text is to long",
    };
  }
  try {
    result = await Topic.create(topic.body);
  } catch (error) {
    throw {
      status: 500,
      data: error.message,
    };
  }

  return {
    status: 200,
    data: result,
  };
};
