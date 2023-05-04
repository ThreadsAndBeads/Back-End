const User = require('../Models/UserModel');
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const emailController = require('./EmailController');
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
// const hashPassword = async (password) => {
//   const salt = await bcrypt.genSalt(saltRounds);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   return hashedPassword;
// };
module.exports.signup_post = async (req, res) => {
    const { email, password, type, name } = req.body;
  try {
    // const hashedPassword = await hashPassword(password);
      const user = await User.create({
        email,
        password,
        type,
        name,
        isEmailVerified: false,
      });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        emailController.sendVerificationEmail(name, email);
      res.status(201).json({
        status: "success",
        data: {
          user,
          token,
          message: "verification email sent"
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
module.exports.verify_get = async (req, res) => {
  const verificationToken = req.query.token;

  try {
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        status: "fail",
        message: "Email already verified",
      });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Email verified",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};


module.exports.login_get = async (req, res) => {res.send("user found");} //view

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Login failed, User does not exist" });
    }
    if (!user.comparePassword(password)) {
      return res.json({ message: "Wrong password" });
    }
    if (!user.isEmailVerified) {
      return res.json({ message: "Please verify your email to login" });
    }
    const token = jwt.sign({ id: user._id }, "threadsandbeads website", {
      expiresIn: maxAge,
    });
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ message: "Logged in successfully", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', 'loggedout',{ 
  expires: new Date(Date.now() + 10 * 1000),
   httpOnly: true});

  res.status(200).json({
    status: "success",
  });
}

