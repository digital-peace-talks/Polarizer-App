'use strict';


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

