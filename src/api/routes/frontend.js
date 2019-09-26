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
            console.log("no cookie found, set new one");
            // The client need to get the uuid for the first time, it needs to send it back.
            res.send('<center>you are a new user?<br><br>thats your phrase:<br>' + phrase +
                '<br><br>you are user on another browser?<br><br>enter your pass phrase<br>' +
                '<form method="post" action="/recover"><input type=text name=phraseinput>' +
                '<input type="hidden" name="phrase" value="' + phrase + '"></form></center>');
        } else {
            res.send(`<center>homepage<hr><br><br><a href=/launch>start dpt protype</a><br><br>
					<a href=/babylon.html>babylon sample</a><br><br>
					<a href=/launch3d.html>launch3D sample</a><br><br>
					<a href=/dialog.html>dialog sample</a><br><br>
					<!--
					<a onClick="function gcv(a) {var b=document.cookie.match('(^|;)\\s*'+a+'\\s*=\\s*([^;]+)');return b?b.pop():''};document.cookie='dptUUID='+gcv('dptUUID')+'; max-age=0; path=/; domain='+window.location.hostname+';location.reload(true);">delete cookie</a>
					-->
					<a onClick="function gcv(a){
						var b=document.cookie.match('(^|;)\\s*'+a+'\\s*=\\s*([^;]+)');
						return (b ? b.pop():'')
					}
					document.cookie='dptUUID=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
					location.reload(true);">delete cookie</a></center>
			`);
        }
        res.status(200);
    } catch (err) {
        next(err);
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
    if (ret.newCookie) {
        res.cookie('dptUUID', ret.newCookie, cookieOptions);
        await res.writeHead(302, {
            'Location': '/launch3d.html'
                //'Location': '/'
                //add other headers here...
        });
        res.end();
    } else {
        res.send('bla ' + req.body.phraseinput);
        res.status(201);
    }
});

/* PWA ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++ */

router.get('/manifest.json', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/manifest.json');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/sw.js', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/sw.js');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/icon-128x128.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/icon-128x128.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/icon-144x144.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/icon-144x144.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});


router.get('/icon-152x152.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/icon-152x152.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/icon-192x192.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/icon-192x192.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/icon-512x512.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/icon-512x512.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

/* PWA ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++ */

router.get('/dpt-client.js', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/dpt-client.js');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/Interrobang.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/Interrobang.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/chatbubble.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/chatbubble.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/1message_white.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/1message_white.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/2message_white.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/2message_white.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/joypad_white.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/joypad_white.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/message_big_white.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/message_big_white.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/message_small_white.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/message_small_white.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/scale_white.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/scale_white.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/sleep_white.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/sleep_white.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});


router.get('/nav-top-logo.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/nav-top-logo.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/red-green.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/red-green.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/red-blue.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/red-ble.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/blue-green.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/blue-green.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/green-green.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/green-green.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/blue-blue.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/blue-blue.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/red-red.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/red-red.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/grey-grey.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/grey-grey.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/font.ttf', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/font.ttf');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/joystickIcon.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/joystickIcon.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/topic_white.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/topic_white.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/opinion_white.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/opinion_white.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/dialog_white.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/dialog_white.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/bitter.ttf', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/bitter.ttf');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/din.ttf', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/din.ttf');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/babylon.html', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/babylon.html');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/launch3d.html', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/launch3d.html');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/launch3d.js', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/launch3d.js');
        res.status(200);
    } catch (err) {
        next(err);
    }
});


router.get('/dialog.html', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/dialog.html');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/dialog.css', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/dialog.css');
        res.status(200);
    } catch (err) {
        next(err);
    }
});


router.get('/launch3d.css', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/launch3d.css');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/dialog.js', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/dialog.js');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/sleep.png', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/sleep.png');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

router.get('/launch.js', async(req, res, next) => {
    try {
        await res.sendFile(process.env.DPT_PATH + '/static/launch.js');
        res.status(200);
    } catch (err) {
        next(err);
    }
});

//Deliver the launch page
router.get('/launch', async(req, res, next) => {
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
        if (req.signedCookies.dptUUID === undefined) {
            console.log("no cookie found, set new one");
            // The client need to get the uuid for the first time, it needs to send it back.
            cookieOptions.httpOnly = false;
            res.cookie('dptUUID', dptUUID, cookieOptions)
        } else {
            console.log("use old cookie");
            dptUUID = req.signedCookies.dptUUID;
            res.cookie('dptUUID', dptUUID, cookieOptions)
        }
        console.log('session tagged with dptUUID ' + dptUUID);
        res.sendFile(process.env.DPT_PATH + '/static/launch.html');
        res.end;
    } catch (err) {
        next(err);
    }
});

//Deliver the dialog page
router.get('/dialog', async(req, res, next) => {
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
        if (req.signedCookies.dptUUID === undefined) {
            console.log("no cookie found, set new one");
            // The client need to get the uuid for the first time, it needs to send it back.
            cookieOptions.httpOnly = false;
            res.cookie('dptUUID', dptUUID, cookieOptions)
        } else {
            console.log("use old cookie");
            dptUUID = req.signedCookies.dptUUID;
            res.cookie('dptUUID', dptUUID, cookieOptions)
        }
        console.log('session tagged with dptUUID ' + dptUUID);
        res.sendFile(process.env.DPT_PATH + '/static/dialog.html');
        res.end;
    } catch (err) {
        next(err);
    }
});

//Deliver the babylon page
router.get('/babylon', async(req, res, next) => {
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
        if (req.signedCookies.dptUUID === undefined) {
            console.log("no cookie found, set new one");
            // The client need to get the uuid for the first time, it needs to send it back.
            cookieOptions.httpOnly = false;
            res.cookie('dptUUID', dptUUID, cookieOptions)
        } else {
            console.log("use old cookie");
            dptUUID = req.signedCookies.dptUUID;
            res.cookie('dptUUID', dptUUID, cookieOptions)
        }
        console.log('session tagged with dptUUID ' + dptUUID);
        res.sendFile(process.env.DPT_PATH + '/static/babylon.html');
        res.end;
    } catch (err) {
        next(err);
    }
});

//Deliver the justTheTopics page
router.get('/justTheTopics.html', async(req, res, next) => {
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
        if (req.signedCookies.dptUUID === undefined) {
            console.log("no cookie found, set new one");
            // The client need to get the uuid for the first time, it needs to send it back.
            cookieOptions.httpOnly = false;
            res.cookie('dptUUID', dptUUID, cookieOptions)
        } else {
            console.log("use old cookie");
            dptUUID = req.signedCookies.dptUUID;
            res.cookie('dptUUID', dptUUID, cookieOptions)
        }
        console.log('session tagged with dptUUID ' + dptUUID);
        res.sendFile(process.env.DPT_PATH + '/static/justTheTopics.html');
        res.end;
    } catch (err) {
        next(err);
    }
});

module.exports = router;