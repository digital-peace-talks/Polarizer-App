#!/usr/bin/node
const util = require("util");
const Lo_ = require("lodash");
const mongoose = require("mongoose");

var OpinionSchema;
var UserSchema;
var TopicSchema;
var DialogSchema;

var connection;
var Dialog;
var Opinion;
var Topic;
var User;

async function deleteTopic(topicId) {
  var connection = await mongoose.connect("mongodb://localhost:27017/dpt-dev", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  UserSchema = require("./user");
  TopicSchema = require("./topic");
  OpinionSchema = require("./opinion");
  DialogSchema = require("./dialog");

  Opinion = OpinionSchema.opinionModel;
  User = UserSchema.userModel;
  Topic = TopicSchema.topicModel;
  Dialog = DialogSchema.dialogModel;

  console.log("topicId: " + topicId);
  var topic = await Topic.findOne(
    { _id: topicId },
    { _id: 1 }
  ).populate("opinions", { _id: 1 });
  console.log("TOPIC: " + util.inspect(topic, { depth: 5 }));

  for (var i in topic.opinions) {
    var dialog = await Dialog.findOne(
      { opinion: topic.opinions[i]._id },
      { _id: 1 }
    );
    if (dialog) {
      console.log("DIALOGS - delete: " + util.inspect(dialog, { depth: 5 }));
      await Dialog.deleteOne({ _id: dialog._id });
    }
    console.log("OPINIONS - delete: " + topic.opinions[i]._id);
    await Opinion.deleteOne({ _id: topic.opinions[i]._id });
  }
  await Topic.deleteOne({ _id: topicId });
}

async function listTopics() {
  topics = await Topic.find({});
  console.log(topics);
}

async function main() {
  await deleteTopic(process.argv[2]);

  process.exit(0);
}

main();
