const express = require('express');
const metadata = require('../services/metadata');
const userService = require('../services/user');
const uuid = require('uuid/v4');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const getPhrase = require('../../lib/phrasegenerator')

const router = new express.Router();

router.get('/', async(req, res, next) => {
	try {
		if (req.signedCookies.dptUUID === undefined) {
			var phrase = await getPhrase();
			//console.log("no cookie found, set new one");
			//console.log("new phrase: " + phrase);
			// The client need to get the uuid for the first time, it needs to send it back.
			res.send(`<head><link rel="stylesheet" href="dpt_start.css" /></head>
				<body><center><img src="https://www.digitalpeacetalks.com/img/DPT_Logo_Ball_blue.png" alt="digital peace talks" height="300" width="300">
				<br>
				<div class="text">Digital peace talks is currently in private alpha!
				Only a minimum viable product is viable at the moment, and our primary goal is to get direct feedback from a small set of users to evaluate our core design. 
				Thank you.</div>
				<br>
				<br><div ><div style="color: #F0F3F5;">Are you a new user?</div><br><br>
				<fieldset style="text-align:center; width:400px;  border-style: solid; border-width: 1px;">
				<legend style="text-align:center; color: #F0F3F5;">This could be your pass-phrase, remember it:</legend>
				<h3><b style="margin: 20px; white-space: nowrap;">${phrase}</b><br>
				<br><a style="color: #F0F3F5; text-decoration: none;" href="/recover?phrase=${encodeURIComponent(phrase)}">Start &#9655;</a>
				</fieldset>
				</h3><br><div style="color: #F0F3F5">Lost your cookie? A new browser?</div><br><br><div style="color: #F0F3F5">Enter your pass-phrase:</div><br>
				<form method="post" action="/recover"><input type=text name=phraseinput>
				<input type="hidden" name="phrase" value="${phrase}"></form>
			   </div></center>`);
		} else {
			res.send(`<head><link rel="stylesheet" href="dpt_start.css" /></head>
			<body><center><img src="https://www.digitalpeacetalks.com/img/DPT_Logo_Ball_blue.png" alt="digital peace talks" height="300" width="300">
			<br>
			<div class="text">Digital peace talks is currently in private alpha!
			Only a minimum viable product is viable at the moment, and our primary goal is to get direct feedback from a small set of users to evaluate our core design. 
			Only later, once we feel comfortable the app can handle more users, we will open up to general public. 
			Thank you.</div>
			<br>	
			<br><br><h3><b>
				<a style="color: #F0F3F5; text-decoration: none;" href=/dpt3d.html>Start &#9655;</a>
				</b></h3><br><br>
				<!--
				<a onClick="function gcv(a) {var b=document.cookie.match('(^|;)\\s*'+a+'\\s*=\\s*([^;]+)');return b?b.pop():''};document.cookie='dptUUID='+gcv('dptUUID')+'; max-age=0; path=/; domain='+window.location.hostname+';location.reload(true);">delete cookie</a>
				-->
				<a onClick="function gcv(a){
					var b=document.cookie.match('(^|;)\\s*'+a+'\\s*=\\s*([^;]+)');
					return (b ? b.pop():'')
				}
				document.cookie='dptUUID=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
				location.reload(true);">delete cookie</a>
			   </div></center>
			`);
		}
		res.status(200);
	} catch (err) {
		next(err);
	}
});

router.get('/recover', async(req, res, next) => {
	//console.log('recover get ' + req.query.phrase);
	var dptUUID;
	var cookieOptions = {
		maxAge: 31536000000, // 1000 * 60 * 60 * 24 * 365 ===> Valid for one year
		signed: true,
		httpOnly: false
	}

	if (req.signedCookies.dptUUID === undefined) {
		console.log("no cookie found, set new one");
		// The client need to get the uuid for the first time, it needs to send it back.
		//		cookieOptions.httpOnly = false;
		//		res.cookie('dptUUID', dptUUID, cookieOptions)
	} else {
		console.log("use old cookie");
		dptUUID = cookieParser.signedCookie(req.signedCookies.dptUUID, process.env.DPT_SECRET);
	}

	var ret = await userService.userReclaim({ body: { phraseGuess: '', newPhrase: req.query.phrase, dptUUID: dptUUID } });
	if (ret.newCookie) {
		res.cookie('dptUUID', ret.newCookie, cookieOptions);
		await res.writeHead(302, {
			'Location': '/dpt3d.html'
				//'Location': '/'
				//add other headers here...
		});
		res.end();
	} else {
		res.send('bla ' + req.body.phraseinput);
		res.status(201);
	}
});

router.post('/recover', async(req, res, next) => {
	var dptUUID;
	var cookieOptions = {
		maxAge: 31536000000, // 1000 * 60 * 60 * 24 * 365 ===> Valid for one year
		signed: true,
		httpOnly: false
	}
	if (req.signedCookies.dptUUID === undefined) {
		console.log("no cookie found, set new one");
		// The client need to get the uuid for the first time, it needs to send it back.
		//		cookieOptions.httpOnly = false;
		//		res.cookie('dptUUID', dptUUID, cookieOptions)
	} else {
		console.log("use old cookie");
		dptUUID = cookieParser.signedCookie(req.signedCookies.dptUUID, process.env.DPT_SECRET);
	}
	var ret = await userService.userReclaim({ body: { phraseGuess: req.body.phraseinput, newPhrase: req.body.phrase, dptUUID: dptUUID } });
	if (ret.newCookie && ret.status == 200) {
		res.cookie('dptUUID', ret.newCookie, cookieOptions);
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
			<br><br><br>${ret.status}<br><br>${ret.data}</center></body>`);
		res.status(201);
	}
});


module.exports = router;