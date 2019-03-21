'use strict';


/**
 * Gets all statements
 *
 * returns List
 **/
exports.getStatements = function() {
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
 * Creates a new statement
 *
 * body Statement Statement Object
 * returns ApiResponse
 **/
exports.statementPOST = function(body) {
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
 * Updates a statement
 * The user has changed its mind and would like to alter the statement. This should work only if the user is the one who made the statement
 *
 * body Statement Statement Object
 * returns ApiResponse
 **/
exports.statementPUT = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

