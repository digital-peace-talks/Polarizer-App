const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const config = require("../lib/config");
const logger = require("../lib/logger");
const cors = require("cors");
const favicon = require('serve-favicon');

const log = logger(config.logger);
const app = express();

/*
Setup of the express http service
*/

// We need one cookie per user and we have hash-cookies
// Please change the credential when you run the server in production
const cookieKey = process.env.DPT_SECRET;

app.use(cors());

app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(cookieKey));
app.use(favicon(process.env.DPT_PATH+'/static/favicon.ico'));

/*
 * Routes
 */
app.use("/metadata", require("./routes/metadata"));
app.use("/user", require("./routes/user"));
app.use("/topic", require("./routes/topic"));
app.use("/opinion", require("./routes/opinion"));
app.use("/dialog", require("./routes/dialog"));
app.use("/canvas", require("./routes/canvas"));
app.use("/misc", require("./routes/misc"));
app.use(express.static("static"));
app.use(express.static("html"));
app.use("/", require("./routes/frontend"));


// catch 404
app.use((req, res, next) => {
  log.error(`Error 404 on ${req.url}.`);
  res.status(404).send({ status: 404, error: "Not found" });
});

// catch errors
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const msg = err.error || err.message || err.data;
  log.error(
    `Error ${status} (${msg}) on ${req.method} ${req.url} with payload ${
      req.body
    }.`
  );
  res.status(status).send({ status, error: msg });
});


module.exports = app;

