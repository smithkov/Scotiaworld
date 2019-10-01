
var express = require('express');
var router = express.Router();
var multer = require('multer');
var Institution = require('../models/institution');
var Country = require('../models/country');
var City = require('../models/city');
Query = require('../queries/query');
var InstitutionType = require('../models/institutionType');
var config = require('../my_modules/config');
const entityName = {name:"Institution", entity:"institution",institution:true, url:"/institution/",form:config.institution};


// To get more info about 'multer'.. you can go through https://www.npmjs.com/package/multer..
// var storage = multer.diskStorage({
//    destination: function(req, file, cb) {
//      cb(null, 'public/uploads/')
//    },
//    filename: function(req, file, cb) {
//      cb(null, file.originalname);
//    }
// });
//
// var upload = multer({
//    storage: storage
// });
 //var cpUpload = upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'banner', maxCount: 8 }])
router.get('/add',ensureAuthenticated, function(req, res, next) {
    //if(req.user.roleId){
    Query.City.findAll().then(city=>{
       res.render('add',{layout: 'layoutDashboard.handlebars',user:req.user,entity:entityName, city:city});
    })
});

router.get('/listing',ensureAuthenticated,function(req, res, next) {
//  if(req.user.roleId){
    Query.Institution.findAll().then(data=>{
      console.log(data)
       res.render('list',{layout: 'layoutDashboard.handlebars',user:req.user,data:data,entity:entityName});
    })
  // }
  // else{
  //   res.redirect("/login");
  // }
});

router.get('/update/:_id',ensureAuthenticated,function(req, res, next) {
  let id = req.params._id;
  Query.Institution.findById(id).then(institution=>{
    Query.City.findAll().then(city=>{
       res.render('update',{layout: 'layoutDashboard.handlebars',user:req.user,data:institution,entity:entityName, city:city});
    })
  })
});

router.get('/delete/:_id',function(req, res, next) {
  let id = req.params._id;
  Query.Institution.delete(id).then(data=>{
    res.redirect(entityName.url+"listing");
  });
});

router.get('/institutions', function(req, res) {
     Query.Institution.getAll().then(data=> {
       res.status(200).send({data: data});
    });
});
router.post('/update',config.cpUpload3,function(req,res){

  var name = req.body.name;
  var id = req.body.id;
  var about = req.body.about;
  var city = req.body.city;
  var oldLogoImg = req.body.oldLogoImg;
  var oldBannerImg = req.body.oldBannerImg;
  var newLogoImg = req.files['logo'] === undefined?oldLogoImg:req.files['logo'][0].filename;
  var newBannerImg = req.files['banner'] === undefined?oldBannerImg:req.files['banner'][0].filename;
  var logo = newLogoImg=== ""?oldLogoImg:newLogoImg;
  var banner = newBannerImg=== ""?oldBannerImg:newBannerImg;

  let newInstitution ={
    _id:id,
    name : name,
    about:about,
    cityId:city,
    path:logo,
    banner:banner
  };
//  console.log("id: "+ id);

  Query.Institution.update(newInstitution,id).then(image=>{
    res.redirect(entityName.url+"listing");
  })
});

router.post('/add', config.cpUpload3,function(req, res, next) {
  //if(req.user.roleId){

    var name = req.body.name;
    var id = req.body.id;
    var about = req.body.about;
    var city = req.body.city;
    console.log("This is logos : "+req.body.city)
    var logo = req.files['logo'] === undefined?"":req.files['logo'][0].filename;
    var banner = req.files['banner'] === undefined?"":req.files['banner'][0].filename;

    let newInstitution = {
      _id:id,
      name : name,
      about:about,
      cityId:city,
      path:logo,
      banner:banner
    };
    Query.Institution.create(newInstitution).then(data=> {
      req.flash('success_msg', 'You have successfully added a Institution');
      res.redirect(entityName.url+"listing");
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
