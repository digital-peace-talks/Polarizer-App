const express = require('express');
const opinion = require('../services/opinion');

const router = new express.Router();

router.get('/:opinionId/', async (req, res, next) => {
	const options = {
		body: req.body
	};

	try {
		const result = await opinion.getOpinions(options);
		res.status(result.status || 200).send(result.data);
	} catch (err) {
		return res.status(500).send({
			status: 500,
			error: 'Server Error'
		});
	}
});

/**
 * Gets all opinions
 */
router.get('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await opinion.getOpinions(options);
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
 * opinion. This should work only if the user is the one who 
 * made the opinion
 */
router.put('/:opinionId/', async (req, res, next) => {
  const options = {
    body: req.body,
    opinionId: req.params["opinionId"]
  };

  try {
    const result = await opinion.OpinionPut(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

/**
 * Creates a new opinion
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body
  };

  try {
    const result = await opinion.opinionPost(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
