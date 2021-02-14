const express = require("express");
const user = require("../services/user");
const uuid = require("uuid/v4");
const User = require("../models/user").userModel;
const ethUtil = require('ethereumjs-util');
const ethSigUtil = require('eth-sig-util');
const crypto = require('crypto');
const router = new express.Router();

/**
 * Verifies signature is one signed by the public address for this nonce,
 * returns session cookie.
 */
router.get("/", async (req, res, next) => {

  const options = {
    body: {
      publicAddress: req.query.publicAddress,
      signature: req.query.signature
    }
  };

  try {
    const userByAddress = await User.findOne(({ publicAddress: options.body.publicAddress }));
    if (userByAddress != null) {
      console.log("User found!");
      const nonce = userByAddress.nonce;

      const publicAddress = userByAddress.publicAddress;

      const msg = "I authorize Metamask to sign my one-time nonce for sign-in to DPT: " + nonce;

      const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
      const address = ethSigUtil.recoverPersonalSignature({
        data: msgBufferHex,
        sig: options.body.signature,
      });

      // const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
      //
      // const signatureBuffer = ethUtil.toBuffer(options.body.signature);
      //
      // const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
      // const key = ethUtil.ecrecover(
      //   msgHash,
      //   signatureParams.v,
      //   signatureParams.r,
      //   signatureParams.s
      // );
      // const addressBuffer = ethUtil.publicToAddress(key);
      // const address = ethUtil.bufferToHex(addressBuffer);

      if (address.toLowerCase() === publicAddress.toLowerCase()) {
        console.log("Match!");
        userByAddress.nonce = crypto.randomBytes(20).toString('hex');
        userByAddress.save();
        res.status(200).send({newCookie: userByAddress.publicKey});
      } else {
        res.status(401).send({error: 'Unable to verify signature'});
      }
    } else {
      res.status(400).send("User does not exist.");
    }
  } catch (err) {
    console.log("Default error");
    res.status(400).send(err);
  }
});


module.exports = router;
