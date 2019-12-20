var express = require("express");
var router = express.Router();
var multer = require("multer");
var InstitutionType = require("../models/institutionType");
var config = require("../my_modules/config");
const entityName = {
  name: "Institution Type",
  entity: "institutionType",
  basic: true,
  url: "/institution-type/",
  form: config.otherForms
};

router.get("/add", ensureAuthenticated, function(req, res, next) {
  //  if(req.user.roleId){
  res.render("add", {
    layout: "layoutDashboard.handlebars",
    user: req.user,
    entity: entityName
  });
  // }
  // else{
  //   res.redirect("/login");
  // }
});

router.get("/listing", ensureAuthenticated, function(req, res, next) {
  //if(req.user.roleId){
  InstitutionType.getAll(function(err, data) {
    if (err) {
      throw err;
    }
    res.render("list", {
      layout: "layoutDashboard.handlebars",
      data: data,
      user: req.user,
      entity: entityName
    });
  });
  // }
  // else{
  //   res.redirect("/login");
  // }
});

router.get("/update/:_id", ensureAuthenticated, function(req, res, next) {
  InstitutionType.getById(req.params._id, function(err, data) {
    if (err) {
      //throw err;
    }

    res.render("update", {
      layout: "layoutDashboard.handlebars",
      data: data,
      user: req.user,
      entity: entityName
    });
  });
});

router.get("/delete/:_id", function(req, res, next) {
  InstitutionType.delete(req.params._id, function(err, data) {
    if (err) {
      throw err;
    }
    res.redirect(entityName.url + "listing");
  });
});

router.post("/update", function(req, res) {
  var name = req.body.name;
  var id = req.body.id;
  //  console.log("id: "+ id);

  InstitutionType.update(id, name, {}, function(err, image) {
    if (err) {
      //throw err;
    }
    req.flash("success_msg", name + " have been modified successfully");
    res.redirect(entityName.url + "listing");
  });
});

router.post("/add", function(req, res, next) {
  //  if(req.user.roleId){
  var name = req.body.name;

  //req.checkBody('name', 'Name is required').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    res.render("add", {
      errors: errors
    });
  } else {
    var newInstitutionType = new InstitutionType({
      name: name
    });

    InstitutionType.add(newInstitutionType, function(err, data) {
      if (err) throw err;
      console.log(data);
    });
    req.flash("success_msg", "You have successfully added a new Degree Type");
    res.redirect(entityName.url + "listing");
  }
  // }
  // else{
  //   res.redirect("/login")
  // }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    //req.flash('error_msg','You are not logged in');
    res.redirect("/user/login");
  }
}

module.exports = router;
