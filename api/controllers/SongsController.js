/**
 * SongsController
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
    AWS = require("aws-sdk"),
    q = require("bluebird");
AWS.config.update({accessKeyId: constant.awsConfig.accessKeyId, secretAccessKey: constant.awsConfig.secretAccessKey});

module.exports = {

    index : function(req, res) {

        if(typeof req.user === 'undefined' || !req.user){
            return res.redirect('/login');
        }

        var toReturn = {
            view: "index",
            user: (typeof req.user !== 'undefined' && req.user) ? req.user : {},
            userMeta : (typeof req.user !== 'undefined' && typeof req.user.userMeta !== 'undefined') ? req.user.userMeta : {},
            songs : [],
            uf: uf
        };

        Songs.find().populate('songMeta').then(function(songs){
            toReturn.songs = songs;
            return res.view(toReturn);
        }).catch(function(err){
            return res.view(toReturn);
        });
    },

    edit  : function(req, res) {
        if(typeof req.user === 'undefined' || !req.user){
            return res.redirect('/login');
        }

        var id = req.param('id');
        var sne = req.param('sne');

        var songParams = {};
        if(req.session.songParams && req.session.songParams.id === id){
            songParams = req.session.songParams;
        }

        var toReturn = {
            view: "songs/edit",
            user: (typeof req.user !== 'undefined' && req.user) ? req.user : {},
            userMeta : (typeof req.user !== 'undefined' && typeof req.user.userMeta !== 'undefined') ? req.user.userMeta : {},
            song : {},
            playLists : [],
            listId : '',
            genres : constant.genres,
            trackOptions : constant.trackOptions,
            sne : sne || '',
            availableSne : [],
            uf: uf,
            error : req.flash('saveError'),
            songParams : songParams
        };


        var findPlayLists = function(song){
            var results = {err:[]};

            results.song = song;
            return PlayLists.find().then(function(playLists){
                results.playLists = playLists;
                return results;
            }).catch(function(err){
                if(err) results.err.push(err);
                return results;
            });
        };

        var findSneSongs = function(results){
            return Songs.find({id: { '!' : [id] }, status:0}).sort("name ASC").then(function(availableSne){
                results.availableSne = availableSne;
                return results;
            }).catch(function(err){
                if(err) results.err.push(err);
                return results;
            });
        };

        if(sne || sne == 'true')
        {
            Songs.findOne({id:id, status:0}).populate('songMeta').populate('playLists')
                .then(findPlayLists)
                .then(findSneSongs)
                .then(function(results){
                    toReturn.song = results.song;
                    toReturn.playLists = results.playLists.map(function(playList){
                        return {"name" : playList.name, "value": playList.id};
                    });
                    if(results.song && typeof results.song.playLists[0] !== 'undefined' || results.song.playLists[0].id){
                        toReturn.listId = results.song.playLists[0].id;
                    }

                    toReturn.availableSne = results.availableSne.map(function(sne){
                        var name = sne.name;
                        if(sne.name.length > 15){
                            name = sne.name.slice(0,12) + '...';
                        }

                        return {"name" : name, "id": sne.id};
                    });

                    return res.view(toReturn);
                }).catch(function(err){
                    console.log(err);
                    if(err) return uf.forbidAccess(req,res,uf);
                });
        }
        else
        {
            Songs.findOne(id).populate('songMeta').populate('playLists')
                .then(findPlayLists)
                .then(function(results){
                    toReturn.song = results.song;
                    toReturn.playLists = results.playLists.map(function(playList){
                        return {"name" : playList.name, "value": playList.id};
                    });
                    if(results.song && typeof results.song.playLists[0] !== 'undefined' || results.song.playLists[0].id){
                        toReturn.listId = results.song.playLists[0].id;
                    }

                    return res.view(toReturn);
                }).catch(function(err){
                    console.log(err);
                    if(err) return uf.forbidAccess(req,res,uf);
                });
        }
    },

    save  : function(req, res) {
        var i,id = req.param('id'),sne = req.param('sne'),nextId = req.param('nextId'),redirectTo,
            songMeta = [], redirectRequest, playList = req.param('playlist'), trackOptions, timeSelection;
        req.session.songParams = req.allParams();

        redirectRequest = function(err){
            redirectTo = '/songs/edit?id=' + id;
            if(err){
                if(sne){
                    redirectTo += '&sne=true';
                }
            }
            else if(sne)
            {
                if(nextId){
                    redirectTo = '/songs/edit?id=' + nextId + '&sne=true';
                }
                else
                {
                    return res.redirect('/songs/');
                }
            }

            return res.redirect(redirectTo);
        };

        timeSelection = req.param('timeSelection');
        if(typeof timeSelection !== 'object')
        {
            try{
                timeSelection = JSON.parse(timeSelection);
            }
            catch(err){}
        }

        var timeSelectionErr = 'Please mark a part of the song you want to set as preview';
        if(timeSelection.endPosition - timeSelection.startPosition > 30){
            timeSelection = false;
            timeSelectionErr = "You've selected more then 30 seconds please select again";
        }

        if(timeSelection.endPosition - timeSelection.startPosition < 5){
            timeSelection = false;
            timeSelectionErr = "Please mark at least 5 seconds";
        }

        trackOptions = req.param('trackOptions');
        if(typeof trackOptions !== 'object')
        {
            try{
                trackOptions = JSON.parse(trackOptions);
            }
            catch(err){}
        }

        songMeta.push({"key" : "timeSelection", "value" :  timeSelection,"req" : true, "err" : {"msg":timeSelectionErr, "type" : "error"}});
        songMeta.push({"key" : "album", "value" :  req.param('album'),"req" : true, "err" : {"msg":"Please enter album name","type":"error"}});
        songMeta.push({"key" : "genre", "value" :  req.param('genre'),"req" : true, "err" : {"msg":"Please select a genre", "type":"error"}});
        songMeta.push({"key" : "songLength", "value" :  req.param('songLength'),"req" : false, "err" : ""});
        songMeta.push({"key" : "trackOptions", "value" : trackOptions,"req" : false, "err" : ""});

        if(!playList || playList == 'false'){
            req.flash('saveError', {"msg": "Please select play list", "type" : "error"});
            return redirectRequest(true);
        }

        for(i = 0; i < songMeta.length; i++){
            if(songMeta[i].req && !songMeta[i].value){
                req.flash('saveError', songMeta[i].err);
                return redirectRequest(true);
            }
        }

        var destroyPrevMeta = function(){
            var metaArr = [];
            for(i = 0; i < songMeta.length; i++){
                metaArr.push(SongsMeta.destroy({"metaKey" : songMeta[i].key, "owner" : id}));
            }
            return q.all(metaArr);
        };

        var createMeta = function(){
            var metaArr = [];
            for(i = 0; i < songMeta.length; i++){
                metaArr.push(SongsMeta.create({"metaKey" : songMeta[i].key, "metaValue" : songMeta[i].value, "owner" : id}));
            }
            return q.all(metaArr);
        };

        var updateSong = function(){
            return Songs.update(id, {"status" : 1, "playLists" : playList, "name" : req.param('name')});
        };

        destroyPrevMeta()
            .then(createMeta)
            .then(updateSong)
            .then(function(song){
                return redirectRequest();
            }).catch(function(err){
                req.flash('songSaveError', {"msg": "An error occur while saving song data please try again." + err, "type" : "error"});
                return redirectRequest(true);
            });
    },

    play :  function(req, res) {
        var id = req.param('id');
        Songs.findOne(id).populate('songMeta').then(function(song){
            var fileDetails = uf.getValueByKey ('fileDetails', song.songMeta);
            var s3 = new AWS.S3();
            var params = {Bucket: fileDetails.extra.Bucket, Key:fileDetails.extra.Key};
            s3.getObject(params).createReadStream().pipe(res);

        }).catch(function(err){
            if(err) return uf.forbidAccess(req,res,uf);
        });
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to UserController)
     */
    _config: {}


};
