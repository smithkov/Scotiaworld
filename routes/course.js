var express = require('express');
var router = express.Router();
var multer = require('multer');

var er = require('../config/error').error;
var Query = require('../queries/query')

var config = require('../my_modules/config');
const entityName = {name:"Course", entity:"course",course:true, url:"/course/",form:config.institution};

router.get('/add',ensureAuthenticated, function(req, res, next) {
    //if(req.user.roleId){
    Query.Institution.findAll().then(institutions=>{
      Query.DegreeType.findAll().then(degreetype=>{
        Query.StudyArea.findAll().then(studyArea=>{
          res.render('add',{layout: 'layoutDashboard.handlebars',user:req.user,entity:entityName,inst:institutions,degreeTypeData:degreetype, studyAreaData:studyArea});
        });
      });
    });
});

router.get('/listing',ensureAuthenticated,function(req, res, next) {
//  if(req.user.roleId){
    Query.Course.findAll().then(course=>{
      console.log(course)
      res.render('list',{layout: 'layoutDashboard.handlebars',user:req.user,data:course,entity:entityName});
    });
});


// router.get('/popularCourses',function(req, res, next) {
// //  if(req.user.roleId){
//     Course.getByPopularity(function(err,data){
//       if(err){
//         throw err;
//       }
//        res.render('list',{layout: 'layoutDashboard.handlebars',data:data,entity:entityName});
//     })
//   // }
//   // else{
//   //   res.redirect("/login");
//   // }
// });
router.get('/update/:_id',ensureAuthenticated,function(req, res, next) {
  let id = req.params._id;
  if(!id)
  throw er.err(er.noId);

Query.Course.findById(id).then(course=>{
  Query.Institution.findAll().then(institutions=>{
    Query.DegreeType.findAll().then(degreetype=>{
      Query.StudyArea.findAll().then(studyArea=>{
        res.render('update',{layout: 'layoutDashboard.handlebars',user:req.user,data:course,entity:entityName,inst:institutions,degreeTypeData:degreetype, studyAreaData:studyArea});
      });
    });
  });
})

  //
  // Course.getById(req.params._id,function(err,data){
	// 	if(err){
	// 		//throw err;
	// 	}
  //   Institution.getAll(function(err,instData){
  //       if(err){
  //         throw err;
  //       }
  //       DegreeType.getAll(function(err,degreeTypeData){
  //           if(err){
  //             throw err;
  //           }
  //           StudyArea.getAll(function(err,studyAreaData){
  //               if(err){
  //                 throw err;
  //               }
  //                res.render('update',{layout: 'layoutDashboard.handlebars',user:req.user,data:data,entity:entityName,inst:instData,degreeTypeData:degreeTypeData, studyAreaData:studyAreaData});
  //             })
  //         })
  //     })
  //     //res.render('update',{layout: 'layoutDashboard.handlebars',data:data,entity:entityName});
  //   });
});

router.get('/delete/:_id',function(req, res, next) {
  let id = req.params._id;

  if(!id)
    throw er.err(er.noId);

  Query.Course.delete(id).then(data=>{
    res.redirect(entityName.url+"listing");
  })
});

router.get('/popular/:_id',function(req, res, next) {
  let id = req.params._id;
  if(!id)
   throw  er.err(er.noId);

  Query.Course.findById(id).then(data=>{

     data.isPopular= data.isPopular?false:true;
     Query.Course.update({isPopular:data.isPopular},id).then(data=>{
         res.redirect(entityName.url+"listing");
     })
  })
});
router.get('/courses', function(req, res) {
     Query.Course.findAll().then(courses=>{
          res.status(200).send({data: courses});
     })
});


router.post('/update',config.cpUpload,function(req,res,next){

  var name = req.body.name;
  var id = req.body.id;
  var requirement = req.body.requirement;
  var fee = req.body.fee;
  var duration = req.body.duration;
  var time = req.body.time;
  var institution = req.body.institution;
  var studyArea = req.body.studyArea;
  var degreeType = req.body.degreeType;
  var oldImg = req.body.oldImg;
  var newImg = req.files['logo'] === undefined?oldImg:req.files['logo'][0].filename;
  var img = newImg=== ""?oldImg:newImg;
  var newCourse ={
    id:id,
    name:name,
    requirement : requirement,
    fee: fee,
    path:img,
    duration:duration,
    time:time,
    institutionId:institution,
    studyAreaId: studyArea,
    degreeTypeId: degreeType
  }
//  console.log("id: "+ id);
  Query.Course.update(newCourse, id).then(course=>{
    res.redirect(entityName.url+"listing");
  });
});

router.post('/add',config.cpUpload, function(req, res, next) {
    var name = req.body.name;
    var id = req.body.id;
    var requirement = req.body.requirement;
    var fee = req.body.fee;
    var country = req.body.country;
    var duration = req.body.duration;
    var time = req.body.time;
    var institution = req.body.institution;
    var studyArea = req.body.studyArea;
    var degreeType = req.body.degreeType;
    var img = req.files['logo'] === undefined?"":req.files['logo'][0].filename;


      var newCourse = {
        name:name,
        requirement : requirement,
        fee: fee,
        countryId: country,
        duration:duration,
        time:time,
        institutionId:institution,
        studyAreaId: studyArea,
        path:img,
        degreeTypeId: degreeType
      }
      Query.Course.create(newCourse).then(course=>{

      })
    req.flash('success_msg', 'You have successfully added a new course');
    res.redirect(entityName.url+"listing");

});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/user/login');
	}
}

module.exports = router;
