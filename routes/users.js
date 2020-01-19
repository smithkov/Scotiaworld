var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bodyParser = require("body-parser");
var mongoose = require("mongoose").Schema;
var config = require("../my_modules/config");
var bcrypt = require("bcryptjs");
var Query = require("../queries/query");
let jwt = require("jsonwebtoken");
let defaultImage = "no_photo.jpg";
require("dotenv").config();
let middleware = require("../middleware");
const mail = require("../my_modules/mailer");

var Recaptcha = require("express-recaptcha").Recaptcha;
var recaptcha = new Recaptcha(
  "6Lc-zXIUAAAAACe_rS1Q8DP7BNbly8LolGJGxcb3",
  "6Lc-zXIUAAAAANQ7gn9T32ahpdd21lIWUxpe55AC"
);

var User = require("../models").User;
var Model = require("../models");

const url = "https://namdex.herokuapp.com";
//const url = "http://localhost:3000";
const verifyPath = "/verifyAccount/";
const verifyUrl = url + verifyPath;
const forgotPasswordUrl = url + "/resetPassword/";
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
var OneSignal = require("onesignal-node");

var myClient = new OneSignal.Client({
  userAuthKey: "MTlhOGVmNWEtNGU2MC00ZTdiLWI4MzMtZTllZDJmMjdhNjQw",
  // note that "app" must have "appAuthKey" and "appId" keys
  app: {
    appAuthKey: "OWNjNDg3YzMtMTkzYi00MWZlLTgzNWQtMThlNzlhOGQwNzVm",
    appId: "0bf3e865-0144-4221-a007-94c89b37ac63"
  }
});

// Register
router.get("/register", function(req, res) {
  res.render("register");
});

router.get("/photo", ensureAuthenticated, function(req, res) {
  let photo = config.photoChooser(req.user.photo);
  let user = req.user;
  user.photo = photo;
  res.render("photo", {
    layout: "layoutDashboard.handlebars",
    user: user
  });
});

// Login
router.get(config.login, recaptcha.middleware.render, function(req, res) {
  // var firstNotification = new OneSignal.Notification({
  //   contents: {
  //     en: "Test notification",
  //     tr: "Test mesajı"
  //   },
  //   contents: { en: "Old content" },
  //   included_segments: ["Active Users", "Inactive Users"]
  // });
  // myClient.sendNotification(firstNotification, function(
  //   err,
  //   httpResponse,
  //   data
  // ) {
  //   if (err) {
  //     console.log("Something went wrong...");
  //   } else {
  //     console.log(data, httpResponse.statusCode);
  //   }
  // });
  if (req.user) res.redirect("/dashboard");
  else res.render("login", { captcha: res.recaptcha });
});

router.post("/photo", config.photo.single("file"), async function(req, res) {
  var id = req.body.userId;
  var filename = null;

  if (!req.file && id == undefined) {
    res.status(500).send({ error: true });
  } else {
    filename = req.file.filename;
    let update = await Query.User.update(
      {
        id: id,
        photo: filename
      },
      id
    );
    res.json({ error: false, photo: filename });
  }
});

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

router.post("/mobileLogin", async function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  User.findOne({ where: { username: username } }).then(async function(user) {
    if (user) {
      var passwordIsValid = bcrypt.compareSync(password, user.password);
      if (passwordIsValid) {
        let token = jwt.sign({ username: username }, process.env.secret, {
          expiresIn: "24h" // expires in 24 hours
        });
        let application = await Query.Application.findByUser(user.id);

        res.json({
          success: true,
          user: user,
          app: application,
          message: "Authentication successful!",
          token: token
        });
      } else {
        res.json({
          success: false,
          user: null,
          message: "Authentication failed!",
          token: null
        });
      }
    }
  });
});
router.post("/mobileRegister", async function(req, res) {
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;

  var message = "";
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
            let token = jwt.sign({ username: username }, process.env.secret, {
              expiresIn: "24h" // expires in 24 hours
            });

            res.json({
              success: true,
              message: "Registration Successful!",
              token: token,
              user: user
            });
          }
        });
      });
    });
  } else if (mailExist) {
    // there's already someone with that username
    res.json({
      success: false,
      message: "Email already exist!",
      token: null
    });
  } else if (userExist) {
    res.json({
      success: false,
      message: "Username already exist!",
      token: null
    });
  }
});
router.post("/mobileChangePassword", async function(req, res) {
  let isError = false;
  let username = req.body.username;
  let oldPassword = req.body.oldPassword;
  let newPassword = req.body.newPassword;

  //checking for email and username are already taken
  let userExist = await User.findOne({ where: { username: username } });
  if (userExist) {
    let passwordIsValid = bcrypt.compareSync(oldPassword, userExist.password);
    if (passwordIsValid) {
      bcrypt.genSalt(4, function(err, salt) {
        bcrypt.hash(newPassword, salt, function(err, hash) {
          var newUser = {
            id: userExist.id,
            username: userExist.username,
            password: hash
          };

          Query.User.update(newUser, newUser.id).then(update => {
            res.json(response(isError));
          });
        });
      });
    } else {
      isError = true;
      res.json(response(isError));
    }
  } else {
    isError = true;
    res.json(response(isError));
  }
});

