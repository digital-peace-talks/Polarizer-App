const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  publicKey: { type: String, unique: true },
  statements: [String],
  dialogs: [String],
  signupTime: Date,
});

exports.userModel = mongoose.model("User", userSchema);
