var express = require('express');
var router = express.Router();
var multer = require('multer');
var StudyArea = require('../queries/query').StudyArea;
var Institution = require('../queries/query').Institution;
var er = require('../config/error').error;
//var Query = require('../queries/query')
var config = require('../my_modules/config');

const entityName = {name:"Study Area/Faculty", entity:"studyArea", studyArea:true, url:"/study-area/"};

router.post('/studyAreaBySchool', function(req, res) {
     let id = req.body.id;

     StudyArea.findByInstitutionId(id).then(data=> {
      res.status(200).send({data: data});
    });
});

router.get('/add',ensureAuthenticated,function(req, res, next) {
  // Institution.getAll(function(err,institution){
  //     if(err){
  //       throw err;
  //     }
    res.render('add',{layout: 'layoutDashboard.handlebars',user:req.user,entity:entityName});
  //})
});

router.get('/listing',ensureAuthenticated,function(req, res, next) {
  // if(req.user.roleId){
  //   StudyArea.getAll(function(err,data){
  //     if(err){
  //       throw err;
  //     }
  //      res.render('list',{layout: 'layoutDashboard.handlebars',data:data,user:req.user, entity:entityName});
  //   })
  // }
  // else{
  //   res.redirect("/login");
  // }
  StudyArea.findAll().then(data=>{
      res.render('list',{layout: 'layoutDashboard.handlebars',user:req.user,data:data, entity:entityName});
   })
//  res.render('list',{layout: 'layoutDashboard.handlebars',entity:entityName});
});

router.get('/update/:_id',ensureAuthenticated, function(req, res, next) {
  let id = req.params._id;
  StudyArea.findById(id).then(data=>{
      res.render('update',{layout: 'layoutDashboard.handlebars',user:req.user,data:data, entity:entityName});
  //  });
    });
});

router.get('/delete/:_id',function(req, res, next) {
  let id = req.params._id;
  StudyArea.delete(id).then(data=>{
      res.redirect(entityName.url+"listing");
    });
});

router.post('/update',ensureAuthenticated,function(req,res){

  let name = req.body.name;
  //var institution= req.body.institution;
  let id = req.body.id;
//  console.log("id: "+ id);

  StudyArea.update({name:name}, id).then(data=>{
    req.flash('success_msg',name+ ' have been modified successfully');
    res.redirect("listing");
  })
});

router.post('/add', function(req, res, next) {

        var name = req.body.name;
      	var newStudyArea = {
          name: name,
        //  institution:institution
        };

        StudyArea.create(newStudyArea).then(data=> {
          req.flash('success_msg', 'You have successfully added a new Study Area');
          res.redirect("listing");
        });
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
