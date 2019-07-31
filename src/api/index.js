const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const config = require("../lib/config");
const logger = require("../lib/logger");
const cors = require("cors");

const log = logger(config.logger);
const app = express();

/*
Setup of the express http service
*/

// We need one cookie per user and we have hash-cookies
// Please change the credential when you run the server in production
const cookieKey = process.env.DPT_SECRET;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(cookieKey));
//app.use(cookieParser());
app.use(cors());

/*
 * Routes
 */
app.use("/metadata", require("./routes/metadata"));
app.use("/user", require("./routes/user"));
app.use("/topic", require("./routes/topic"));
app.use("/opinion", require("./routes/opinion"));
app.use("/dialog", require("./routes/dialog"));
app.use("/misc", require("./routes/misc"));
app.use("/", require("./routes/frontend"));

// catch 404
app.use((req, res, next) => {
  log.error(`Error 404 on ${req.url}.`);
  res.status(404).send({ status: 404, error: "Not found" });
});

// catch errors
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const msg = err.error || err.message;
  log.error(
    `Error ${status} (${msg}) on ${req.method} ${req.url} with payload ${
      req.body
    }.`
  );
  res.status(status).send({ status, error: msg });
});


module.exports = app;

