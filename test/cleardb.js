#!/usr/bin/env node
const mongoose = require("mongoose");
const User = require("../src/api/models/user");
const Topic = require("../src/api/models/topic");
const Opinion = require("../src/api/models/opinion");
const Dialog = require("../src/api/models/dialog");

mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb://localhost/dpt-dev");

async function main() {
  console.log("clear db");
  await User.userModel.deleteMany();
  console.log("deleted users");
  await Topic.topicModel.deleteMany();
  console.log("deleted topics");
  await Opinion.opinionModel.deleteMany();
  console.log("deleted opinions");
  await Dialog.dialogModel.deleteMany();
  console.log("deleted dialogs");
  process.exit();
}

main();
