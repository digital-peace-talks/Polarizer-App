const express = require('express');
const canvas = require('../services/canvas');

const router = new express.Router();


router.get('/opinionId/:opinionId', async (req, res, next) => {
//router.get('/', async (req, res, next) => {
	const options = {
//		body: req.body,
//		opinionId: req.params["opinionId"],
	}
	console.log('foo!');

	try {
		const result = await canvas.draw();
		res.setHeader('Content-Type', 'image/png');
		result.pngStream().pipe(res);
//		res.setHeader('Content-Type', 'text/html');
//		res.send('bla');
	} catch (err) {
		next(err);
	}
});

module.exports = router;
