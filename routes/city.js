var express = require('express');
var router = express.Router();
var multer = require('multer');
var City = require('../models/city');
var config = require('../my_modules/config');
var Query = require('../queries/query')

const entityName = {name:"City", entity:"city",basic:true, url:"/city/",form:config.otherForms};



router.get('/add',ensureAuthenticated,function(req, res, next) {
    // if(req.user.roleId){
    //     res.render('add',{layout: 'layoutDashboard.handlebars',user: req.user,entity:entityName});
    // }
    // else{
    //   res.redirect("/login");
    // }
    res.render('add',{layout: 'layoutDashboard.handlebars',user:req.user,entity:entityName});
});

router.get('/listing',ensureAuthenticated,function(req, res, next) {
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
  Query.City.findAll().then(data=>{
    res.render('list',{layout: 'layoutDashboard.handlebars',user:req.user,data:data, entity:entityName});
  });
});

router.get('/update/:_id',ensureAuthenticated, function(req, res, next) {
  var id = req.params._id;
  Query.City.findById(id).then(data=>{
      res.render('update',{layout: 'layoutDashboard.handlebars',user:req.user,data:data, entity:entityName});
  })
});

router.get('/delete/:_id',function(req, res, next) {
  Query.City.delete(req.params._id).then(data=>{
    res.redirect(entityName.url+"listing");
  })

});

router.post('/update',function(req,res){

  var name = req.body.name;
  var id = req.body.id;
//  console.log("id: "+ id);
  Query.City.update({name:name}, id).then(data=>{
    req.flash('success_msg',name+ ' have been modified successfully');
    res.redirect("listing");
  })
});

router.post('/add', function(req, res, next) {
//  if(req.user.roleId){
    var name = req.body.name;
  	var newCity = {
      name: name
    };
    Query.City.create(newCity).then(data=>{

    })

    req.flash('success_msg', 'You have successfully added a new Study Area');
    res.redirect("listing");

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
