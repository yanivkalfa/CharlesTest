/**
 * UploadController.js
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
    q = require("bluebird"),
    awsConfig = require("../../config/constants.js").awsConfig;

module.exports = {

    index : function(req,res){
        if(typeof req.user === 'undefined' || !req.user){
            return res.redirect('/login');
        }

        return res.view({
            view: "upload/index",
            user: (typeof req.user !== 'undefined' && req.user) ? req.user : {},
            userMeta : (typeof req.user !== 'undefined' && typeof req.user.userMeta !== 'undefined') ? req.user.userMeta : {},
            uf: uf,
            error: req.flash('uploadError')
        });

    },

    upload : function(req,res){
        var insertSong = function(song, i){
            return new q(function(resolve, reject) {
                Songs.create({"name" : song.filename, "status" : 0, "order" : i}).then(function(resSong){
                    SongsMeta.create({"metaKey" : "fileDetails", metaValue : song, "owner" : resSong.id}).then(function(songMeta){
                        return resolve(resSong);
                    }).catch(function(err){
                        if(err) return reject(err);
                    });
                }).catch(function(err){
                    if(err) return reject(err);
                });
            });
        };

        var insertAllSongs = function(uploadedSongs){
            var allSongs = uploadedSongs.map(insertSong);
            return q.all(allSongs);
        };

        res.setTimeout(0);
        req.file('files[]').upload({
            adapter: require('skipper-s3'),
            bucket: awsConfig.bucket,
            key: awsConfig.accessKeyId,
            secret: awsConfig.secretAccessKey
        }, function whenDone(err, uploadedFiles) {
            if (err)
            {
                req.flash('uploadError', err);
                return res.redirect('/upload');
            }
            else
            {
                insertAllSongs(uploadedFiles).then(function(songs){
                    var fallback =  req.param('fallback');
                    if(fallback){
                        return res.redirect('/songs/edit?sne=true&id=' + songs[0].id);
                    }else{
                        return res.json(songs);
                    }

                }).catch(function(err){
                    console.log(err);

                    // remove the files from amazon in case database failed
                    /*removeSongsFromS3(uploadedFiles).then(function(uploadedFiles){
                        req.flash('uploadError', err);
                        return res.redirect('/upload');
                    })
                    */
                });
            }
        });
    },

    delSong : function(req,res){
        if(typeof req.user === 'undefined' || !req.user){
            return res.redirect('/login');
        }

        return res.view({
            view: "upload/index",
            user: (typeof req.user !== 'undefined' && req.user) ? req.user : {},
            userMeta : (typeof req.user !== 'undefined' && typeof req.user.userMeta !== 'undefined') ? req.user.userMeta : {},
            uf: uf,
            error: req.flash('uploadError')
        });

    },

    _config: {}
};
