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
            res.send(`<body bgcolor="#0071bc"><center><img src="https://www.digitalpeacetalks.com/img/DPT_Logo_Ball_blue.png" alt="digital peace talks" height="400" width="400">
                <br>Are you a new user?<br><br>
                <fieldset style="text-align:center; width:400px">
                <legend style="text-align:center">This could be your pass-phrase:</legend>
                <h3><b>${phrase}</b>
                </fieldset>
                </h3><br><br>Are you also on another browser?<br><br>Enter your pass-phrase:<br>
                <form method="post" action="/recover"><input type=text name=phraseinput>
                <input type="hidden" name="phrase" value="${phrase}"></form></center>`);
        } else {
            res.send(`<body bgcolor="#0071bc"><center><img src="https://www.digitalpeacetalks.com/img/DPT_Logo_Ball_blue.png" alt="digital peace talks" height="400" width="400">
                <br><br> 
                <a href=/launch3d.html>Start</a>
                <br><br>
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
        res.sendFile(process.env.DPT_PATH + '/html/launch.html');
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
        res.sendFile(process.env.DPT_PATH + '/html/dialog.html');
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
        res.sendFile(process.env.DPT_PATH + '/html/justTheTopics.html');
        res.end;
    } catch (err) {
        next(err);
    }
});

module.exports = router;