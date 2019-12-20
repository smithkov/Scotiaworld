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
const bestSelling = "BEST SELLING COURSES";
router.get("/", async function(req, res) {
  //let courses = await Query.Course.findAll();

  //let studyAreas = await Query.StudyArea.findAll();

  let populars = await Query.Course.findByPopular();
  let cities = await Query.City.findAll();

  let institutions = await Query.Institution.findAll();

  let banner = await Query.Banner.activeBanners();
  res.render("index", {
    banner: banner,
    //courses: courses.length,
    institutions: institutions.length,
    schools: institutions,
    //faculties: studyAreas.length,
    city: cities.length,
    best: bestSelling,
    data: populars
  });
});

function uniq(a) {
  return Array.from(new Set(a));
}

function getSchoolAndFaculty() {
  return schoolArray;
}
router.post("/courseListingMobile",async function(req,res,next){
let offset = req.body.offsetData;
let limit = req.body.limitData;
let searchParam = req.body.searchParam;

let course = await Query.Course.findPaginated(offset,limit,searchParam);

res.send({data:course})
})
router.get("/schools", async (req, res) => {
  var schoolArray = [];
  var schools = await Query.Institution.findAll();
  var fac = [];

  for (var i = 0; i < schools.length; i++) {
    let getSurrogateFaculty = await Query.SurrogateFaculty.findByInstitution(
      schools[i].id
    );
    if (getSurrogateFaculty.length > 0) {
      getSurrogateFaculty.forEach(school => {
        fac.push(school.StudyArea);
      });
      schoolArray.push({ uni: schools[i], faculty: fac });
    } else {
      let course = await Query.Course.findByInstitutionId(schools[i].id);

      for (var j = 0; j < course.length; j++) {
        fac.push(course[j].StudyArea.id);
      }
      let filterIds = uniq(fac);
      fac = [];
      for (var u = 0; u < filterIds.length; u++) {
        let getById = await Query.StudyArea.findById(filterIds[u]);
        fac.push(getById);
        let coursesByFaculty = await Query.Course.findByFacultyId(
          getById.id,
          schools[i].id
        );

        let surrogate = {
          facultyId: getById.id,

          name: getById.name,
          facultyImage: getById.FacultyImages[0].path,
          totalCourse: coursesByFaculty.length,
          studyAreaId: getById.id,
          institutionId: schools[i].id
        };
        let surrogateCFaculty = await Query.SurrogateFaculty.create(surrogate);
      }
      schoolArray.push({ uni: schools[i], faculty: fac });
    }

    fac = [];
  }

  return res.send({
    auth: false,
    token: null,
    error: false,
    data: schoolArray
  });
});
router.post("/getCoursesByFaculty", async (req, res) => {
  let schoolId = req.body.schoolId;
  let facultyId = req.body.facultyId;
  let coursesByFaculty = await Query.Course.findByFacultyId(
    facultyId,
    schoolId
  );
  return res.send({
    success: true,
    data: coursesByFaculty
  });
});

router.get("/schoolsMobile", async (req, res) => {
  // var schoolArray = [];
  // var schools = await Query.Institution.findAll();
  // var fac = [];
  // for (var i = 0; i < schools.length; i++) {
  //   let course = await Query.Course.findByInstitutionId(schools[i].id);

  //   for (var j = 0; j < course.length; j++) {
  //     fac.push(course[j].StudyArea.id);
  //   }
  //   let filterIds = uniq(fac);
  //   fac = [];
  //   for (var u = 0; u < filterIds.length; u++) {
  //     let getById = await Query.StudyArea.findById(filterIds[u]);
  //     let coursesByFaculty = await Query.Course.findByFacultyId(
  //       getById.id,
  //       schools[i].id
  //     );
  //     fac.push({ fac: getById, num: coursesByFaculty.length });
  //   }
  //   schoolArray.push({ uni: schools[i], faculty: fac });
  //   fac = [];
  // }
  var schoolArray = [];
  var schools = await Query.Institution.findAll();
  var fac = [];

  for (var i = 0; i < schools.length; i++) {
    let getSurrogateFaculty = await Query.SurrogateFaculty.findByInstitution(
      schools[i].id
    );
    if (getSurrogateFaculty.length > 0) {
      getSurrogateFaculty.forEach(school => {
        fac.push(school);
      });
      schoolArray.push({ uni: schools[i], faculty: fac });
    }

    fac = [];
  }

  return res.send({
    auth: false,
    token: null,
    error: false,
    data: schoolArray
  });
});

// router.get("/schools", function(req, res) {
//   Query.Course.findByPopular().then(function(populars) {
//     Query.Course.findAll().then(function(course) {
//       res.render("search", { data: populars });
//     });
//   });
// });

router.get("/institutions", function(req, res) {
  Query.Course.findByPopular().then(function(populars) {
    Query.Course.findAll().then(function(course) {
      res.render("institutions", {
        data: reduceArray(populars),
        best: bestSelling
      });
    });
  });
});

