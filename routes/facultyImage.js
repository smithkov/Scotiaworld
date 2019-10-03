var express = require("express");
var router = express.Router();
var multer = require("multer");
var FacultyImage = require("../models/facultyimage");
var StudyArea = require("../models/studyArea");
var config = require("../my_modules/config");
var Query = require("../queries/query");

const entityName = {
  name: "Faculty Images",
  entity: "facultyImage",
  facultyImage: true,
  url: "/facultyImage/",
  form: config.otherForms
};

router.get("/add", async function(req, res, next) {
  let studyArea = await Query.StudyArea.findAll();
  // if(req.user.roleId){
  //     res.render('add',{layout: 'layoutDashboard.handlebars',user: req.user,entity:entityName});
  // }
  // else{
  //   res.redirect("/login");
  // }

  res.render("add", {
    layout: "layoutDashboard.handlebars",
    user: req.user,
    studyArea: studyArea,
    entity: entityName
  });
});

router.get("/listing", function(req, res, next) {
  // if(req.user.roleId){
  //   City.getAll(function(err,data){
  //     if(err){
  //       throw err;
  //     }
  //      res.render('list',{layout: 'layoutDashboard.handlebars',data:data,user:req.user, entity:entityName});
  //   })
  // }
  // else{
  //   res.redirect("/login");
  // }
  Query.FacultyImage.findAll().then(data => {
    res.render("list", {
      layout: "layoutDashboard.handlebars",
      user: req.user,
      data: data,
      entity: entityName
    });
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

router.get("/delete/:_id", function(req, res, next) {
  Query.FacultyImage.delete(req.params._id).then(data => {
    res.redirect(entityName.url + "listing");
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
