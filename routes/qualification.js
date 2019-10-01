var express = require('express');
var router = express.Router();
var multer = require('multer');
var Qualification = Query = require('../queries/query').Qualification;

const url = require('url');
const entityName = "qualification"

router.get('/add', ensureAuthenticated,function(req, res, next) {
    if(req.user.roleId){
        res.render('add',{layout: 'layoutDashboard.handlebars',user: req.user,entity:entityName});
    }
    else{
      res.redirect("/login");
    }
});

router.get('/listing',ensureAuthenticated, function(req, res, next) {
  if(req.user.roleId){
    Qualification.findAll().then(data=>{
       res.render('list',{layout: 'layoutDashboard.handlebars',data:data,user:req.user,entity:entityName});
    })
  }
  else{
    res.redirect("/login");
  }
});

router.get('/update/:_id',ensureAuthenticated, function(req, res, next) {
  Qualification.findById(req.params._id).then(data=>{
      res.render('update',{layout: 'layoutDashboard.handlebars',data:data,user:req.user,entity:entityName});
    });
});

router.get('/delete/:_id',ensureAuthenticated, function(req, res, next) {
  let id = req.params._id;
  Qualification.delete(id).then(data=>{
      res.redirect('/listing');
    });
});

router.post('/update',ensureAuthenticated,function(req,res){

  var name = req.body.name;
  var id = req.body.id;
//  console.log("id: "+ id);

  Qualification.update({name:name,id:id},id).then(image=>{

    req.flash('success_msg',name+ ' have been modified successfully');
    res.redirect("/listing");
  })
});

router.post('/add', function(req, res, next) {
  if(req.user.roleId){
    var name = req.body.name;
    //req.checkBody('name', 'Name is required').notEmpty();
  	var newQualification = {
      name: name
    };

    Qualification.create(newQualification).then(data=> {
      if (err) throw err;
      req.flash('success_msg', 'You have successfully added a new Degree Type');
      res.redirect("/listing");
    });
  }
  else{
    res.redirect("/login")
  }


});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}

module.exports = router;
