'use strict';

var utils = require('../utils/writer.js');
var Metadata = require('../service/MetadataService');

module.exports.getUserMetadata = function getUserMetadata (req, res, next) {
  var publicKey = req.swagger.params['publicKey'].value;
  Metadata.getUserMetadata(publicKey)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
