var express = require('express');
var router = express.Router();
var multer = require('multer');
var Logo =  require('../queries/query').Logo;
var Banner =  require('../queries/query').Banner;
var config = require('../my_modules/config');

const url = require('url');
const listUrl = "/siteImage/listing";



// To get more info about 'multer'.. you can go through https://www.npmjs.com/package/multer..
var storage = multer.diskStorage({
   destination: function(req, file, cb) {
     cb(null, 'public/uploads/')
   },
   filename: function(req, file, cb) {
     cb(null, file.originalname);
   }
});

var upload = multer({
   storage: storage
});



router.get('/add',ensureAuthenticated,function(req, res, next) {

  res.render('siteImage',{layout: 'layoutDashboard.handlebars',user:req.user});
});
router.post('/add',config.cpUploadHome,function(req, res, next) {

  var topLogo =req.files['topLogo']== undefined?undefined: req.files['topLogo'][0].filename;
  var bottomLogo = req.files['bottomLogo']== undefined?undefined: req.files['bottomLogo'][0].filename;
  var banners = req.files['banner'];
  var Logos = {
    topLogo:topLogo,
    bottomLogo: bottomLogo
  };

  var isFormValid = false;
  if(banners != undefined)
  {
    isFormValid =true;
    var array = [];
    for(var i=0; i< banners.length; i++ ){

     array.push({path:banners[i].filename })
    }
    Banner.createMany(array).then(banner=>{
      console.log("banner saved");
    })
    // Banner.saveBanners(array,(err,data)=>{
    //   if(err)
    //    console.log(err)
    //    else
    //    console.log(data)
    // });
  }
  if(topLogo != undefined || bottomLogo != undefined){
    isFormValid = true;
    console.log("Logo is defined");
    Logo.create(Logos).then(logo=>{

    })
    // Logos.save(function(err,data){
    //   if(err)
    //    console.log(err)
    //    else
    //    console.log(data)
    // })
  }
  res.render('siteImage', {error: isFormValid?null:'Please upload at least a banner or logo',
    success:isFormValid?'You have successfully added a new banner':null,
    layout: 'layoutDashboard.handlebars',user:req.user
  });
});

router.get('/listing',ensureAuthenticated, function(req, res, next) {
  if(req.user.roleId){
    Logo.findAll().then(logos=>{
        Banner.findAll().then(banners=>{
          res.render('siteImageList',{layout: 'layoutDashboard.handlebars',logos:logos,banners:banners,user:req.user});
         })
      })
    }
  else{
    res.redirect("/login");
  }
});

router.get('/deleteLogo/:_id',function(req, res, next) {
  Logo.findAll().then(logos=>{
    if(logos.length>1){
      let id = req.params._id;
      if (!id)
       throw new Error("This logo does not exist");

     Logo.delete(id).then(data=>{
       req.flash('success_msg', 'Logo was deleted successfully');
       res.redirect(listUrl);
       });
    }
    else{
      req.flash('error_msg', 'At least one logo must be left undeleted');
      res.redirect(listUrl);
    }
  })
});


router.get('/deleteBanner/:_id',function(req, res, next) {
  Banner.findAll().then(banners=>{
    if(banners.length > 1){
      let id = req.params._id;
      if (!id)
       throw new Error("This banner does not exist");

       Banner.delete(id).then(data=>{
         req.flash('success_msg', 'Banner was deleted successfully');
         res.redirect(listUrl);
       });
    }
    else{
      req.flash('error_msg', 'At least one banner must be left undeleted');
      res.redirect(listUrl);
    }
  })

});


router.get('/toggleBanner/:_id',function(req, res, next) {
  let id = req.params._id;
  if (!id)
   throw new Error("This banner does not exist");
 Banner.findById(id).then(data=>{
   if(data){
     var isActive = data.isActive?false:true;
     Banner.update({isActive:isActive},id).then(data=>{
       req.flash('success_msg', 'Banner updated successfully');
     });
   }
   res.redirect(listUrl);
 })
});

router.get('/toggleLogo/:_id',function(req, res, next) {
  var id = req.params._id;
  if (!id)
   throw new Error("This banner does not exist");
 Logo.findById(id).then(data=>{
   if(data){
     var isActive = data.isActive?false:true;
     Logo.update({isActive:isActive},id).then(data=>{
      req.flash('success_msg', 'Logo updated successfully');
     });
   }

   res.redirect(listUrl);
 })
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
