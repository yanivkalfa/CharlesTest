

module.exports.authDetails = {
    facebookAuth : {
        /*
        clientID : 725928157454820,
        clientSecret : "fd1d4438d8e29915d698386de26ba388",
        callbackURL : "http://localhost:1337/auth/facebook/callback"
        */

        clientID : 850911408265781,
        clientSecret : "fbede25970c16149a0e69992667f1f77",
        callbackURL : "http://www.mygametests.info:1337/auth/facebook/callback"
    }
};


/*
 * array contain genres
 * */
module.exports.genres = [
    {
        "name" : "Rock",
        "value" : "rock"
    },

    {
        "name" : "Pop",
        "value" : "pop"
    }
];

/*
 * array contain track option - add as you will.
 * */
module.exports.trackOptions = [
    {
        "label" : "Share it",
        "name" : "shareIt",
        "description" : "Allow users to share the track with their friends",
        "enableRequire" : false,
        "options" : []
    },

    {
        "label" : "Buy it",
        "name" : "buyIt",
        "description" : "Link to a website selling your track",
        "enableRequire" : true,
        "options" : [
            {
                "name" : "storeLink",
                "placeholder" : "ENTER LINK TO ONLINE STORE HERE",
                "type" : "text"
            }
        ]
    },
    {
        "label" : "Hear it",
        "name" : "hearIt",
        "description" : "Allow users to listen to the whole track",
        "enableRequire" : true,
        "options" : []
    },

    {
        "label" : "Save it",
        "name" : "saveIt",
        "description" : "Allow users to save the track to their 'Favourites'",
        "enableRequire" : true,
        "options" : []
    }
];


var fs = require('fs');
var credentials = JSON.parse(fs.readFileSync('./aws/credentials.json').toString('utf8'));

module.exports.awsConfig = {
    accessKeyId : credentials.accessKeyId,
    secretAccessKey : credentials.secretAccessKey,
    bucket : "jonBucket"
};