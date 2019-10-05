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
            console.log("new phrase: "+phrase);
            // The client need to get the uuid for the first time, it needs to send it back.
            res.send(`<body bgcolor="#0071bc"><center><img src="https://www.digitalpeacetalks.com/img/DPT_Logo_Ball_blue.png" alt="digital peace talks" height="400" width="400">
                <br>Are you a new user?<br><br>
                <fieldset style="text-align:center; width:400px">
                <legend style="text-align:center">This could be your pass-phrase, remember it:</legend>
                <h3><b style="margin: 20px; white-space: nowrap;">${phrase}</b><br>
                <br><a style="color: #fff; text-decoration: none;" href="/recover?phrase=${encodeURIComponent(phrase)}">Start &#9655;</a>
                </fieldset>
                </h3><br><br>Lost your cookie? A new browser? Recover here.<br><br>Enter your pass-phrase:<br>
                <form method="post" action="/recover"><input type=text name=phraseinput>
                <input type="hidden" name="phrase" value="${phrase}"></form></center>`);
        } else {
            res.send(`<body bgcolor="#0071bc"><center><img src="https://www.digitalpeacetalks.com/img/DPT_Logo_Ball_blue.png" alt="digital peace talks" height="400" width="400">
                <br><br><h3><b>
                <a style="color: #fff; text-decoration: none;" href=/dpt3d.html>Start &#9655;</a>
                </b></h3><br><br>
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

router.get('/recover', async(req, res, next) => {
	console.log('recover get ' + req.query.phrase);
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
    if (ret.newCookie && ret.status==200) {
        res.cookie('dptUUID', ret.newCookie, cookieOptions);
        await res.writeHead(302, {
            'Location': '/dpt3d.html'
                //'Location': '/'
                //add other headers here...
        });
        res.end();
    } else {
        res.send(`<body bgcolor="#0071bc"><center>
        		<img src="https://www.digitalpeacetalks.com/img/DPT_Logo_Ball_blue.png" alt="digital peace talks" height="400" width="400">
        		<br><br><br>
        		${ret.status}<br><br>
        		${ret.data}
        		</center></body>`);
        res.status(201);
    }
});


module.exports = router;