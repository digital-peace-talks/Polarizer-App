'use strict';


/**
 * Start crisis mode
 *
 * dialogId String The id of the dialog to retrieve
 * reason String The content of the message to create
 * starterID String The ID of the message sender
 * recipientID String The ID of the message recipient
 * no response value expected for this operation
 **/
exports.addCrisis = function(dialogId,reason,starterID,recipientID) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Create a dialog
 *
 * no response value expected for this operation
 **/
exports.createDialogs = function() {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Add a chat message
 *
 * dialogId String The id of the dialog to retrieve
 * content String The content of the message to create
 * senderID String The ID of the message sender
 * recipientID String The ID of the message recipient
 * no response value expected for this operation
 **/
exports.createMessage = function(dialogId,content,senderID,recipientID) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * List all dialogs
 *
 * limit Integer How many items to return at one time (max 100) (optional)
 * returns Dialogs
 **/
exports.listDialogs = function(limit) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Start crisis mode
 *
 * dialogId String The id of the dialog to retrieve
 * crisisId String The id of the crisis to retrieve
 * reason String The content of the message to create
 * starterID String The ID of the message sender
 * recipientID String The ID of the message recipient
 * no response value expected for this operation
 **/
exports.setCrisisModeStatus = function(dialogId,crisisId,reason,starterID,recipientID) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Info for a specific dialog
 *
 * dialogId String The id of the dialog to retrieve
 * returns Dialogs
 **/
exports.showDialogById = function(dialogId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

