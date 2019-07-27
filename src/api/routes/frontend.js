const express = require('express');
const metadata = require('../services/metadata');
const uuid = require('uuid/v4');

const router = new express.Router();

router.get('/', async (req, res, next) => {
    try {
            await res.send('homepage');
            res.status(200);
    } catch(err) {
            next(err);
    }
});

//Deliver the dialog page
router.get('/dialog', async (req, res, next) => {
	try {
	// Do we need the 'real' IP address?
	// var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var dptUUID = uuid();
	var cookieOptions = {
		maxAge: 31536000000, // 1000 * 60 * 60 * 24 * 365 ===> Valid for one year
		signed: true,
		httpOnly: false
	}

	// First time visitor?
	if(req.signedCookies.dptUUID === undefined) {
		console.log("no cookie found, set new one");
		// The client need to get the uuid for the first time, it needs to send it back.
		cookieOptions.httpOnly = false;
		res.cookie('dptUUID', dptUUID, cookieOptions)
	} else {
		console.log("use old cookie");
		dptUUID = req.signedCookies.dptUUID;
		res.cookie('dptUUID', dptUUID, cookieOptions)
	}
	console.log('session tagged with dptUUID '+dptUUID);
	res.sendFile('/root/git/DPT-server/dialog.html');
	res.end;
    } catch(err) {
    	next(err);
    }
});

module.exports = router;