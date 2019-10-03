var express = require("express");
var router = express.Router();
var User = require("../models").User;
var Course = require("../models").Course;
var Institution = require("../models").Institution;
var StudyArea = require("../models").StudyArea;
var Application = require("../models").Application;
var Query = require("../queries/query");
var Logo = require("../models").Logo;
var Banner = require("../models").Banner;
var config = require("../my_modules/config");
router.get("/", async function(req, res) {
  var courses, studyAreas, populars, institutions, banners;
  Query.Course.findAll().then(data => {
    courses = data;
    Query.StudyArea.findAll().then(data => {
      studyAreas = data;
      Query.Course.findByPopular().then(data => {
        populars = data;
        Query.Institution.findAll().then(schools => {
          institutions = schools;
          Query.Banner.activeBanners().then(function(banner) {
            res.render("index", {
              banner: banner,
              courses: courses.length,
              institutions: institutions.length,
              schools: institutions,
              faculties: studyAreas.length,
              data: populars
            });
          });
        });
      });
    });
  });
});

function uniq(a) {
  return Array.from(new Set(a));
}

function getSchoolAndFaculty() {
  return schoolArray;
}

router.get("/schools", async (req, res) => {
  var schoolArray = [];
  var schools = await Query.Institution.findAll();
  var fac = [];
  for (var i = 0; i < schools.length; i++) {
    let course = await Query.Course.findByInstitutionId(schools[i].id);
    console.log("-----------------------------------------------------------");
    console.log(`school: ${schools[i].name}  courses: ${course.length}`);
    console.log("-----------------------------------------------------------");
    for (var j = 0; j < course.length; j++) {
      if (j == 0) {
        fac.push(course[j].StudyArea);
        console.log("trapppppppppppppppppppppppppppppppppppppppppppp");
        console.log(course[j]);
        console.log("trapppppppppppppppppppppppppppppppppppppppppppp");
      }

      idVal = fac.filter(item => item.id !== course[j].StudyArea.id);

      if (idVal.length == 0) {
        fac.push(course[j].StudyArea);
      }
    }

    //let faculties = uniq(fac);
    schoolArray.push({ uni: schools[i], faculty: fac });
    fac = [];
  }

  return res.send({
    auth: false,
    token: null,
    error: false,
    data: schoolArray
  });
});

router.get("/schools", function(req, res) {
  Query.Course.findByPopular().then(function(populars) {
    Query.Course.findAll().then(function(course) {
      res.render("search", { data: populars });
    });
  });
});
router.get("/compare-fees", function(req, res) {
  var populars, schools, courses;
  Query.Course.findByPopular().then(function(populars) {
    Query.Course.findAll().then(function(courses) {
      res.render("compare", {
        courses: courses,
        data: populars
      });
    });
  });
});

router.get("/courses", function(req, res) {
  var populars, schools, courses;
  Query.Course.findByPopular().then(function(populars) {
    Query.Course.findAll().then(function(courses) {
      res.render("course", {
        courses: courses,
        data: populars
      });
    });
  });
});

router.get("/about", function(req, res) {
  Query.Course.findByPopular().then(function(populars) {
    res.render("about", { data: populars });
  });
});
router.get("/pre-departure", function(req, res) {
  let desc = "Pre-Departure Guideline";
  Query.Course.findByPopular().then(function(populars) {
    Query.Departure.findAll().then(function(departure) {
      res.render("richTextTemp", {
        app: departure[0],
        description: desc,
        data: populars
      });
    });
  });
});
router.get("/visa-application-guideline", function(req, res) {
  let desc = "Visa Application Guideline";
  Query.Course.findByPopular().then(function(populars) {
    Query.Guideline.findAll().then(function(guide) {
      res.render("richTextTemp", {
        app: guide[0],
        description: desc
      });
    });
  });
});

router.get("/why-us", (req, res) => {
  Query.Course.findByPopular().then(function(populars) {
    res.render("whyChoose", { data: populars });
  });
});

router.get("/about-scotland", (req, res) => {
  Query.Course.findByPopular().then(function(populars) {
    res.render("aboutScotland", { data: populars });
  });
});

router.get("/detail/:school/:course/:id", (req, res) => {
  let id = req.params.id;
  Query.Course.findByPopular().then(function(populars) {
    Query.Course.findById(id).then(function(course) {
      res.render("course_detail", {
        data: populars,
        course: course
      });
    });
  });
});

router.get("/school-courses/:name/:_id", function(req, res, next) {
  let populars, institutions;
  let Schoolname = req.params.name;
  let id = req.params._id;

  Query.Course.findByPopular().then(function(populars) {
    Query.Course.findByInstitutionId(id).then(function(courseByInstitution) {});
    res.render("schoolCourses", {
      courses: courseByInstitution,
      name: Schoolname,
      data: populars
    });
  });
});

router.get("/school-faculties/:name/:_id", async function(req, res, next) {
  var facultyName = req.params.name;
  var id = req.params._id;

  Query.Course.findByPopular().then(async function(populars) {
    let courseByInstitution = await Query.Course.findByInstitutionId(id);
    let InstitutionById = await Query.Institution.findById(id);
    var faculty = [];
    var facultyCourse = [];
    courseByInstitution.forEach(course => {
      faculty.push(course.StudyArea.id);
    });
    let filterIds = uniq(faculty);
    for (var i = 0; i < filterIds.length; i++) {
      let courses = await Query.Course.findCourseByFacultyAndSchool(
        filterIds[i],
        id
      );
      facultyCourse.push({
        faculty: courses[0].StudyArea.name.toUpperCase(),
        course: courses
      });
    }

    res.render("search_faculty", {
      faculties: facultyCourse,
      name: facultyName,
      data: populars,
      school: InstitutionById
    });
  });
});

router.post("/faculty-courses", async (req, res) => {
  let schoolId = req.body.schoolId;
  let courseByInstitution = await Query.Course.findByInstitutionId(schoolId);
  let InstitutionById = await Query.Institution.findById(schoolId);
  var faculty = [];
  var facultyCourse = [];
  courseByInstitution.forEach(course => {
    faculty.push(course.StudyArea.id);
  });
  let filterIds = uniq(faculty);
  for (var i = 0; i < filterIds.length; i++) {
    console.log("1");
    let courses = await Query.Course.findCourseByFacultyAndSchool(
      filterIds[i],
      schoolId
    );
    facultyCourse.push({
      faculty: courses[0].StudyArea.name,
      course: courses
    });
  }

  return res.send({
    auth: false,
    token: null,
    error: false,
    data: facultyCourse
  });
});

router.get("/dashboard", ensureAuthenticated, async function(req, res) {
  let courses = await Query.Course.findAll();
  let institutions = await Query.Institution.findAll();
  let submittedApplication = await Query.Application.findBySubmitted();
  let app = await Query.Application.findByUser(req.user.id);
  let allApplications = await Query.Application.findAll();
  let users = await Query.User.findAll();
  res.render("dashboard", {
    layout: "layoutDashboard.handlebars",
    instLim: institutions,
    courses: courses.length,
    submitted: submittedApplication,
    institutions: institutions.length,
    users: users.length,
    apply: allApplications,
    app: app
  });
  // });
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
