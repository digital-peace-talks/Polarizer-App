const mongoose = require("mongoose");
const User = require("./user").userModel;
const Topic = require("./topic").topicModel;
const Schema = mongoose.Schema;

const opinionSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  context: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

opinionSchema.post("save", async (doc) => {
  const Topic = require("./topic").topicModel;
  await User.findByIdAndUpdate(doc.user, { $addToSet: { opinions: doc._id } });
  await Topic.findByIdAndUpdate(doc.topic, {
    $addToSet: { opinions: doc._id },
  });
});

opinionSchema.post("remove", async (doc) => {
  const user = await User.findById(doc.user);
  user.opinions.pull(doc);
  user.save();
  const topic = await User.findById(doc.topic);
  topic.opinions.pull(doc);
  topic.save();
});

opinionSchema.index({ content: "text" });

exports.opinionModel = mongoose.model("Opinion", opinionSchema);
