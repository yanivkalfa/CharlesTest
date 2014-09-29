/**
 * Songs
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        metaKey : {
            type: 'string',
            required: true
        },

        metaValue : {
            type: 'json'
        },
    }

    /*
    beforeCreate: function (values, cb) {

        // Encrypt password
        bcrypt.hash(values.password, 10, function(err, hash) {
            if(err) return cb(err);
            values.password = hash;
            //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
            cb();
        });
    }
    */

};
