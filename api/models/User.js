/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    uid : {
      type: 'string'
    },

    firstName: {
      type: 'string',
      required: true
    },

    lastName: {
      type: 'string',
      required: true
    },

    email: {
      type: 'string',
      required: true,
      unique : true
    },

    loginType : {
      type: 'string',
      required: true
    },

    registrationProcessStatus : {
      type: 'integer'
    },

    packageId :{
      type: 'integer'
    },

    userMeta : {
      collection: 'UserMeta',
      via: 'owner'
    }
  }

};
