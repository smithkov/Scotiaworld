var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bodyParser = require("body-parser");
var mongoose = require("mongoose").Schema;
var config = require("../my_modules/config");
var bcrypt = require("bcryptjs");
var Query = require("../queries/query");
let jwt = require('jsonwebtoken');
require('dotenv').config();
let middleware = require('../middleware');

var Recaptcha = require("express-recaptcha").Recaptcha;
var recaptcha = new Recaptcha(
  "6Lc-zXIUAAAAACe_rS1Q8DP7BNbly8LolGJGxcb3",
  "6Lc-zXIUAAAAANQ7gn9T32ahpdd21lIWUxpe55AC"
);

var User = require("../models").User;
var Model = require("../models");
var Mailer = require("../my_modules/mailer");
const url = "https://namdex.herokuapp.com";
//const url = "http://localhost:3000";
const verifyPath = "/verifyAccount/";
const verifyUrl = url + verifyPath;
const forgotPasswordUrl = url + "/resetPassword/";
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Register
router.get("/register", function(req, res) {
  res.render("register");
});

// Login
router.get(config.login, recaptcha.middleware.render, function(req, res) {
  res.render("login", { captcha: res.recaptcha });
});

// router.get('/resendVerification',ensureAuthenticated,function (req, res) {
//
// 	var userId = req.user.id.toString();
//
// 	Token.getTokenById(userId,function(err,token){
// 		if (err) throw err;
//     var link = verifyUrl+userId;
// 		if(token){
// 				token.token = userId;
// 				token.save(function (err) {
// 					 if (err) {
//
// 						}
// 						Mailer.sendMail([{name:req.user.name,email:req.user.email,link:link,isVerify:true}]);
// 			 });
// 		}
// 		else{
// 				var token = new Token({
// 					 _userId:userId,
// 					 token :userId
// 				})
// 				Token.createToken(token,function(err,token){
// 						Mailer.sendMail([{name:req.user.name,email:req.user.email,link:link,isVerify:true}]);
// 				})
// 		}
// 	})
// 	req.flash('success_msg', 'Verification link has been resent to your email');
// 	res.redirect('/dashboard');
// });

//router.post(config.login,recaptcha.middleware.verify,captchaVerificationLogin,passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: config.login, failureFlash: true }),function (req, res, next) {
//router.post(config.login,passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: config.login, failureFlash: true }),function (req, res, next) {
router.post(
  config.login,
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: config.loginRedirect,
    failureFlash: true
  }),
  function(req, res, next) {
    res.redirect("/dashboard");
  }
);

router.post("/mobileLogin",function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  User.findOne({ where: { username: username } }).then(user => {
    if (user) {
      var passwordIsValid = bcrypt.compareSync(password, user.password);
      if(passwordIsValid){
        let token = jwt.sign({username: username},
            process.env.secret,
            { expiresIn: '24h' // expires in 24 hours
            }
        );
        res.json({
          success: true,
          message: 'Authentication successful!',
          token: token
        });
      }
      else{
        res.json({
          success: false,
          message: 'Authentication failes!',
          token: null
        });
      }
    }
  });
  }
);

router.post("/register", async function(req, res) {
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.confirmPassword;

  var newUser = {
    email: email,
    username: username,
    password: password,
    roleId: false
  };
  //checking for email and username are already taken
  let mailExist = await User.findOne({ where: { email: email } });
  let userExist = await User.findOne({ where: { username: username } });
  if (!mailExist && !userExist) {
    bcrypt.genSalt(4, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        // create that user as no one by that username exists
        User.create(newUser).then(function(user) {
          if (user) {
            req.flash("success_msg", "You are registered and can now login");
            res.redirect(config.loginRedirect);
          }
        });
      });
    });
  } else {
    // there's already someone with that username
    res.render("register", {
      username: userExist ? true : false,
      mail: mailExist ? true : false
    });
  }
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ where: { username: username } }).then(user => {
      if (!user) {
        return done(null, false, { message: "Unknown User" });
      }

      Query.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid password" });
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findByPk(id).then(user => {
    done(null, user);
  });
});

function captchaVerificationLogin(req, res, next) {
  if (req.recaptcha.error) {
    req.flash("error_msg", "Captcha not correct");
    res.redirect(config.loginRedirect);
  } else {
    return next();
  }
}
function captchaVerificationRegister(req, res, next) {
  if (req.recaptcha.error) {
    req.flash("error_msg", "Captcha not correct");
    res.redirect("/register");
  } else {
    return next();
  }
}

router.get("/logout", function(req, res) {
  req.logout();

  req.flash("success_msg", "You are logged out");

  res.redirect(config.loginRedirect);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect(config.loginRedirect);
  }
}

module.exports = router;
