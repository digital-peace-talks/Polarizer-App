const express = require('express');
const metadata = require('../services/metadata');
const userService = require('../services/user');
const uuid = require('uuid/v4');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const getPhrase = require('../../lib/phrasegenerator')

const router = new express.Router();

//Deliver the dialog page
router.get('/justTheTopics.html', async (req, res, next) => {
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
		res.sendFile(process.env.DPT_PATH+'/static/justTheTopics.html');
		res.end;
   	} catch(err) {
   		next(err);
    }
});


router.get('/', async (req, res, next) => {
	try {
		if(req.signedCookies.dptUUID === undefined) {
			var phrase = await getPhrase();
			console.log("no cookie found, set new one");
			// The client need to get the uuid for the first time, it needs to send it back.
			res.send('you are a new user?<br><br>thats your phrase:<br>'+ phrase
			+ '<br><br>you are user on another browser?<br><br>enter your pass phrase<br>'
			+ '<form method="post" action="/recover"><input type=text name=phraseinput>'
			+ '<input type="hidden" name="phrase" value="'+phrase+'"></form>');
		} else {
			res.send('homepage<hr><br><br><a href=/launch>start dpt protype</a><br><br><a href=/babylon.html>babylon sample</a>');
		}
		res.status(200);
	} catch(err) {
		next(err);
    }
});

router.post('/recover', async (req, res, next) => {
	var dptUUID;
	var cookieOptions = {
		maxAge: 31536000000, // 1000 * 60 * 60 * 24 * 365 ===> Valid for one year
		signed: true,
		httpOnly: false
	}
	if(req.signedCookies.dptUUID === undefined) {
		console.log("no cookie found, set new one");
		// The client need to get the uuid for the first time, it needs to send it back.
//		cookieOptions.httpOnly = false;
//		res.cookie('dptUUID', dptUUID, cookieOptions)
	} else {
		console.log("use old cookie");
		dptUUID = cookieParser.signedCookie(req.signedCookies.dptUUID, process.env.DPT_SECRET);
	}
	var ret = await userService.userReclaim({body: {phraseGuess: req.body.phraseinput, newPhrase: req.body.phrase, dptUUID: dptUUID}});
	if(ret.newCookie)  {
		res.cookie('dptUUID', ret.newCookie, cookieOptions);
		await res.writeHead(302, {
		  //'Location': '/launch'
		  'Location': '/'
		  //add other headers here...
		});
		res.end();
	} else {
		res.send('bla '+req.body.phraseinput);
		res.status(201);
	}
});

router.get('/dpt-client.js', async (req, res, next) => {
	try {
		await res.sendFile(process.env.DPT_PATH+'/static/dpt-client.js');
		res.status(200);
	} catch (err) {
		next(err);
	}
});

router.get('/babylon.html', async (req, res, next) => {
	try {
		await res.sendFile(process.env.DPT_PATH+'/static/babylon.html');
		res.status(200);
	} catch (err) {
		next(err);
	}
});

router.get('/launch.js', async (req, res, next) => {
	try {
		await res.sendFile(process.env.DPT_PATH+'/static/launch.js');
		res.status(200);
	} catch (err) {
		next(err);
	}
});

//Deliver the dialog page
router.get('/launch', async (req, res, next) => {
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
		res.sendFile(process.env.DPT_PATH+'/static/launch.html');
		res.end;
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
		res.sendFile(process.env.DPT_PATH+'/static/dialog.html');
		res.end;
   	} catch(err) {
    		next(err);
    }
});

//Deliver the babylon page
router.get('/babylon', async (req, res, next) => {
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
		res.sendFile(process.env.DPT_PATH+'/static/babylon.html');
		res.end;
   	} catch(err) {
   		next(err);
    }
});

module.exports = router;
