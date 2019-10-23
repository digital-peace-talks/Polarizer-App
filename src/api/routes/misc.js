const express = require('express');
const metadata = require('../services/metadata');
const config		= require("../../lib/config");
const logger	= require("../../lib/logger");
const log		= logger(config.logger);

const router = new express.Router();

router.get('/nilsTestPath', async (req, res, next) => {
	try {
		await res.sendFile(process.env.DPT_PATH+'/static/nilsTestPath.html');
		res.status(200);
	} catch (err) {
		next(err);
	}
});
/**
 * Gets metadata of a specific user
 */
router.get('/api', async (req, res, next) => {
	try {
		await res.sendFile(process.env.DPT_PATH+'/docs/dpt-oas-current.json');
		res.status(200);
	} catch (err) {
		next(err);
	}
});

router.post('/webhook', (req, res) => {
	// maybe we should spawn a external shell script
	// to keep this code clean and gain flexibility.
	// instead we should have a look at the req body.

	const { spawnSync } = require('child_process');																 
	var context;
if(0) {
	router.io.emit('update', {
			method: 'post',
			path: '/info',
			payload: {
					message: 'Update info: A new version got delivered. The server will restart very soon.'
			}
	});
}
	console.log('got this:'+JSON.stringify(req.body));		 
	res.status(201).send('take me off.');

	log.info('run git pull');				 
	context = spawnSync('git', ['pull']);					
	log.info(context.stdout.toString());													

	log.info('run npm install');
	context = spawnSync('npm', ['install']);
	log.info(context.stdout.toString());											
});

module.exports = router;
