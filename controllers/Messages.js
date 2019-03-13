'use strict';

var utils = require('../utils/writer.js');
var Messages = require('../service/MessagesService');

module.exports.createMessage = function createMessage (req, res, next) {
  var dialogId = req.swagger.params['dialogId'].value;
  var content = req.swagger.params['content'].value;
  var senderID = req.swagger.params['senderID'].value;
  var recipientID = req.swagger.params['recipientID'].value;
  Messages.createMessage(dialogId,content,senderID,recipientID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.listMessages = function listMessages (req, res, next) {
  var dialogId = req.swagger.params['dialogId'].value;
  var limit = req.swagger.params['limit'].value;
  Messages.listMessages(dialogId,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
