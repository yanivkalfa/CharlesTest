/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var passport = require("passport"),
  uf = require("../../config/utilFunc.js");

module.exports = {

  facebookLogin : passport.authenticate('facebook', { scope : 'email' }),

  facebookProcess : function(req,res){
    passport.authenticate('facebook', { failureRedirect: '/login', scope: ['email'] }, function(err, user, info){
      if ((err) || (!user)) {
        req.flash('user', 'Incorrect username or password. Please try again.');
        res.redirect('/login');
        return;
      }

      req.logIn(user, function(err){
        if (err) {
          req.flash('loginError', 'Incorrect username or password. Please try again.');
          return res.redirect('/login');
        }
        return uf.routRegistration(req.user.registrationProcessStatus, req, res);
      });
    })(req, res);
  },

  logout: function (req,res){
    req.logout();
    return res.redirect('/login');
  },



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AuthController)
   */
  _config: {}


};
