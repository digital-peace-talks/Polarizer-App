const express = require("express");
const fetch = require('node-fetch');
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
  console.log(encoded);
  try {
    const exchange = decodeURIComponent(req.query.et);
    const requestBody = {
      exchangeToken : exchange
    }
    console.log(exchange);
    fetch('https://core.human-id.org/v0.0.3/server/users/exchange', {
      method: 'post',
      body: JSON.stringify(requestBody),
      headers: { 'client-id': process.env.DPT_HUMAN_ID, 'client-secret': process.env.DPT_HUMAN_SECRET, 'Content-Type': 'application/json' }
    })
      .then(res => console.log(res))
      .catch(err => console.log("Unable to reach humanID server: " + err))

  } catch (err) {
    // Malformed URI
    console.error(err);
  }


});


module.exports = router;
