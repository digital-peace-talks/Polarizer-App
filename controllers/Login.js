'use strict';

var utils = require('../utils/writer.js');
var Login = require('../service/LoginService');

module.exports.signUp = function signUp (req, res, next) {
  var body = req.swagger.params['body'].value;
  Login.signUp(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
