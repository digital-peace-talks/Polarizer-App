const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  publicKey: { type: String, unique: true, required: true },
  statements: [{ type: Schema.Types.ObjectId, ref: "Statement" }],
  dialogs: [{ type: Schema.Types.ObjectId, ref: "Dialog" }],
  signupTime: { type: Date, required: true },
});

exports.userModel = mongoose.model("User", userSchema);
