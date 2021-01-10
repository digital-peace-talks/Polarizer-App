const express = require("express");
const user = require("../services/user");
const uuid = require("uuid/v4");
const User = require("../models/user").userModel;
const crypto = require('crypto');
const router = new express.Router();

/**
 * Gets metamask relevant fields for a public address
 */
router.get("/", async (req, res, next) => {

  const options = {
    body: {
      publicAddress: req.query.publicAddress
    }
  };
  console.log(options.body.publicAddress);
  try {
    const userByAddress = await User.findOne(({ publicAddress: options.body.publicAddress }));
    console.log("User:" + userByAddress);
    if (userByAddress != null) {
      console.log("User exists!");
      const nonce = userByAddress.nonce;
      const publicAddress = userByAddress.publicAddress;
      res.status(200).send({ nonce: nonce, publicAddress: publicAddress });
    } else if (userByAddress == null) {
      // register
      console.log("Create user with public address!");
      var newUser = new User;
      newUser.publicKey = uuid();
      newUser.publicAddress = options.body.publicAddress;
      newUser.nonce = crypto.randomBytes(20).toString('hex');
      newUser.signupTime = new Date();
      newUser.preferences = {
        colorScheme: 0,
      }
      var user = await User.create(newUser);
      console.log(user);
      res.status(200).send({ nonce: newUser.nonce, publicAddress: newUser.publicAddress });

    }
  } catch (err) {
    res.status(400).send(err);
  }

});


module.exports = router;
