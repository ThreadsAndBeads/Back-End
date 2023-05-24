const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
//const mongoose = require('mongoose');
const User = require('../Models/UserModel');
require('dotenv').config();





  

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:7000/auth/google/callback",

},

async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name: profile.displayName,
        type: "customer",
        password: accessToken,
      });
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
}
)

);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      console.log(err);
      done(err, null);
    });
});
