// Location: /config/passport.js
/*
var passport    = require('passport'),
  LocalStrategy = require('passport-facebook').Strategy,
  FacebookStrategy = require('passport-facebook').Strategy,
  auth = require("../config/constants.js").authDetails,
  bcrypt = require('bcrypt');


/*
passport.serializeUser(function(user, done) {
  console.log("user : ", user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user[0].id);
});

passport.deserializeUser(function(id, done) {
  console.log(id);
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

*/
/*
passport.use(new FacebookStrategy(auth.facebookAuth, function(token, refreshToken, profile, done) {
  console.log("inside use..");
  process.nextTick(function () {
    console.log("next tick - success :");

    // To keep the example simple, the user's Facebook profile is returned to
    // represent the logged-in user.  In a typical application, you would want
    // to associate the Facebook account with a user record in your database,
    // and return that user instead.
    return done(null, profile);
  });*/

    /*
    // asynchronous
    process.nextTick(function() {

      // find the user in the database based on their facebook id
      User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);

        // if the user is found, then log them in
        if (user) {
          return done(null, user); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          var newUser            = new User();

          // set all of the facebook information in our user model
          newUser.facebook.id    = profile.id; // set the users facebook id
          newUser.facebook.token = token; // we will save the token that facebook provides to the user
          newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
          newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

          // save our user to the database
          newUser.save(function(err) {
            if (err)
              throw err;

            // if successful, return the new user
            return done(null, newUser);
          });
        }

      });
    });
    */

  //}));


/*
passport.use(new LocalStrategy(
  function(username, password, done) {

    User.findByUsername(username).done(function(err, user) {

      if (err) { return done(null, err); }
      if (!user || user.length < 1) { return done(null, false, { message: 'Incorrect User'}); }


      bcrypt.compare(password, user[0].password, function(err, res) {
        if (!res) return done(null, false, { message: 'Invalid Password'});
        return done(null, user);
      });
    });
  })
);

*/


/*
module.exports = {
  express: {
    customMiddleware: function(app){
      console.log('express midleware for passport');
      app.use(passport.initialize());
      app.use(passport.session());
    }
  }
};
*/