router.get("/compare-fees", async function(req, res) {
  let populars = await Query.Course.findByPopular();
  let courses = await Query.Course.findAll();
  let degreeTypes = await Query.DegreeType.findAll();
  let institution = await Query.Institution.findAll();
  let faculty = await Query.StudyArea.findAll();
  res.render("compare", {
    courses: courses,
    best: bestSelling,
    institution: institution,
    faculty: faculty,
    degreeType: degreeTypes,
    data: reduceArray(populars)
  });
});

function reduceArray(arr) {
  let newArr = [];
  for (let i = 0; i < 4; i++) {
    newArr.push(arr[i]);
  }
  return newArr;
}
router.get("/courses", async function(req, res) {
  let populars = await Query.Course.findByPopular();
  let courses = await Query.Course.findAll();
  res.render("course", {
    courses: courses,
    best: bestSelling,
    data: reduceArray(populars)
  });
});

router.get("/getCourses", async function(req, res) {
  let courses = await Query.Course.findAll();
  return res.send({
    data: courses
  });
});

router.get("/dropDown", async function(req, res) {
  let faculty = await Query.StudyArea.findAll();
  let degreeTypes = await Query.DegreeType.findAll();
  let cities = await Query.City.findAll();
  let institutions = await Query.Institution.findAll();
  return res.send({
    data: {
      faculty: faculty,
      degree: degreeTypes,
      cities: cities,
      institutions: institutions
    }
  });
});

router.post("/courseSearch", async function(req, res) {
  let degreeId = req.body.degreeId;
  let facultyId = req.body.facultyId;
  let institutionId = req.body.institutionId;

  let course = await Query.Course.courseSearch(
    degreeId,
    facultyId,
    institutionId
  );
  return res.send({
    data: course
  });
});

router.post("/popular", async function(req, res) {
  let degreeId = req.body.degreeId;
  let facultyId = req.body.facultyId;
  let institutionId = req.body.institutionId;
  let popular = await Query.Course.findPopular(
    degreeId,
    facultyId,
    institutionId
  );
  return res.send({
    data: popular
  });
});

router.get("/popular-Courses", async function(req, res) {
  res.render("popular");
});
router.post("/compareFee", async function(req, res) {
  let institutionId = req.body.institutionId1;
  let institutionId2 = req.body.institutionId2;
  let facultyId = req.body.facultyId;
  let degreeTypeId = req.body.degreeTypeId;

  let courseForInstitution1 = await Query.Course.findByInstitutionIdSearch(
    institutionId,
    facultyId,
    degreeTypeId
  );
  let courseForInstitution2 = await Query.Course.findByInstitutionIdSearch(
    institutionId2,
    facultyId,
    degreeTypeId
  );
  return res.send({
    data: { course1: courseForInstitution1, course2: courseForInstitution2 }
  });
});

router.post("/compareFeeSingle", async function(req, res) {
  let institutionId = req.body.institutionId;
  let facultyId = req.body.facultyId;
  let pageNext = req.body.pageNext;
  let limit = req.body.limit;

  let courseForInstitution = await Query.Course.findByInstitutionIdSearch(
    institutionId,
    facultyId,
    pageNext,
    limit
  );

  return res.send({
    data: courseForInstitution
  });
});

router.get("/about", async function(req, res) {
  // let course = await Query.Course.findAll();
  // for (var i = 0; i < course.length; i++) {
  //   console.log(i);
  //   let path = course[i].path.split(".");
  //   path.pop();
  //   path.pop();
  //   path = path + ".png";
  //   console.log("--------------------------------");
  //   console.log(path);

  //   let update = await Query.Course.update({ path: path }, course[i].id);
  // }
  let populars = await Query.Course.findByPopular();
  res.render("about", { data: reduceArray(populars), best: bestSelling });
});

router.get("/pre-departure", async function(req, res) {
  let desc = "Pre-Departure Guideline";
  let populars = await Query.Course.findByPopular();
  let departure = await Query.Departure.findAll();
  res.render("richTextTemp", {
    app: departure[0],
    description: desc,
    best: bestSelling,
    data: reduceArray(populars)
  });
});

router.get("/visa-application-guideline", function(req, res) {
  let desc = "Visa Application Guideline";
  Query.Guideline.findAll().then(function(guide) {
    res.render("richTextTemp", {
      app: guide[0],
      description: desc
    });
  });
});

router.get("/why-us", (req, res) => {
  Query.Course.findByPopular().then(function(populars) {
    res.render("whyChoose", { data: reduceArray(populars), best: bestSelling });
  });
});

router.get("/contact-us", (req, res) => {
  Query.Course.findByPopular().then(function(populars) {
    res.render("contactUs", { data: reduceArray(populars), best: bestSelling });
  });
});

router.get("/scholarship", (req, res) => {
  Query.Course.findByPopular().then(function(populars) {
    res.render("scholarship", {
      data: reduceArray(populars),
      best: bestSelling
    });
  });
});

