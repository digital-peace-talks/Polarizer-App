'use strict';


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

