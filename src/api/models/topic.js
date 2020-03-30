const mongoose = require("mongoose");
const User = require("./user").userModel;
/*
const Opinion = require("./opinion").opinionModel;
*/
const Schema = mongoose.Schema;

const topicSchema = Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  opinions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Opinion",
      required: true,
    },
  ],
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

topicSchema.post("save", async (doc) => {
  await User.findByIdAndUpdate(doc.user, { $addToSet: { topics: doc._id } });
  //	await Opinion.findByIdAndUpdate(doc.user, { $addToSet: { topic: doc } });
});

/*
topicSchema.post("remove", async doc => {
	const user = await User.findById(doc.user);
	user.topics.pull(doc);
	user.save();
//	const opinion = await Opinion.findById(doc.opinion);
// opinion.topics.pull(doc);
// opinion.save();
	const topic = await User.findById(doc.topic);
	topic.opinions.pull(doc);
	topic.save();
});
*/

topicSchema.index({ content: "text" });

exports.topicModel = mongoose.model("Topic", topicSchema);
