const mongoose = require("mongoose");
const config = require("../lib/config");
const dbUrl = config.dbUrl;
const connection = mongoose.connect(dbUrl, {
  useNewUrlParser: true,
});
exports.db = mongoose.connection;
