const User = require('../Models/UserModel');
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
var FacebookStrategy = require("passport-facebook").Strategy;
//Handling Error Messages
const handleErrors = (err) => {
  let errors = { email: "", password: "" };
  //duplicate error code
  if (err.code === 11000) {
    errors.email = "The email is already registered";
    return errors;
  }
  //validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'threadsandbeads website', {
        expiresIn: maxAge
    });
 }
module.exports.signup_post = async (req, res) => {
    const { email, password, type, name } = req.body;
    try {
        const user = await User.create({ email, password, type, name });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
      // res.status(201).json({ user, token });
      res.status(201).json({
        status: "success",
        data: {
          user,
          token
        },
      });
    } catch (err) {
        const errors = handleErrors(err);
      res.status(400).json({
        status: "fail",
        errors
        });
    }
    
} 

module.exports.login_get = async (req, res) => {res.send("user found");} //view

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;

    let user = await User.findOne({'email': email});
        if(!user){
            res.json({message:"Login failed, User does not exist"})
        }
        if (!user.comparePassword(password)) {
            return res.json({ message: "Wrong password" });
        }
        res.status(200).send("Logged in successfully");

}

exports.facebookLogin = (req, res, next) => {
  passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
};

exports.facebookCallback = async (req, res, next) => {
  try {
    passport.authenticate(
      "facebook",
      { failureRedirect: "/login" },
      async (err, user) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect("/signup");
        }
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        });
      }
    )(req, res, next);
  } catch (err) {
    next(err);
  }
};

exports.googleLogin = (req, res, next) => {
  passport.authenticate("google", { scope: ["email","profile"] })(req, res, next);
};

exports.googleCallback = async (req, res, next) => {
  try {
    passport.authenticate(
      "google",
      { failureRedirect: "/login" },
      async (err, user) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect("/signup");
        }
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        });
      }
    )(req, res, next);
  } catch (err) {
    next(err);
  }
};

