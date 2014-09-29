/**
 * Songs
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        name : {
            type: 'string',
            required: true
        },

        status : {
            type: 'integer'
        },

        order : {
            type: 'integer'
        },

        songMeta : {
            collection: 'SongsMeta',
            via: 'owner'
        },

        playLists: {
            collection: 'playLists',
            via: 'songs',
            dominant:true
        }
    }

};
