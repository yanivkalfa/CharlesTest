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

var uf = require("../../config/utilFunc.js");

module.exports = {

  index: function(req,res){
    return res.view({
      layout : "layout-auth",
      view: "userprofile/index",
      error: req.flash('loginError')
    });

  },
  userDetails: function(req,res){
    var user = req.user;
    var userMeta = {
      bandName : uf.getValueByKey('bandName', user.userMeta)
    };

    return res.view({
      layout : "layout-auth",
      view: "userprofile/userdetails",
      error: req.flash('finishReg'),
      user: (user) ? user : {},
      userMeta : (userMeta) ? userMeta : {}
    });
  },

  processUserDetails: function(req,res){
    var id = req.user.id,
      user = req.param('user'),
      userMeta = req.param('userMeta'),
      t_n_c = req.param('t_n_c'),
      metaKey;

    user.registrationProcessStatus = req.user.registrationProcessStatus;

    if(t_n_c !== 'on'){
      req.flash('finishReg', 'You must accept accept Terms & Conditions');
      user.registrationProcessStatus = 1;
      return uf.routRegistration(user.registrationProcessStatus, req, res);
    }

    for(metaKey in userMeta){
      UserMeta.destroy({owner:id, metaKey : metaKey}).exec(function(metaKey,err,succ){
        if(!err)
        {
          UserMeta.create({owner:id, metaKey : metaKey, metaValue : userMeta[metaKey]}).exec(function(error, meta){
            if(error){
              req.flash('finishReg', 'Could not update userDetails');
              return uf.routRegistration(user.registrationProcessStatus, req, res);
            }
          });
        }
        else
        {
          req.flash('finishReg', 'Could not update userDetails');
          return uf.routRegistration(user.registrationProcessStatus, req, res);
        }
      }.bind(this, metaKey));
    }
    if(req.user.registrationProcessStatus <= 2){
      user.registrationProcessStatus = 2;
    }
    User.update(id,user).exec(function(err,updated){
      if(err){
        req.flash('finishReg', 'Could not update userDetails');
        return uf.routRegistration(user.registrationProcessStatus, req, res);
      }

      req.flash('finishReg', 'Details Saved Successfully');
      return uf.routRegistration(user.registrationProcessStatus, req, res);
    });
  },

  packageDetails: function(req,res){

    Packages.find().exec(function(err,packages){
      if(err){
        console.log(err);
      }

      return res.view({
        layout : "layout-auth",
        view: "userprofile/packagedetails",
        error: req.flash('finishReg'),
        packages : (packages) ? packages : [],
        user : (req.user) ? req.user : {}
      });
    });

  },


  processPackageDetails: function(req,res){

    var id = req.user.id,
      packageId = req.param('packageId');

    User.update(id,{packageId : packageId, registrationProcessStatus : 3 }).exec(function(err,updated){

      if(err){
        req.flash('finishReg', 'Could not update user package');
        return uf.routRegistration(req.user.registrationProcessStatus, req, res);
      }

      req.flash('finishReg', 'Details Saved Successfully');
      return uf.routRegistration(3, req, res);
    });
  },

  _config: {}


};
