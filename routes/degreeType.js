var express = require("express");
var router = express.Router();
var multer = require("multer");
var er = require("../config/error").error;
var DegreeType = require("../queries/query").DegreeType;
var config = require("../my_modules/config");
const entityName = {
  name: "Degree Type",
  entity: "degreeType",
  degreeType: true,
  url: "/degree-type/",
  form: config.otherForms
};

router.get("/add", ensureAuthenticated, function(req, res, next) {
  //if(req.user.roleId){
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
  DegreeType.findAll().then(data => {
    res.render("list", {
      layout: "layoutDashboard.handlebars",
      user: req.user,
      data: data,
      entity: entityName
    });
  });
});

router.get("/update/:_id", ensureAuthenticated, function(req, res, next) {
  DegreeType.findById(req.params._id).then(data => {
    res.render("update", {
      layout: "layoutDashboard.handlebars",
      data: data,
      user: req.user,
      entity: entityName
    });
  });
});

router.get("/delete/:_id", function(req, res, next) {
  DegreeType.delete(req.params._id).then(data => {
    res.redirect(entityName.url + "listing");
  });
});

router.post("/update", function(req, res) {
  var name = req.body.name;
  var requirements = req.body.requirements;
  var id = req.body.id;

  DegreeType.update({ name: name, requirements: requirements }, id).then(
    image => {
      req.flash("success_msg", name + " have been modified successfully");
      res.redirect(entityName.url + "listing");
    }
  );
});

router.post("/add", function(req, res, next) {
  //if(req.user.roleId){
  var name = req.body.name;
  var requirements = req.body.requirements;
  var newDegreeType = {
    name: name,
    requirements: requirements
  };

  DegreeType.create(newDegreeType).then(data => {
    req.flash("success_msg", "You have successfully added a new Degree Type");
    res.redirect(entityName.url + "listing");
  });
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
