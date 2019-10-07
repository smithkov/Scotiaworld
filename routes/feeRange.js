var express = require("express");
var router = express.Router();
var multer = require("multer");
var FacultyImage = require("../models/feerange");
var StudyArea = require("../models/studyArea");
var config = require("../my_modules/config");
var Query = require("../queries/query");

const entityName = {
  name: "Fee Range",
  entity: "facultyImage",
  url: "/feeRange/"
};

router.get("/add/:_id", async function(req, res, next) {
  let institutionId = req.params._id;
  let studyArea = await Query.StudyArea.findAll();
  let feeRange = await Query.FeeRange.findAll();

  res.render("feeRange", {
    layout: "layoutDashboard.handlebars",
    user: req.user,
    data: feeRange,
    studyArea: studyArea,
    institutionId: institutionId
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

router.post("/add", async function(req, res, next) {
  //  if(req.user.roleId){

  let studyArea = req.body.studyAreaId;
  let fee = req.body.fee;
  let institutionId = req.body.institutionId;
  let getFeeRangeByFac = await Query.FeeRange.findByFaculty(
    institutionId,
    studyArea
  );

  let data = {
    studyAreaId: studyArea,
    fee: fee,
    institutionId: institutionId
  };

  if (getFeeRangeByFac) {
    data.id = getFeeRangeByFac.id;
    let update = await Query.FeeRange.update(data, getFeeRangeByFac.id);
  } else {
    let create = await Query.FeeRange.create(data);
  }

  req.flash(
    "success_msg",
    "You have successfully added a new Study Area Image"
  );
  res.redirect("add/" + institutionId);
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
