const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path');
const app = express();
require('../utils/googlesignup');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);

}

app.use(session({

    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure:false}

    }));//de session b express

    app.use(passport.initialize());
    app.use(passport.session());//3shn edet unauthorized





app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }//hnget email w profile bs msh kol l info
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure'
}));

app.get('/auth/google/failure', (req, res) => {
    res.send("something went wrong");
});

app.get('/auth/protected',isLoggedIn, (req, res) => {
    let name = req.user.displayName;

    res.send("hello ${name}");
});



app.listen(3000, () => {
    console.log('listening on port 3000');
    
})

