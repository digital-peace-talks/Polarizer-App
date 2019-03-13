'use strict';

var utils = require('../utils/writer.js');
var Crisis = require('../service/CrisisService');

module.exports.addCrisis = function addCrisis (req, res, next) {
  var dialogId = req.swagger.params['dialogId'].value;
  var reason = req.swagger.params['reason'].value;
  var starterID = req.swagger.params['starterID'].value;
  var recipientID = req.swagger.params['recipientID'].value;
  Crisis.addCrisis(dialogId,reason,starterID,recipientID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.setCrisisModeStatus = function setCrisisModeStatus (req, res, next) {
  var dialogId = req.swagger.params['dialogId'].value;
  var crisisId = req.swagger.params['crisisId'].value;
  var reason = req.swagger.params['reason'].value;
  var starterID = req.swagger.params['starterID'].value;
  var recipientID = req.swagger.params['recipientID'].value;
  Crisis.setCrisisModeStatus(dialogId,crisisId,reason,starterID,recipientID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
