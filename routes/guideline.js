var express = require('express');
var router = express.Router();
var multer = require('multer');

var config = require('../my_modules/config');
var Guideline = require('../queries/query').Guideline

const entityName = {name:"Visa Application Guideline", entity:"richText",richText:true, url:"/guideline/",form:config.otherForms};



router.get('/add',ensureAuthenticated,function(req, res, next) {
    // if(req.user.roleId){
    //     res.render('add',{layout: 'layoutDashboard.handlebars',user: req.user,entity:entityName});
    // }
    // else{
    //   res.redirect("/login");
    // }
    Guideline.findAll().then(data=>{
      res.render('add',{layout: 'layoutDashboard.handlebars',data:data[0],user:req.user,entity:entityName});
    });
});


router.get('/update/:_id',ensureAuthenticated, function(req, res, next) {
  var id = req.params._id;
  Guideline.findById(id).then(data=>{
      res.render('update',{layout: 'layoutDashboard.handlebars',user:req.user,data:data, entity:entityName});
  })
});

router.get('/delete/:_id',function(req, res, next) {
  Guideline.delete(req.params._id).then(data=>{
    res.redirect(entityName.url+"listing");
  })

});

router.post('/update',function(req,res){

  var name = req.body.name;
  var id = req.body.id;
//  console.log("id: "+ id);
  Guideline.update({name:name}, id).then(data=>{
    req.flash('success_msg',' departure has been modified successfully');
    res.redirect("listing");
  })
});

router.post('/add', function(req, res, next) {
//  if(req.user.roleId){
    var name = req.body.name;
  	var newGuideline = {
      name: name
    };
    Guideline.create(newGuideline).then(data=>{

    })
    res.redirect("add");

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
