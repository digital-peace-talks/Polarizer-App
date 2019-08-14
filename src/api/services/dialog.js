const ServerError = require("../../lib/error");
const mongoose = require("mongoose");
const Dialog = require("../models/dialog").dialogModel;
const Opinion = require("../models/opinion").opinionModel;
const Topic = require("../models/topic").topicModel;
const Lo_ = require("lodash");

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.createDialog = async (options) => {
	console.log(options);
	const opinion = await Opinion.findOne({"_id": mongoose.Types.ObjectId(options.opinion)});
	options.recipient = opinion.user;
	const result = await Dialog.create(options);
	return {
		status: 200,
		data: result,
	};
};

/**
 * @param {Object} options
 * @param {String} options.dialogId ID of dialog to return
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getDialog = async (options) => {
	var result = [];
	var worker = {};
	worker = await Dialog.find({"initiator": options.userId}).populate('opinion');
	for(var i = 0; i < worker.length; i++) {
		var collection = {};
		collection.dialog = worker[i].id;
		collection.opinionProposition = worker[i].opinionProposition;
		collection.recipientOpinion = worker[i].opinion.content;
		collection.status = worker[i].status;
		var worker2 = await Topic.findOne({ "_id": mongoose.Types.ObjectId(worker[i].opinion.topic)}).populate('opinions');
		collection.topic = worker2.content;
		var opinion = Lo_.find(worker2.opinions, {user: worker[i].initiator});
		collection.initiatorOpinion = opinion.content;
		collection.initiator = 'me';
		result.push(collection);
	}

	worker = await Dialog.find({"recipient": options.userId}).populate('opinion');
	for(var i = 0; i < worker.length; i++) {
		var collection = {};
		collection.dialog = worker[i].id;
		collection.opinionProposition = worker[i].opinionProposition;
		collection.recipientOpinion = worker[i].opinion.content;
		collection.status = worker[i].status;
		var worker2 = await Topic.findOne({ "_id": mongoose.Types.ObjectId(worker[i].opinion.topic)}).populate('opinions');
		collection.topic = worker2.content;
		var opinion = Lo_.find(worker2.opinions, {user: worker[i].initiator});
		collection.initiatorOpinion = opinion.content;
		collection.initiator = 'notme';
		result.push(collection);
	}
	
//	result = { data: result };

  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: result,
  };
};

/**
 * @param {Object} options
 * @param {String} options.dialogId ID of dialog to update
 * @throws {Error}
 * @return {Promise}
 */
module.exports.updateDialog = async options => {
  const result = await Dialog.findByIdAndUpdate(options.dialogId, options.body);
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: result,
  };
};

/**
 * @param {Object} options
 * @param {String} options.dialogId ID of dialog to update
 * @throws {Error}
 * @return {Promise}
 */
module.exports.postMessage = async options => {
  const dialog = await Dialog.findById(options.dialogId);
  dialog.messages.push(options.body);
  dialog.save();
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: dialog,
  };
};
/**
 * @param {Object} options
 * @param {String} options.dialogId ID of dialog to post crisis to
 * @throws {Error}
 * @return {Promise}
 */

module.exports.createCrisis = async options => {
  const dialog = await Dialog.findById(options.dialogId);
  dialog.crisises.push(options.body);
  try {
    await dialog.save();
  } catch (e) {
    return {
      status: 400,
      data: e.message,
    };
  }
  // Implement your business logic here...
  //
  // This function should return as follows:
  //
  // return {
  //   status: 200, // Or another success code.
  //   data: [] // Optional. You can put whatever you want here.
  // };
  //
  // If an error happens during your business logic implementation,
  // you should throw an error as follows:
  //
  // throw new ServerError({
  //   status: 500, // Or another error code.
  //   error: 'Server Error' // Or another error message.
  // });

  return {
    status: 200,
    data: "createCrisis ok!",
  };
};
