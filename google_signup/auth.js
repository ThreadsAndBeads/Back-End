const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoose = require('mongoose');
const User = require('../Models/UserModel');
require('dotenv').config();


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));



  

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback: true
},
   async  (accessToken, refreshToken, profile, done)=> {
    console.log('profile')
    await User.findOne( 
      { email: profile.email })
      .then((existingUser) => {
        if (existingUser) {
          done(null, existingUser);
        } else {
          const newUser = new User({
            email: profile.email,
            password: accessToken, // Just using accessToken as a placeholder for the password
            type: 'customer', // Assuming all Google users are customers by default
            name: profile.displayName
          });
          newUser.save()
            .then((savedUser) => {
              done(null, savedUser);
            })
            .catch((err) => {
              console.log(err);
              done(err, null);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        done(err, null);
      });
  }
));

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
