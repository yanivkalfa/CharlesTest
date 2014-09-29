/**
 * Packages
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */;

module.exports = {

  attributes: {

    packageId : {
      type: 'integer'
    },

    name: {
      type: 'string'
    },

    capabilities: {
      type: 'array'
    }
  }
};
