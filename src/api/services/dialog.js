const ServerError = require("../../lib/error");
const Dialog = require("../models/dialog").dialogModel;
/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.createDialog = async options => {
  const result = await Dialog.create(options.body);
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
module.exports.getDialog = async options => {
  const result = await Dialog.find();
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
  dialog.crisises.save();
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
