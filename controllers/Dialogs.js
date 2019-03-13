'use strict';

var utils = require('../utils/writer.js');
var Dialogs = require('../service/DialogsService');

module.exports.addCrisis = function addCrisis (req, res, next) {
  var dialogId = req.swagger.params['dialogId'].value;
  var reason = req.swagger.params['reason'].value;
  var starterID = req.swagger.params['starterID'].value;
  var recipientID = req.swagger.params['recipientID'].value;
  Dialogs.addCrisis(dialogId,reason,starterID,recipientID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createDialogs = function createDialogs (req, res, next) {
  Dialogs.createDialogs()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.createMessage = function createMessage (req, res, next) {
  var dialogId = req.swagger.params['dialogId'].value;
  var content = req.swagger.params['content'].value;
  var senderID = req.swagger.params['senderID'].value;
  var recipientID = req.swagger.params['recipientID'].value;
  Dialogs.createMessage(dialogId,content,senderID,recipientID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.listDialogs = function listDialogs (req, res, next) {
  var limit = req.swagger.params['limit'].value;
  Dialogs.listDialogs(limit)
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
  Dialogs.setCrisisModeStatus(dialogId,crisisId,reason,starterID,recipientID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.showDialogById = function showDialogById (req, res, next) {
  var dialogId = req.swagger.params['dialogId'].value;
  Dialogs.showDialogById(dialogId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
