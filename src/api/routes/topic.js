const express = require("express");
const topic = require("../services/topic");

const router = new express.Router();

/**
 * Gets all opinions
 */
router.get("/", async (req, res, next) => {
  const options = {};

  try {
    const result = await topic.getTopics(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
    //		return res.status(err.status).send(err);
  }
});

/**
 * The user has changed its mind and would like to alter the
 * opinion. This should work only if the user is the one who
 * made the topic
 */
router.put("/:topicId/", async (req, res, next) => {
  const options = {
    body: req.body,
    opinionId: req.params["topicId"],
  };

  try {
    const result = await topic.TopicPut(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Creates a new topic
 */
router.post("/", async (req, res, next) => {
  const options = {
    body: req.body,
  };

  try {
    const result = await topic.topicPost(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
