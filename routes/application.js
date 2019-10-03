var express = require("express");
var router = express.Router();
var Application = require("../queries/query").Application;
var Course = require("../queries/query").Course;
var Qualification = require("../queries/query").Qualification;
var Institution = require("../queries/query").Institution;
var City = require("../queries/query").City;
var Country = require("../queries/query").Country;
var config = require("../my_modules/config");
var ObjectID = require("mongodb").ObjectID;
var Query = require("../queries/query");

const url = require("url");
const entityName = "application";
const year = [];

function getYear() {
  var d = new Date();
  var y = d.getFullYear();
  for (var i = 1960; i <= y; i++) {
    year.push(i);
  }
  return year;
}

router.get("/step1", ensureAuthenticated, function(req, res, next) {
  //if(req.user.roleId){
  let currentUserId = req.user.id;

  Application.findByUser(currentUserId).then(application => {
    Qualification.findAll().then(quali => {
      Course.findAll().then(course => {
        City.findAll().then(city => {
          Institution.findAll().then(institution => {
            Country.findAll().then(country => {
              if (application && application.hasSubmitted)
                res.redirect("/dashboard");
              else {
                res.render("step1", {
                  layout: "layoutDashboard.handlebars",
                  courses: course,
                  quali: quali,
                  year: getYear(),
                  cities: city,
                  institutions: institution,
                  countries: country,
                  app: application,
                  user: req.user
                });
              }
            });
          });
        });
      });
    });
  });
});

router.get("/step2", ensureAuthenticated, function(req, res, next) {
  //if(req.user.roleId){
  let currentUserId = req.user.id;
  Application.findByUser(currentUserId).then(application => {
    Qualification.findAll().then(quali => {
      Course.findAll().then(course => {
        City.findAll().then(city => {
          Institution.findAll().then(institution => {
            Country.findAll().then(country => {
              if (application && application.hasSubmitted)
                res.redirect("/dashboard");
              else
                res.render("step2", {
                  layout: "layoutDashboard.handlebars",
                  courses: course,
                  quali: quali,
                  year: getYear(),
                  cities: city,
                  institutions: institution,
                  countries: country,
                  app: application,
                  user: req.user
                });
            });
          });
        });
      });
    });
  });
});

router.get("/step3", ensureAuthenticated, function(req, res, next) {
  //if(req.user.roleId){
  let currentUserId = req.user.id;
  Application.findByUser(currentUserId).then(application => {
    Qualification.findAll().then(quali => {
      Course.findAll().then(course => {
        City.findAll().then(city => {
          Institution.findAll().then(institution => {
            Country.findAll().then(country => {
              if (application && application.hasSubmitted)
                res.redirect("/dashboard");
              else {
                res.render("step3", {
                  layout: "layoutDashboard.handlebars",
                  courses: course,
                  quali: quali,
                  year: getYear(),
                  cities: city,
                  institutions: institution,
                  countries: country,
                  app: application,
                  user: req.user
                });
              }
            });
          });
        });
      });
    });
  });
});

router.get("/step4", ensureAuthenticated, function(req, res, next) {
  //if(req.user.roleId){
  let currentUserId = req.user.id;
  Application.findByUser(currentUserId).then(application => {
    Qualification.findAll().then(quali => {
      Course.findAll().then(course => {
        City.findAll().then(city => {
          Institution.findAll().then(institution => {
            Country.findAll().then(country => {
              if (application && application.hasSubmitted)
                res.redirect("/dashboard");
              else
                res.render("step4", {
                  layout: "layoutDashboard.handlebars",
                  courses: course,
                  quali: quali,
                  year: getYear(),
                  cities: city,
                  institutions: institution,
                  countries: country,
                  app: application,
                  user: req.user
                });
            });
          });
        });
      });
    });
  });
});

