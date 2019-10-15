var express = require("express");
var router = express.Router();
var multer = require("multer");
var StudyArea = require("../models/studyArea");
var config = require("../my_modules/config");
var Query = require("../queries/query");

const entityName = {
  name: "Faculty Image",
  entity: "facultyImage",
  url: "/facultyImage/",
  facultyImage: true
};

router.get("/add", async function(req, res, next) {
  // let institutionId = req.params._id;
  let studyArea = await Query.StudyArea.findAll();

  res.render("add", {
    layout: "layoutDashboard.handlebars",
    user: req.user,
    entity: entityName,
    studyArea: studyArea
  });
});

router.get("/update/:_id", function(req, res, next) {
  var id = req.params._id;
  Query.FacultyImage.findById(id).then(data => {
    res.render("update", {
      layout: "layoutDashboard.handlebars",
      user: req.user,

      data: data,
      entity: entityName
    });
  });
});

router.post("/update", config.uploadAny.single("file"), function(req, res) {
  let id = req.body.id;
  let studyAreaId = req.body.studyAreaId;
  let name = req.files ? req.file.originalname : req.body.name;
  let path = req.file ? req.file.filename : req.body.path;
  let images = {
    id: id,
    path: path,
    name: name,
    studyAreaId: studyAreaId
  };
  //  console.log("id: "+ id);
  Query.FacultyImage.update(images, id).then(data => {
    req.flash("success_msg", name + " have been modified successfully");
    res.redirect("listing");
  });
});

router.post("/add", config.uploadAny.single("file"), async function(
  req,
  res,
  next
) {
  //  if(req.user.roleId){
  let studyAreaId = req.body.studyAreaId;
  let name = req.file.originalname;
  let path = req.file.filename;
  let images = {
    path: path,
    name: name,
    studyAreaId: studyAreaId
  };
  //  console.log("id: "+ id);
  Query.FacultyImage.create(images).then(data => {
    req.flash("success_msg", " Image has been modified successfully");
    res.redirect("add");
  });
});

router.get("/listing", function(req, res, next) {
  //  if(req.user.roleId){
  Query.FacultyImage.findAll().then(data => {
    res.render("list", {
      layout: "layoutDashboard.handlebars",
      user: req.user,
      data: data,
      entity: entityName
    });
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
