'use strict';


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
 * List all messages
 *
 * dialogId String The id of the dialog to retrieve
 * limit Integer How many items to return at one time (max 100) (optional)
 * returns Messages
 **/
exports.listMessages = function(dialogId,limit) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

