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
			
		res.send(`
		<!DOCTYPE html>
		<html>
		<head>
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
						<h1>Create a new account</h1>
						<p>
							Digital Peace Talks uses a randomly generated passphrase to authenticate you.
						</p>
						<h3><i>The passphrase cannot be recovered.</i></h3> 
						<p>You can find your passphrase anytime at <code>menu>settings</code></p>
						</p>
						<div class="phrase-wrapper">
							<div class="col"></div>
							<div class="phrase">${phrase}</div>
							<div class="col"></div>
						</div>
						<div class="row">
							<div class="col"></div>
							<div class="col">
								<a class="start" href="/recover?phrase=${encodeURIComponent(phrase)}">Start &#9655;</a>
							</div>
							<div class="col"></div>
						</div>
					</div>
					<div class="rechts">
						<h1>Sign in to existing account</h1>
						<p>If you already have a passphrase, enter it below.</p>
						<form method="post" action="/recover">
						<div class="row center">
						<div class="col"></div>
							<div class="col">
								<input type=text name=phraseinput>
								<input type="hidden" name="phrase" value="${phrase}">
							</div>
							<div class="col"></div>
						</div>
						</form>
					</div>
					<div class="rechts">
						<h1>Sign in with humanID</h1>
						<p>Sign in anonymously and securely through humanID using a phone number</p>
						<div class="row center">
						<div class="col"></div>
							<div class="col">
								<a href="/human" class="human"><img src="anonymous-login.svg" alt="Anonymous Login with humanID" height="32"></a>
							</div>
							<div class="col"></div>
						</div>
					</div>
					<div class="rechts">
						<h1>Sign in with Metamask</h1>
						<p>Sign in using your Metamask crypto wallet</p>
						<div class="row center">
						<div class="col"></div>
							<div class="col">
								<button type="button" onclick="loginEth();" class="start" name="metamask">Authenticate with Metamask &#9655;</button>
							</div>
							<div class="col"></div>
						</div>
					</div>
				</div>
			<footer>
				Please be aware that DPT grants everyone the right to voice their opinion. Even if it is, within the boundaries of the German federal law, extreme. Nobody, on the other hand, will ever be allowed to cross your personal boundaries in DPT (one strike policy).
			</footer>
			</div>
			<br>
			<br>
			<br>
			<br>
			<script src="https://unpkg.com/@metamask/detect-provider/dist/detect-provider.min.js"></script>
			<script>
				
				async function loginEth() {
				  const provider = await detectEthereumProvider();
				  
				  if (!provider) {
				    alert("Please install Metamask!");
				  } else if (provider !== window.ethereum) {
				    alert('Do you have multiple wallets installed?');
				  } else {
				    let currentAccount = null;
				    try {
				      const accounts = await window.ethereum.request( {
					    	method: 'eth_requestAccounts'
					    });
				      currentAccount = accounts[0];
				      if (currentAccount) {
				        fetch("/metamask?publicAddress=" + currentAccount.toLowerCase())
				        .then((response) => (response.json()))
				  			.then((data) => {
				  			  const nonce = data.nonce;
				    			const publicAddress = data.publicAddress;
				    			const message = "I authorize Metamask to sign my one-time nonce for sign-in to DPT: " + nonce;
				    			// return new Promise((resolve, reject) => {
				    				window.ethereum.request( {
				    					method: 'personal_sign',
				    					params: [publicAddress, message]

				    			}).then((data) => {
				    			  console.log("Verifying!");
				      			fetch("/verifysig?publicAddress=" + publicAddress + "&signature=" + data)
				      				.then((data) => { return data.json() })
				      				.then((user) => {
				      	  			console.log("Redirect here");

				      					fetch("/recover-alt?session=" + user.newCookie)
				      						.then(() => location.reload());
				      				})
				    			})
				    		})
				      }
				    } catch {
				    	console.log("Unable to access ETH accounts");
				    }
				  }
				}
				
			</script>
			</body>
			</html>`);
		} else {
			res.redirect('dpt3d.html');
			}
		res.status(200);
	} catch (err) {
		next(err);
	}
});

/*

router.get('/recover', async(req, res, next) => {
	// console.log('recover get ' + req.query.phrase);
	// console.log("Creating new account");
	var dptUUID;
	var cookieOptions = {
		maxAge: 31536000000, // 1000 * 60 * 60 * 24 * 365 ===> Valid for one year
		signed: true,
		httpOnly: false
	}

	if (req.signedCookies.dptUUID === undefined) {
		console.log("no cookie found, set new one in get method");
		// The client need to get the uuid for the first time, it needs to send it back.
		//		cookieOptions.httpOnly = false;
		//		res.cookie('dptUUID', dptUUID, cookieOptions)
	} else {
		console.log("use old cookie");
		dptUUID = cookieParser.signedCookie(req.signedCookies.dptUUID, process.env.DPT_SECRET);
	}

	var ret = await userService.userReclaim({ body: { phraseGuess: '', newPhrase: req.query.phrase, dptUUID: dptUUID } });
	if (ret.newCookie) {
		console.log("new cookie?");
		res.cookie('dptUUID', ret.newCookie, cookieOptions);
		await res.writeHead(302, {
			'Location': '/dpt3d.html'
				//'Location': '/'
				//add other headers here...
		});
		res.end();
	} else {
		console.log("old cookie?");
		res.send('bla ' + req.body.phraseinput);
		res.status(201);
	}
});


router.get('/recovermeta', async(req, res, next) => {
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
		await res.writeHead(302, {
			'Location': '/dpt3d.html'
			//'Location': '/'
			//add other headers here...
		});
		res.end();
	} else {
		console.log("missing cookie?");
		res.send('bla ');
		res.status(201);
	}
});

router.post('/recovermeta', async(req, res, next) => {
	var dptUUID;
	var cookieOptions = {
		maxAge: 31536000000, // 1000 * 60 * 60 * 24 * 365 ===> Valid for one year
		signed: true,
		httpOnly: false
	}
	console.log("TEST");
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


 */

module.exports = router;