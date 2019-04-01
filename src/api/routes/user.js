const express = require("express");
const user = require("../services/user");
const jwt = require("jsonwebtoken");

const router = new express.Router();

/**
 * Creates a user
 */
router.post("/", async (req, res, next) => {
  const options = {
    body: req.body,
  };

  try {
    const result = await user.createUser(options);
    res.status(200).send(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      status: 500,
      error: "Server Error",
    });
  }
});

/**
 * Issues a JWT for the user - [click for further
 * reading](http://jwt.io)
 */
router.post("/login/", async (req, res, next) => {
  const options = {
    body: req.body,
  };

  try {
    const result = await user.loginUser(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * This can only be done by the logged in user.
 */
router.put("/:publicKey/", async (req, res, next) => {
  const options = {
    body: req.body,
    publicKey: req.params["publicKey"],
  };
  let token = req.get("authorization") || "Bearer ";
  // remove "Bearer "
  token = token.slice(7, token.length);
  try {
    jwt.verify(token, options.publicKey, {algorithms: 'rs256'});
  } catch (err) {
    next(err);
    return;
  }
  try {
    const result = await user.updateUser(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * This can only be done by the logged in user.
 */
router.delete("/:publicKey/", async (req, res, next) => {
  const options = {
    publicKey: req.params["publicKey"],
  };

  try {
    const result = await user.deleteUser(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
