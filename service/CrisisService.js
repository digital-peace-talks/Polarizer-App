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

