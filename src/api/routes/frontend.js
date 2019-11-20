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
		
		// from https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
		var c2c = `
		<script>
		const copyToClipboard = (str) => {
			const el = document.createElement('textarea');  // Create a <textarea> element
			el.value = str;                                 // Set its value to the string that you want copied
			el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
			el.style.position = 'absolute';                 
			el.style.left = '-9999px';                      // Move outside the screen to make it invisible
			document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
			const selected =            
				document.getSelection().rangeCount > 0      // Check if there is any content selected previously
				? document.getSelection().getRangeAt(0)     // Store selection if found
				: false;                                    // Mark as false to know no selection existed before
			el.select();                                    // Select the <textarea> content
			document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
			document.body.removeChild(el);                  // Remove the <textarea> element
			if (selected) {                                 // If a selection existed before copying
				document.getSelection().removeAllRanges();  // Unselect everything on the HTML document
				document.getSelection().addRange(selected); // Restore the original selection
			}
		}
		</script>
		`;

		res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
		if (req.signedCookies.dptUUID === undefined) {
			var phrase = await getPhrase();
			//console.log("no cookie found, set new one");
			//console.log("new phrase: " + phrase);
			// The client need to get the uuid for the first time, it needs to send it back.
			
			/*Digital peace talks is currently in private alpha! Only a minimum viable product is viable at the moment,
			and our primary goal is to get direct feedback from a small set of users to evaluate our core design. 
			Thank you.*/
			
			res.send(`<head><link rel="stylesheet" href="dpt_start.css" /></head>
				<body>${c2c}
				<center><img src="https://www.digitalpeacetalks.com/img/DPT_Logo_Ball_blue.png" alt="digital peace talks" height="300" width="300">
				<br>
				<div class="text">This is a free open source prototype being developed by a social enterprise.<br>
				Please be patient with what we have so far and/or be willing to help.</div>
				<br><br>
				<a href="dptAnleitung.html" target="_blank">Learn how to use DPT here</a>
				<br><br>
				<br><div ><div style="color: #F0F3F5;">Are you a new user?</div><br><br>
				<fieldset style="text-align:center; width:400px;  border-style: solid; border-width: 1px;">
				<legend style="text-align:center; color: #F0F3F5;">This could be your pass-phrase, remember it:</legend>
				<h3><b style="margin: 20px; white-space: nowrap;">${phrase}</b>
				<input type="image" style="width:18px" src="/copytoclipboard_dark.png" onClick="copyToClipboard('${phrase}');"/><br>
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
			<div class="text">This is a free open source prototype being developed by a social enterprise.<br>
			Please be patient with what we have so far and/or be willing to help.</div>
			<br><br>
				<a href="dptAnleitung.html" target="_blank">Learn how to use DPT here</a>
				<br><br>	
				<h3><b>
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