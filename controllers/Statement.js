'use strict';

var utils = require('../utils/writer.js');
var Statement = require('../service/StatementService');

module.exports.getStatements = function getStatements (req, res, next) {
  Statement.getStatements()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.statementPOST = function statementPOST (req, res, next) {
  var body = req.swagger.params['body'].value;
  Statement.statementPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.statementPUT = function statementPUT (req, res, next) {
  var body = req.swagger.params['body'].value;
  Statement.statementPUT(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
