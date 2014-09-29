/**
 * PlayListsController
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

var uf = require("../../config/utilFunc.js"),
    constant = require("../../config/constants.js"),
    q = require("bluebird");

module.exports = {

    index : function(req, res) {

        if(typeof req.user === 'undefined' || !req.user){
            return res.redirect('/login');
        }

        var toReturn = {
            view: "index",
            user: (typeof req.user !== 'undefined' && req.user) ? req.user : {},
            userMeta : (typeof req.user !== 'undefined' && typeof req.user.userMeta !== 'undefined') ? req.user.userMeta : {},
            playLists : [],
            uf: uf
        };

        PlayLists.find().then(function(playLists){
            toReturn.playLists = playLists;
            return res.view(toReturn);
        }).catch(function(err){
            return res.view(toReturn);
        });
    },

    edit : function(req, res){
        if(typeof req.user === 'undefined' || !req.user){
            return res.redirect('/login');
        }


        var id = req.param('id');

        var toReturn = {
            view: "index",
            user: (typeof req.user !== 'undefined' && req.user) ? req.user : {},
            userMeta : (typeof req.user !== 'undefined' && typeof req.user.userMeta !== 'undefined') ? req.user.userMeta : {},
            playList : {},
            uf: uf,
            id: id,
            error : req.flash('saveError')
        };


        if(!id) return uf.forbidAccess(req,res,uf);

        if(id == 'new')
        {
            return res.view(toReturn);
        }
        else
        {
            PlayLists.findOne(id).populate('songs').then(function(playList){
                if(!playList.id){
                    return uf.forbidAccess(req,res,uf,'could not located that list');
                }
                toReturn.playList = playList;
                return res.view(toReturn);

            }).catch(function(err){
                if(err)return uf.forbidAccess(req,res,uf);
            });
        }
    },

    save : function(req, res){

        var id = req.param('id'), name = req.param('name'),description = req.param('description');

        if(!id) return uf.forbidAccess(req,res,uf);

        if(!name){
            req.flash('saveError', {"msg": "Please enter list name", "type" : "error"});
            return res.redirect('/playlists/edit?id=' + id);
        }

        if(id == 'new')
        {
            PlayLists.create({"name" : req.param('name'), "description" : req.param('description')}).then(function(list){
                return res.redirect('/playlists/edit?id=' + list.id);
            }).catch(function(err){
                if(err)return uf.forbidAccess(req,res,uf);
            });
        }
        else
        {
            PlayLists.update(id,{"name" : req.param('name'), "description" : req.param('description')}).then(function(list){
                return res.redirect('/playlists/edit?id=' + list[0].id);
            }).catch(function(err){
                console.log(err);
                if(err)return uf.forbidAccess(req,res,uf);
            });
        }
    },



    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to UserController)
     */
    _config: {}


};
