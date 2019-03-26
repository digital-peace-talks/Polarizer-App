const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  publicKey: String,
  statements: [String],
  dialogs: [String],
  signupTime: Date
});

exports.userModel = mongoose.model("User", userSchema);
