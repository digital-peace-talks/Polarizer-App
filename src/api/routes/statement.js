const express = require('express');
const statement = require('../services/statement');

const router = new express.Router();

/**
 * Gets all statements
 */
router.get('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await statement.getStatements(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * The user has changed its mind and would like to alter the 
 * statement. This should work only if the user is the one who 
 * made the statement
 */
router.put('/:statementId/', async (req, res, next) => {
  const options = {
    body: req.body,
    statementId: req.params["statementId"]
  };

  try {
    const result = await statement.statementPut(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Creates a new statement
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body
  };

  try {
    const result = await statement.statementPost(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
