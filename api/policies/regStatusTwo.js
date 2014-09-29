/**
 * regStatusTwo
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
var uf = require("../../config/utilFunc.js");
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  //req.session.authenticated

  var regStatus = req.user.registrationProcessStatus;
  if (regStatus >= 2) {
    return next();
  }

  return uf.routRegistration(regStatus, req, res, true);
  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.redirect("/login");
  //return res.forbidden('You are not permitted to perform this action.');
};
