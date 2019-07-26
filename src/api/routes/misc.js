const express = require('express');
const metadata = require('../services/metadata');

const router = new express.Router();

/**
 * Gets metadata of a specific user
 */
router.get('/api', async (req, res, next) => {
  try {
    await res.sendFile('/opt/DPT-server/dpt-oas-current.json');
    res.status(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
