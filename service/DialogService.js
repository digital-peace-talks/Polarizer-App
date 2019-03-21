'use strict';


/**
 * Creates a dialog
 *
 * body Dialog 
 * returns Dialog
 **/
exports.createDialog = function(body) {
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
 * Gets a specific dialog by its ID
 *
 * dialogId String ID of dialog to return
 * returns Dialog
 **/
exports.getDialog = function(dialogId) {
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
 * Updates a dialog (with a message)
 *
 * body Message 
 * dialogId String ID of dialog to update
 * returns Dialog
 **/
exports.updateDialog = function(body,dialogId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

