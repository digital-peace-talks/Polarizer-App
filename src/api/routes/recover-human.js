const express = require('express');
const metadata = require('../services/metadata');
const User = require('../models/user');
const userService = require('../services/user');
const uuid = require('uuid/v4');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const router = new express.Router();

router.get('/', async(req, res, next) => {
  // console.log('recover get ' + req.query.phrase);
  // console.log("Creating new account");
  var cookieOptions = {
    maxAge: 31536000000, // 1000 * 60 * 60 * 24 * 365 ===> Valid for one year
    signed: true,
    httpOnly: false
  }

  // if (req.signedCookies.dptUUID === undefined) {
  // 	console.log("no cookie found, set new one in get method");
  // 	// The client need to get the uuid for the first time, it needs to send it back.
  // 	//		cookieOptions.httpOnly = false;
  // 	//		res.cookie('dptUUID', dptUUID, cookieOptions)
  // } else {
  // 	console.log("use old cookie");
  // 	dptUUID = cookieParser.signedCookie(req.signedCookies.dptUUID, process.env.DPT_SECRET);
  // }
  //
  // var ret = await userService.userReclaim({ body: { phraseGuess: '', newPhrase: req.query.phrase, dptUUID: dptUUID } });
  // if (ret.newCookie) {
  if (req.query.session) {
    res.cookie('dptUUID', req.query.session, cookieOptions);
    const baseURL = process.env.BASE_URL;
    res.redirect(baseURL + '/dpt3d.html');
    res.end();
  } else {
    console.log("missing cookie?");
    res.send('bla ');
    res.status(201);
  }
});

router.post('/', async(req, res, next) => {
  var dptUUID;
  var cookieOptions = {
    maxAge: 31536000000, // 1000 * 60 * 60 * 24 * 365 ===> Valid for one year
    signed: true,
    httpOnly: false
  }
  console.log(req);
  if (req.query.session) {
    res.cookie('dptUUID', req.query.session, cookieOptions);
    await res.writeHead(302, {
      'Location': '/dpt3d.html'
      //'Location': '/'
      //add other headers here...
    });
    res.end();
  } else {
    res.send(`<head><link rel="stylesheet" href="dpt_start.css"/></head>
			<body><center><img src="https://www.digitalpeacetalks.com/img/DPT_Logo_Ball_blue.png"
			alt="digital peace talks" height="400" width="400">
			<br><br><br>200<br><br>${req.query.session}</center></body>`);
    res.status(201);
  }
});

module.exports = router;