router.get("/step5", ensureAuthenticated, function(req, res, next) {
  //if(req.user.roleId){
  let currentUserId = req.user.id;
  Application.findByUser(currentUserId).then(application => {
    Qualification.findAll().then(quali => {
      Course.findAll().then(course => {
        City.findAll().then(city => {
          Institution.findAll().then(institution => {
            Country.findAll().then(country => {
              if (application && application.hasSubmitted)
                res.redirect("/dashboard");
              else
                res.render("step5", {
                  layout: "layoutDashboard.handlebars",
                  courses: course,
                  quali: quali,
                  year: getYear(),
                  cities: city,
                  institutions: institution,
                  countries: country,
                  app: application,
                  user: req.user
                });
            });
          });
        });
      });
    });
  });
});

router.get("/applicationByUser/:id", ensureAuthenticated, function(
  req,
  res,
  next
) {
  //if(req.user.roleId){
  let id = req.params.id;
  Application.findByUser(id).then(application => {
    res.render("finish", {
      layout: "layoutDashboard.handlebars",
      app: application,
      user: req.user
    });
  });
});

router.get("/finish", ensureAuthenticated, async function(req, res, next) {
  //if(req.user.roleId){
  let currentUserId = req.user.id;
  let country = await Country.findAll();
  let application = await Application.findByUser(currentUserId);
  let quali = await Qualification.findAll();
  let courses = await Course.findAll();
  let city = await City.findAll();
  let institution = await Institution.findAll();
  if (!application.hasSubmitted) {
    res.render("finish", {
      layout: "layoutDashboard.handlebars",
      app: application,
      countries: country,
      quali: quali,
      year: getYear(),
      cities: city,
      institutions: institution,
      courses: courses,
      user: req.user
    });
  } else {
    res.redirect("/dashboard");
  }
});

router.get("/applicants", ensureAuthenticated, function(req, res, next) {
  Application.findAll().then(applications => {
    res.render("applicantList", {
      layout: "layoutDashboard.handlebars",
      app: applications,
      user: req.user
    });
  });
});

router.get("/Update/:id", ensureAuthenticated, function(req, res, next) {
  let id = req.params.id;
  Application.findById(id).then(data => {
    res.render("update", {
      layout: "layoutDashboard.handlebars",
      user: req.user,
      data: data,
      user: req.user,
      entity: entityName
    });
  });
});

// router.get('/submitMsg',ensureAuthenticated, function(req, res, next) {
//
//       res.render('applicationMsg',{layout: 'layoutDashboard.handlebars',user:req.user});
//
// });

router.get("/delete/:id", ensureAuthenticated, function(req, res, next) {
  let id = req.params.id;
  Application.delete(id).then(data => {
    res.redirect("/listing");
  });
});