router.get("/about-scotland", (req, res) => {
  Query.Course.findByPopular().then(function(populars) {
    res.render("aboutScotland", {
      data: reduceArray(populars),
      best: bestSelling
    });
  });
});

router.get("/checklist", ensureAuthenticated, (req, res) => {
  res.render("checklist", {
    layout: "layoutDashboard.handlebars",
    user: req.user
  });
});

router.get("/help", ensureAuthenticated, (req, res) => {
  res.render("help", {
    layout: "layoutDashboard.handlebars",
    user: req.user
  });
});

router.get("/detail/:school/:course/:id", async (req, res) => {
  let id = req.params.id;
  let populars = await Query.Course.findByPopular();
  let course = await Query.Course.findById(id);
  res.render("course_detail", {
    data: reduceArray(populars),
    best: bestSelling,
    course: course
  });
});

router.get("/school-courses/:name/:_id", async function(req, res, next) {
  let populars, institutions;
  let Schoolname = req.params.name;
  let id = req.params._id;

  let populars = await Query.Course.findByPopular();
  let courseByInstitution = await Query.Course.findByInstitutionId(id);
  res.render("schoolCourses", {
    courses: courseByInstitution,
    name: Schoolname,
    data: reduceArray(populars),
    best: bestSelling
  });
});

router.get("/school-faculties/:name/:_id", async function(req, res, next) {
  let facultyName = req.params.name;
  let id = req.params._id;

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
        faculty: courses[0],
        course: courses
      });
    }

    res.render("search_faculty", {
      faculties: facultyCourse,
      name: facultyName,
      data: reduceArray(populars),
      best: bestSelling,
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

router.get("/faculty/:_id/:schoolId", async (req, res) => {
  let facultyId = req.params._id;
  let schoolId = req.params.schoolId;
  let courseByFaculty = await Query.Course.findByFacultyId(facultyId, schoolId);
  let populars = await Query.Course.findByPopular();

  res.render("faculty", {
    facultyName: courseByFaculty[0].StudyArea.name,
    data: reduceArray(populars),
    best: bestSelling,
    school: courseByFaculty[0].Institution,
    courses: courseByFaculty
  });
});

router.get("/dashboard", ensureAuthenticated, async function(req, res) {
  //let courses = await Query.Course.findAll();
  //let institutions = await Query.Institution.findAll();
  let isAdmin = req.user.roleId;
  if (isAdmin) {
    let submittedApplication = await Query.Application.findBySubmitted();

    //let allApplications = await Query.Application.findAll();

    let unread = await Query.Mail.findAdminUnreadMessages(req.user.id);

    let hasBadge = unread.length > 0 ? true : false;
    res.render("dashboard", {
      layout: "layoutDashboard.handlebars",
      //instLim: institutions,
      unreadNum: unread.length,
      hasBadge: hasBadge,
      submitted: submittedApplication
    });
  } else {
    let app = await Query.Application.findByUser(req.user.id);

    let applicationPercentage = 0;
    let isShowProgress = true;
    let counter = 0;
    let max = 26;
    if (app && app.hasSubmitted) {
      counter = 26;
    } else if (app) {
      app.firstname = !app.firstname || counter++;
      app.lastname = !app.lastname || counter++;
      app.dob = !app.dob || counter++;
      app.gender = !app.gender || counter++;
      app.marital = !app.marital || counter++;
      app.homeAddress = !app.homeAddress || counter++;
      app.phone = !app.phone || counter++;
      app.hGrade = !app.hGrade || counter++;
      app.hSchoolName = !app.hSchoolName || counter++;
      app.hCompleted = !app.hCompleted || counter++;
      app.hProgrammeYear = !app.hProgrammeYear || counter++;
      app.pQualification = !app.pQualification || counter++;
      app.pGrade = !app.pGrade || counter++;
      app.pSchoolName = !app.pSchoolName || counter++;
      app.pCompleted = !app.pCompleted || counter++;
      app.pProgrammeYear = !app.pProgrammeYear || counter++;
      app.highSchoolName = !app.highSchoolName || counter++;
      app.completionYr = !app.completionYr || counter++;
      app.englishTest = !app.englishTest || counter++;
      app.sponsor = !app.sponsor || counter++;
      app.sponsorName = !app.sponsorName || counter++;
      app.sponsorOccupation = !app.sponsorOccupation || counter++;
      app.budget = !app.budget || counter++;
      app.credential = !app.credential || counter++;
      app.hQualification = !app.hQualification || counter++;
      app.pQualification = !app.pQualification || counter++;
    } else {
      isShowProgress = false;
    }

    applicationPercentage = (counter / max) * 100;

    res.render("dashboard", {
      layout: "layoutDashboard.handlebars",
      user: req.user,
      showProgress: isShowProgress,
      appPercentage: parseInt(applicationPercentage),
      app: app
    });
  }
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
