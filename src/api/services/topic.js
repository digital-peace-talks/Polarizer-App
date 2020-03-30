const ServerError = require("../../lib/error");
const config = require("../../lib/config");
const Topic = require("../models/topic").topicModel;
const backEngine = require("../../lib/backengineTopics");

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getTopics = async (options) => {
  var topics;
  try {
    topics = await Topic.find();
    topics = await backEngine.calculatePositions(topics);
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
module.exports.topicPut = async (topic) => {
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
    data: topic.body,
  };
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.topicPost = async (topic) => {
  var result;
  if (topic.body.content.length > config.api.maxContentLength) {
    throw {
      status: 500,
      data: "Topic text is to long",
    };
  }
  var interval = Date.now() - 86400000 * config.api.topicInterval;
  var userTopics = await Topic.find({
    user: topic.body.user,
    timestamp: {
      $gt: new Date(interval),
    },
  });
  if (userTopics.length >= config.api.topicLimit && config.api.topicLimit > 0) {
    throw {
      status: 500,
      data: `Only ${config.api.topicLimit} topic(s) per ${config.api.topicInterval} day(s).`,
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
