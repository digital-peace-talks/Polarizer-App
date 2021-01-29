const express = require("express");
const fetch = require('node-fetch');
const router = new express.Router();

/**
 * Returns humanID login URL
 */
router.get("/", async (req, res, next) => {


  fetch('https://core.human-id.org/v0.0.3/server/users/web-login', {
    method: 'post',
    headers: { 'client-id': process.env.DPT_HUMAN_ID, 'client-secret': process.env.DPT_HUMAN_SECRET, 'Content-Type': 'application/json' },
  })
    .then(res => res.json())
    .then((json) => {
      console.log(json);
      // res.status(301).redirect(json.data.webLoginUrl)
    })
    .catch(err => console.log("Unable to reach humanID server: " + err))

});


module.exports = router;