router.post("/finalSubmit", config.cpUpload2, ensureAuthenticated, function(
  req,
  res,
  next
) {
  let applicationId = req.body.id;
  let firstname = req.body.firstname;
  let middlename = req.body.middlename;
  let lastname = req.body.lastname;
  let countryId = req.body.countryId;
  let dob = req.body.dob;
  let gender = req.body.gender;
  let marital = req.body.marital;
  let userId = req.user.id;
  let homeAddress = req.body.homeAddress;
  let postalAddress = req.body.postalAddress;
  let phone = req.body.phone;
  let hQualification = req.body.hQualification;
  let hGrade = req.body.hGrade;
  let hSchoolName = req.body.hSchoolName;
  let hCompleted = req.body.hCompleted;
  let hProgrammeYear = req.body.hProgrammeYear;
  let pQualification = req.body.pQualification;
  let pGrade = req.body.pGrade;
  let pSchoolName = req.body.pSchoolName;
  let pCompleted = req.body.pCompleted;
  let pProgrammeYear = req.body.pProgrammeYear;
  let highSchoolName = req.body.highSchoolName;
  let completionYr = req.body.completionYr;
  let englishTest = req.body.englishTest;
  let course1 = req.body.course1;
  let course2 = req.body.course2;
  let level = req.body.level;
  let cityOfChoice = req.body.cityOfChoice;
  let schoolWish1 = req.body.schoolWish1;
  let schoolWish2 = req.body.schoolWish2;
  let sponsor = req.body.sponsor;
  let sponsorName = req.body.sponsorName;
  let sponsorOccupation = req.body.sponsorOccupation;
  let budget = req.body.budget;
  let hasApplied = req.body.hasApplied;
  let purpose = req.body.purpose;
  let reasonOfRefusal = req.body.reasonOfRefusal;
  let moreInfo = req.body.moreInfo;
  let credential = req.body.credential;

  console.log(req.body);
  let img =
    req.files["credential"] === undefined
      ? credential
      : req.files["credential"][0].filename;

  let newApplication = {
    id: applicationId,
    firstname: firstname,
    middlename: middlename,
    lastname: lastname,
    countryId: countryId,
    dob: dob,
    marital: marital,
    gender: gender,
    userId: userId,
    homeAddress: homeAddress,
    postalAddress: postalAddress,
    phone: phone,
    hQualification: hQualification,
    hGrade: hGrade,
    hSchoolName: hSchoolName,
    hCompleted: hCompleted,
    hProgrammeYear: hProgrammeYear,
    pQualification: pQualification,
    pGrade: pGrade,
    pSchoolName: pSchoolName,
    pCompleted: pCompleted,
    pProgrammeYear: pProgrammeYear,
    highSchoolName: highSchoolName,
    completionYr: completionYr,
    englishTest: englishTest,
    course2: course2,
    course1: course1,
    level: level,
    cityId: cityOfChoice,
    schoolWish1: schoolWish1,
    schoolWish2: schoolWish2,
    sponsor: sponsor,
    sponsorName: sponsorName,
    sponsorOccupation: sponsorOccupation,
    budget: budget,
    hasApplied: hasApplied,
    purpose: purpose,
    reasonOfRefusal: reasonOfRefusal,
    credential: img,
    moreInfo: moreInfo,
    hasSubmitted: true,
    decision: "PENDING"
  };

  if (applicationId) {
    Application.update(newApplication, applicationId).then(application => {
      req.flash("success_msg", "Application submission was successful");
      res.redirect("/application/finish");
    });

    res.render("applicationMsg", {
      layout: "layoutDashboard.handlebars",
      user: req.user
    });
  } else {
    throw new Error("Application error ocuured");
  }
});

router.post("/decision", function(req, res, next) {
  let applicationId = req.body.id;
  let userId = req.body.userId;
  var decision = req.body.decision;
  var reason = req.body.reason;

  Application.findById(applicationId).then(data => {
    var newApplication = {
      id: applicationId,
      decision: decision,
      reasonOfRefusal: reason
    };

    if (data) {
      Application.update(newApplication, applicationId).then(application => {
        res.redirect("/application/applicants");
      });
    }
  });
});
router.post("/form1", function(req, res, next) {
  var firstname = req.body.firstname;
  var middlename = req.body.middlename;
  var lastname = req.body.lastname;
  var countryId = req.body.countryId;
  var dob = req.body.dob;
  var gender = req.body.gender;
  var marital = req.body.marital;

  let userId = req.user.id;
  let applicationId = req.body.id;

  var newId = new ObjectID();

  var newApplication = {
    firstname: firstname,
    middlename: middlename,
    lastname: lastname,
    countryId: countryId,
    dob: dob,
    marital: marital,
    gender: gender,
    userId: userId
  };

  if (applicationId) {
    Application.update(newApplication, applicationId).then(application => {
      // req.flash('error_msg', 'Something went wrong trying to save the data');
      // res.redirect("/application/step1");
    });
  } else {
    Application.create(newApplication).then(data => {
      // req.flash('error_msg', 'Something went wrong trying to save the data');
      // res.redirect("/application/step1");
    });
  }
  //req.flash('success_msg', 'Application save successfully');
  res.redirect("/application/step2");
});
router.post("/form2", ensureAuthenticated, function(req, res, next) {
  var homeAddress = req.body.homeAddress;
  var postalAddress = req.body.postalAddress;
  var phone = req.body.phone;
  var applicationId = req.body.id;

  var newApplication = {
    userId: req.user.id,

    homeAddress: homeAddress,
    postalAddress: postalAddress,
    phone: phone
  };

  if (applicationId) {
    newApplication.id = applicationId;
    Application.update(newApplication, applicationId).then(application => {
      // req.flash('error_msg', 'Something went wrong trying to save the data');
      // res.render("step2");
    });
  } else {
    Application.create(newApplication).then(data => {
      // req.flash('error_msg', 'Something went wrong trying to save the data');
      // res.render("/application/step2");
    });
  }

  res.redirect("/application/step3");
});

