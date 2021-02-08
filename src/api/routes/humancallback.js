const express = require("express");
const fetch = require('node-fetch');
const uuid = require("uuid/v4");
const User = require("../models/user").userModel;
const userService = require('../services/user');
const router = new express.Router();

/**
 *
 */
router.get("/", async (req, res, next) => {

  if (!req.query.et) {
    if (req.query.message) {
      res.status(400).redirect(req.query.message)
    } else {
      res.status(400).send("Malformed request parameters");
    }
  }

  const encoded = req.query.et;
  try {
    const exchange = decodeURIComponent(req.query.et);
    const requestBody = {
      exchangeToken : exchange
    }
    fetch('https://core.human-id.org/v0.0.3/server/users/exchange', {
      method: 'post',
      body: JSON.stringify(requestBody),
      headers: { 'client-id': process.env.DPT_HUMAN_ID, 'client-secret': process.env.DPT_HUMAN_SECRET, 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(json => userService.humanReclaim( { body: { humanID: json.data.appUserId }}))
      .then(ret => {
        if (ret.newCookie) {
          fetch("/recoverhuman?session=" + ret.newCookie);
        } else {
          res.status(400).send("Error in sign-in");
        }
      })
        .catch(err => console.log(err));

  } catch (err) {
    // Malformed URI
    console.error(err);
  }


});


module.exports = router;
