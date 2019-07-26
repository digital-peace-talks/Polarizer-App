const mongoose = require("mongoose");
const User = require("./user").userModel;
const Topic = require("./topic").topicModel;
console.log("=======================================");
console.log(Topic);
console.log("=======================================");
const Schema = mongoose.Schema;

const opinionSchema = mongoose.Schema({
  content: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  }
});

opinionSchema.post("save", async doc => {
  const Topic = require("./topic").topicModel;
  await User.findByIdAndUpdate(doc.user, { $addToSet: { opinions: doc._id } });
  await Topic.findByIdAndUpdate(doc.topic, { $addToSet: { opinions: doc._id } });
});

opinionSchema.post("remove", async doc => {
  const user = await User.findById(doc.user);
  user.opinions.pull(doc);
  user.save();
  const topic = await User.findById(doc.topic);
  topic.opinions.pull(doc);
  topic.save();
});

exports.opinionModel = mongoose.model("Opinion", opinionSchema);