router.post("/form3", ensureAuthenticated, function(req, res, next) {
  var applicationId = req.body.id;

  var hQualification = req.body.hQualification;
  var hGrade = req.body.hGrade;
  var hSchoolName = req.body.hSchoolName;
  var hCompleted = req.body.hCompleted;
  var hProgrammeYear = req.body.hProgrammeYear;
  var pQualification = req.body.pQualification;
  var pGrade = req.body.pGrade;
  var pSchoolName = req.body.pSchoolName;
  var pCompleted = req.body.pCompleted;
  var pProgrammeYear = req.body.pProgrammeYear;
  var highSchoolName = req.body.highSchoolName;
  var completionYr = req.body.completionYr;
  var englishTest = req.body.englishTest;

  var newApplication = {
    userId: req.user.id,
    hQualification: hQualification,
    hGrade: hGrade,
    hSchoolName: hSchoolName,
    hCompleted: hCompleted,
    hProgrammeYear: hProgrammeYear,
    pQualification: pQualification,
    pGrade: pGrade,
    pSchoolName: pSchoolName,
    pCompleted: pCompleted,
    pProgrammeYear: pProgrammeYear,
    highSchoolName: highSchoolName,
    completionYr: completionYr,
    englishTest: englishTest
  };

  if (applicationId) {
    newApplication.id = applicationId;

    Application.update(newApplication, applicationId).then(application => {});
  } else {
    Application.create(newApplication).then(data => {});
  }
  res.redirect("/application/step4");
});

router.post("/form4", ensureAuthenticated, function(req, res, next) {
  var applicationId = req.body.id;

  var course1 = req.body.course1;
  var course2 = req.body.course2;
  var level = req.body.level;
  var cityOfChoice = req.body.cityOfChoice;
  var schoolWish1 = req.body.schoolWish1;
  var schoolWish2 = req.body.schoolWish2;
  var sponsor = req.body.sponsor;
  var sponsorName = req.body.sponsorName;
  var sponsorOccupation = req.body.sponsorOccupation;
  var budget = req.body.budget;

  var newApplication = {
    userId: req.user.id,
    course2: course2,
    course1: course1,
    level: level,
    cityId: cityOfChoice,
    schoolWish1: schoolWish1,
    schoolWish2: schoolWish2,
    sponsor: sponsor,
    sponsorName: sponsorName,
    sponsorOccupation: sponsorOccupation,
    budget: budget
  };

  if (applicationId) {
    newApplication.id = applicationId;
    Application.update(newApplication, applicationId).then(image => {});
  } else {
    Application.create(newApplication).then(data => {});
  }

  res.redirect("/application/step5");
});

router.post("/form5", config.cpUpload2, ensureAuthenticated, function(
  req,
  res,
  next
) {
  let applicationId = req.body.id;
  let hasApplied = req.body.hasApplied;
  let purpose = req.body.purpose;
  let reasonOfRefusal = req.body.reasonOfRefusal;
  let moreInfo = req.body.moreInfo;
  let img =
    req.files["credential"] === undefined
      ? ""
      : req.files["credential"][0].filename;

  let newApplication = {
    userId: req.user.id,
    hasApplied: hasApplied,
    purpose: purpose,
    reasonOfRefusal: reasonOfRefusal,
    credential: img,
    moreInfo: moreInfo
  };

  if (applicationId) {
    newApplication.id = applicationId;

    Application.update(newApplication, applicationId).then();
  } else {
    Application.create(newApplication).then();
  }

  res.redirect("/application/finish");
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
