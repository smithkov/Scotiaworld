var express = require("express");
var router = express.Router();
var Enquiry = require("../models/enquiry");
var config = require("../my_modules/config");
var Query = require("../queries/query");

const entityName = {
  name: "Enquiries"
};

router.get("/listing", function(req, res, next) {
  Query.FacultyImage.findAll().then(data => {
    res.render("list", {
      layout: "layoutDashboard.handlebars",
      user: req.user,
      data: data,
      entity: entityName
    });
  });
});

router.get("/delete/:_id", function(req, res, next) {
  Query.Enquiry.delete(req.params._id).then(data => {
    res.redirect("/enquiry");
  });
});

router.post("/add", config.uploadAny.single("file"), function(req, res, next) {
  //  if(req.user.roleId){

  let name = req.file.originalname;
  let path = req.file.filename;
  let studyAreaId = req.body.studyAreaId;
  let images = {
    name: name,
    path: path,
    studyAreaId: studyAreaId
  };
  Query.FacultyImage.create(images).then(data => {});

  req.flash(
    "success_msg",
    "You have successfully added a new Study Area Image"
  );
  res.redirect("add");
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
