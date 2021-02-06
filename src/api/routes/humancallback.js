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

  const exchange = req.query.et;

  fetch('https://core.human-id.org/v0.0.3/server/users/exchange', {
    method: 'post',
    headers: { 'client-id': process.env.DPT_HUMAN_ID, 'client-secret': process.env.DPT_HUMAN_SECRET, 'Content-Type': 'application/json' },
    body: { "exchangeToken": exchange }
  })
    .then(res => res.json())
    .then((json) => {
      console.log(json);
      // res.status(301).redirect(json.data.webLoginUrl)
    })
    .catch(err => console.log("Unable to reach humanID server: " + err))

});


module.exports = router;
