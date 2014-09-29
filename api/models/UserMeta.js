/**
 * UserMeta
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */


var bcrypt = require('bcrypt');

module.exports = {

  attributes: {

    metaKey: {
      type: 'string',
      required: true
    },

    metaValue: {
      type: 'string',
      required: true
    },

    owner:{
      model:'User'
    }
  }

};
