const mongoose = require("mongoose");
const config = require("../lib/config");

const logger	= require("../lib/logger");
const log		= logger(config.logger);

const dbUrl = process.env.MONGODB_URI || config.dbUrl;
// Connect to the server


const connection = mongoose.connect(dbUrl, {
  useNewUrlParser: true,
}, function(error) {
  if(error) {
    console.log(dbUrl);
    log.error("db error, can't connect " + error.message);
  }
});

exports.db = mongoose.connection;
