const express = require('express');
const metadata = require('../services/metadata');
const User = require('../models/user');
const userService = require('../services/user');
const uuid = require('uuid/v4');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const getPhrase = require('../../lib/phrasegenerator')

const router = new express.Router();

router.get('/', async (req, res, next) => {
	try {

		// from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
		var c2c = `
		<script>
		const copyToClipboard = (str) => {
			const el = document.createElement('textarea');  // Create a <textarea> element
			el.value = str;								 // Set its value to the string that you want copied
			el.setAttribute('readonly', '');				// Make it readonly to be tamper-proof
			el.style.position = 'absolute';				 
			el.style.left = '-9999px';					  // Move outside the screen to make it invisible
			document.body.appendChild(el);				  // Append the <textarea> element to the HTML document
			const selected =			
				document.getSelection().rangeCount > 0	  // Check if there is any content selected previously
				? document.getSelection().getRangeAt(0)	 // Store selection if found
				: false;									// Mark as false to know no selection existed before
			el.select();									// Select the <textarea> content
			document.execCommand('copy');				   // Copy - only works as a result of a user action (e.g. click events)
			document.body.removeChild(el);				  // Remove the <textarea> element
			if (selected) {								 // If a selection existed before copying
				document.getSelection().removeAllRanges();  // Unselect everything on the HTML document
				document.getSelection().addRange(selected); // Restore the original selection
			}
		}
		</script>
		`;

		res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
	   	var user = await User.userModel.findOne({publicKey: req.signedCookies.dptUUID});
		if(req.signedCookies.dptUUID === undefined || !user) {
		//if(req.signedCookies.dptUUID === undefined) {
			var phrase = await getPhrase();
			//console.log("no cookie found, set new one");
			//console.log("new phrase: " + phrase);
			// The client need to get the uuid for the first time, it needs to send it back.
			
			/*Digital peace talks is currently in private alpha! Only a minimum viable product is viable at the moment,
			and our primary goal is to get direct feedback from a small set of users to evaluate our core design. 
			Thank you.*/
			
		res.send(`<head>
		<link rel="stylesheet" href="dpt_start.css" />
		</head>
		<body>${c2c}
			<div id="wrapper">
				<header>
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<img src="logo_dpt.png" alt="digital peace talks" class="logo">
					<h1>Welcome to digital peace talks.</h1>
					This is a free open source prototype being developed by a social enterprise.<br><br>
					Click here for more information about the project:
					<a href="https://digitalpeacetalks.com/" target="_blank">Our Website</a><br>
					Or learn more about the App:
					<a href="dpt-doku.html" target="_blank">How to use dpt.</a>
					<br>
				</header>
				<div id="mehrspaltig">
					<div class="links">
						<h1>Welcome stranger!</h1>
						<br>
						<b>It seems this is your first visit.</b><br>
						<br>
						Making an account is simple and we don´t even need your data. <br>
						Instead of giving us your mail address and unnecessary information we give you an unique pass phrase. <br>
						It consists of four words and will work as your future key for this app. <br><br>
						And this is your unique pass phrase:<br><br>
						<div class="phrase">${phrase}</div>
						<br>
						<input type="image" class="copytoclip" src="/copytoclipboard_dark.png" onClick="copyToClipboard('${phrase}');"/>Copy phrase to clipboard!
						<br>
						<br>
						Please write it down or memorize it! 
						If you loose or forget this phrase there is no chance to generate a new one for your existing account.
						<a class="start" href="/recover?phrase=${encodeURIComponent(phrase)}">Let me enter &#9655;</a>
						<br>
						<br>
						<br>
						<br>
					</div>
					<div class="rechts">
						<h1>Allready a member?</h1>
						<br>
						Just type in your unique pass phrase to log into your account.<br><br>

						<div class="label">Enter your pass-phrase:</div><br>
						<form method="post" action="/recover"><input type=text name=phraseinput>
						<input type="hidden" name="phrase" value="${phrase}"></form>
					
						<br>
						<br>
						<br>
					</div>
				</div>
			<footer>
				Note:<br>
				Please keep in mind: This project is still under development and is far from major or done. Things can change dramatically. Every time! It's up to the user community to influence the way we go.
			</footer>
			</div>
			<br>
			<br>
			<br>
			<br>`);
		} else {
			res.send(`<head>
				<link rel="stylesheet" href="dpt_start.css" />
				</head>
				<body>
				<div id="wrapper">
					<header>
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
						<img src="logo_dpt.png" alt="digital peace talks" class="logo">
						<h1>Welcome to digital peace talks.</h1>
						This is a free open source prototype being developed by a social enterprise.<br><br>
						Click here for more information about the project:
						<a href="https://digitalpeacetalks.com/" target="_blank">Our Website</a><br>
						Or learn more about the App:
						<a href="dpt-doku.html" target="_blank">How to use dpt.</a>
						<br>
					</header>
					<div id="mehrspaltig">
						<div class="links">
							<h1>Welcome back!</h1>
							<br>
							So awesome to see you again! <br>
							Just enter and continue where you left off last time.<br>
							<br>
							<a class="start" href=/dpt3d.html>Enter the App &#9655;</a>
							<br>
							<br>
							<br>
							<br>
							<!--
							<a class="start" onClick="function gcv(a) {var b=document.cookie.match('(^|;)\\s*'+a+'\\s*=\\s*([^;]+)');return b?b.pop():''};document.cookie='dptUUID='+gcv('dptUUID')+'; max-age=0; path=/; domain='+window.location.hostname+';location.reload(true);">delete cookie</a>
							-->
								
						</div>
						<div class="rechts">
							<h1>Not your device? Login Problems?</h1>
							<br>
							You can delete the cookie for this app and clear your account data from this device.<br><br>
							<b>Caution:</b> If you delete this cookie and you don´t know your pass phrase this account will be inevitably lost forever!<br><br>
							 
							<a class="button" onClick="function gcv(a){
								var b=document.cookie.match('(^|;)\\s*'+a+'\\s*=\\s*([^;]+)');
								return (b ? b.pop():'')
							}
							document.cookie='dptUUID=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
							location.reload(true);">I know what I do!</a>
							<br>
							<br>
							<br>
						</div>
					</div>
					<footer>Note:<br>
						Please keep in mind: This project is still under development and is far from major or done. Things can change dramatically. Every time! It's up to the user community to influence the way we go.
					</footer>
				</div>
				</body>
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
		// cookieOptions.httpOnly = false;
		// res.cookie('dptUUID', dptUUID, cookieOptions)
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