router.post("/change-Password", ensureAuthenticated, async function(req, res) {
  let oldPass = req.body.oldPass;
  let newPass = req.body.newPass;
  let newPass2 = req.body.newPass2;
  let username = req.user.username;

  //checking for email and username are already taken
  if (newPass === newPass2) {
    let userExist = await User.findOne({ where: { username: username } });
    if (userExist) {
      let passwordIsValid = bcrypt.compareSync(oldPass, userExist.password);
      if (passwordIsValid) {
        bcrypt.genSalt(4, function(err, salt) {
          bcrypt.hash(newPass, salt, function(err, hash) {
            var newUser = {
              id: userExist.id,
              password: hash
            };

            Query.User.update(newUser, newUser.id).then(update => {
              //res.json(response(isError));
            });
          });
        });
        req.flash("success_msg", "Password changed successfully.");
      } else {
        req.flash("error_msg", "Old password is not correct");
      }
    } else {
      req.flash("error_msg", "Something went wrong.");
    }
  } else {
    req.flash("error_msg", "New password and re-type password do not match.");
  }

  res.redirect("/user/change-password");
});
function response(isError) {
  return {
    error: isError,
    message: isError
      ? "Old password did not match"
      : "Password was changed successfully.",
    token: null
  };
}

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect(config.loginRedirect);
});
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
  new LocalStrategy(async function(username, password, done) {
    let user = await Query.User.findByUsername(username);

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
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Query.User.findById(id).then(user => {
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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect(config.loginRedirect);
  }
}

//Users send message to admin only
router.post("/sendAdminMessage", async (req, res) => {
  let message = req.body.message;
  let subject = req.body.subject.trim();
  let senderId = req.body.userId;

  var isError = false;

  try {
    let getUser = await Query.User.findById(senderId);
    if (getUser != null) {
      let createMsg = await Query.Mail.create({
        message: message,
        subject: subject,
        senderId: senderId,
        isPublic: false,
        hasRead: false,
        hasReadAdmin: false,
        hasDelete: false
      });
    } else {
      isError = true;
    }
    mail.send(mail.altSender(), mail.messageSubject(getUser.username), message);
  } catch (err) {
    console.log(err);
    isError = true;
  }

  return res.send({
    error: isError
  });
});

router.post("/markAsRead", async (req, res) => {
  let isError = false;
  let messageId = req.body.messageId;
  let msg = {
    id: messageId,
    hasRead: true
  };
  try {
    var getMessage = await Query.Mail.update(msg, messageId);
  } catch (err) {
    isError = true;
  }

  return res.send({
    error: isError
  });
});

router.post("/getUsernames", async (req, res) => {
  let username = req.body.username;

  try {
    let users = await Query.User.findPaginated(username);
    let userArray = [];
    for (var i = 0; i < users.length; i++) {
      let getApplication = await Query.Application.findByUser(users[i].id);
      userArray.push({
        id: users[i].username,
        value: users[i].username,
        label: getApplication
          ? users[i].username +
            ` (${getApplication.firstname} ${getApplication.lastname})`
          : users[i].username + ` (${users[i].email})`
      });
    }

    return res.send({
      data: users,
      users: userArray,
      error: false
    });
  } catch (err) {
    return res.send({
      data: null,
      error: err
    });
  }
});
//get sent messages for web users
router.get("/sentMessages", ensureAuthenticated, async (req, res) => {
  var message = await Query.Mail.findSentMessages(req.user.id);

  var newMessages = [];
  for (var i = 0; message.length > i; i++) {
    message[i].senderName = req.user.username;
    newMessages.push(message[i]);
  }

  res.render("sentMessage", {
    layout: "layoutDashboard.handlebars",
    user: req.user,
    data: newMessages
  });
});
//get sent messages for mobile users
router.post("/getSentMessages", async (req, res) => {
  let isError = false;
  let senderId = req.body.userId;

  var getMessage = await Query.Mail.findSentMessages(senderId);

  return res.send({
    data: getMessage
  });
});

//this is get route for creating a new message
router.get("/compose", ensureAuthenticated, async function(req, res, next) {
  res.render("compose", {
    layout: "layoutDashboard.handlebars",
    user: req.user
  });

  //  res.render('list',{layout: 'layoutDashboard.handlebars',entity:entityName});
});
//this route basically gets messages by user for web app users
router.get("/inbox", ensureAuthenticated, async function(req, res, next) {
  let message = await Query.Mail.findByUserId(req.user);
  var newMessages = [];
  for (var i = 0; message.length > i; i++) {
    let user = await Query.User.findById(message[i].senderId);
    message[i].senderPhoto = user.photo ? user.photo : defaultImage;
    message[i].senderName = user.username;
    newMessages.push(message[i]);
  }

  res.render("inbox", {
    layout: "layoutDashboard.handlebars",
    user: req.user,
    data: newMessages
  });

  //  res.render('list',{layout: 'layoutDashboard.handlebars',entity:entityName});
});

router.get("/myAccount", ensureAuthenticated, async function(req, res, next) {
  res.render("account", {
    layout: "layoutDashboard.handlebars",
    user: req.user
  });

  //  res.render('list',{layout: 'layoutDashboard.handlebars',entity:entityName});
});

router.get("/change-Password", ensureAuthenticated, async function(
  req,
  res,
  next
) {
  res.render("changePassword", {
    layout: "layoutDashboard.handlebars",
    user: req.user
  });
});

//this route basically gets messages by user for web app users
router.get("/inbox-view/:id/:sender", ensureAuthenticated, async function(
  req,
  res,
  next
) {
  let messageId = req.params.id;
  let sender = req.params.sender;
  if (!messageId) throw new Error("The message may have been deleted!");

  letGetMessageById = await Query.Mail.findById(messageId);

  res.render("inbox-read", {
    layout: "layoutDashboard.handlebars",
    user: req.user,
    senderName: sender,
    message: letGetMessageById
  });

  //  res.render('list',{layout: 'layoutDashboard.handlebars',entity:entityName});
});
//this gets messages by user for mobile app users.
router.post("/getMessageByUser", async (req, res) => {
  let isError = false;
  let user = req.body.user;

  let message = await Query.Mail.findByUserId(user);
  var newMessages = [];
  for (var i = 0; message.length > i; i++) {
    let user = await Query.User.findById(message[i].senderId);
    message[i].senderPhoto = user.photo ? user.photo : defaultImage;
    message[i].senderName = user.username;

    console.log(message[i].senderPhoto);
    newMessages.push(message[i]);
  }
  return res.send({
    data: newMessages
  });
});
//Admin sends message to users
router.post("/sendMessage", async (req, res) => {
  let message = req.body.message.trim();
  let subject = req.body.subject.trim();
  let recipient = req.body.recipient;
  let senderId = req.body.userId;

  let isAllUsers = req.body.isAllUsers;
  let isError = false;
  let messageObject = {
    message: message,
    subject: subject,
    hasRead: false,
    senderId: senderId,
    hasReadAdmin: true,
    hasDelete: false
  };
  try {
    if (isAllUsers) {
      let allUsers = await Query.User.findAll();
      messageObject.isPublic = true;
      let createMsg = await Query.Mail.create(messageObject);
    } else {
      let getUser = await Query.User.findByUsername(recipient);
      messageObject.isPublic = false;

      messageObject.userId = getUser.id;
      let createMsg = await Query.Mail.create(messageObject);
      mail.send(getUser.email, mail.messageSubject("Administrator"), message);
    }
  } catch (err) {
    console.log(err);
    isError = true;
  }

  return res.send({
    error: isError
  });
});

router.get("/all", ensureAuthenticated, function(req, res, next) {
  // if(req.user.roleId){
  //   StudyArea.getAll(function(err,data){
  //     if(err){
  //       throw err;
  //     }
  //      res.render('list',{layout: 'layoutDashboard.handlebars',data:data,user:req.user, entity:entityName});
  //   })
  // }
  // else{
  //   res.redirect("/login");
  // }
  Query.User.findAll().then(users => {
    res.render("userList", {
      layout: "layoutDashboard.handlebars",
      user: req.user,
      users: users
    });
  });
  //  res.render('list',{layout: 'layoutDashboard.handlebars',entity:entityName});
});

module.exports = router;
