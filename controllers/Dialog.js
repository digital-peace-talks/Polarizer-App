'use strict';

var utils = require('../utils/writer.js');
var Dialog = require('../service/DialogService');

module.exports.createDialog = function createDialog (req, res, next) {
  var body = req.swagger.params['body'].value;
  Dialog.createDialog(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getDialog = function getDialog (req, res, next) {
  var dialogId = req.swagger.params['dialogId'].value;
  Dialog.getDialog(dialogId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateDialog = function updateDialog (req, res, next) {
  var body = req.swagger.params['body'].value;
  var dialogId = req.swagger.params['dialogId'].value;
  Dialog.updateDialog(body,dialogId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
