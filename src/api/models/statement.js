const User = require("./user").userModel;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const statementSchema = mongoose.Schema({
  content: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

statementSchema.post("save", async doc => {
  const user = await User.findById(doc.user);
  user.statements.push(doc);
  user.save();
});

statementSchema.post("remove", async doc => {
  const user = await User.findById(doc.user);
  user.statements.pull(doc);
  user.save();
});

exports.statementModel = mongoose.model("Statement", statementSchema);
