'use strict';


/**
 * Creates a user
 * This can only be done by the logged in user.
 *
 * body User Created user object
 * no response value expected for this operation
 **/
exports.createUser = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Delete user
 * This can only be done by the logged in user.
 *
 * publicKey String The name that needs to be deleted
 * returns ApiResponse
 **/
exports.deleteUser = function(publicKey) {
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
 * Gets metadata of a specific user
 *
 * publicKey String User that needs to be updated
 * returns UserMetadata
 **/
exports.getUserMetadata = function(publicKey) {
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
 * Logs user into the system
 * Issues a JWT for the user - [click for further reading](http://jwt.io)
 *
 * body Body  (optional)
 * returns LoginResponse
 **/
exports.loginUser = function(body) {
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
 * Updates a user
 * This can only be done by the logged in user.
 *
 * body User Updated user object
 * publicKey String User that needs to be updated
 * returns ApiResponse
 **/
exports.updateUser = function(body,publicKey) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

