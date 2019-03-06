'use strict';

var utils = require('../utils/writer.js');
var Dialogs = require('../service/DialogsService');

module.exports.createDialogs = function createDialogs (req, res, next) {
  Dialogs.createDialogs()
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
