'use strict';


/**
 * Request for statement
 *
 * statementId String The id of the statement to retrieve
 * invitation String The content of the invitation
 * senderID String The ID of the message sender
 * no response value expected for this operation
 **/
exports.requestDialog = function(statementId,invitation,senderID) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Start request mode
 *
 * statementId String The id of the statement to retrieve
 * requestId String The id of the request to retrieve
 * reason String The content of the message to create
 * starterID String The ID of the message sender
 * recipientID String The ID of the message recipient
 * no response value expected for this operation
 **/
exports.setRequestStatus = function(statementId,requestId,reason,starterID,recipientID) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

