const express = require("express");
const metadata = require("../services/metadata");

const router = new express.Router();

/**
 * Gets metadata of a specific user
 */
router.get("/user/:publicKey/", async (req, res, next) => {
  const options = {
    publicKey: req.params["publicKey"],
  };

  try {
    const result = await metadata.getUserMetadata(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
