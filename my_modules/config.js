const url = "http://localhost:3000/";
const NodeCache = require("node-cache");
const cacheData = new NodeCache();
var multer = require("multer");
module.exports.url = url;
var Banner = require("../models/banner");
var Institution = require("../models/institution");
module.exports.login = "/login";
module.exports.loginRedirect = "/user/login";
var h2p = require("html2plaintext");
module.exports.otherForms = function() {
  return [
    { name: "name", display: "Name", type: "text", visible: true, value: "" },
    {
      name: "_id",
      display: "Hidden",
      type: "hidden",
      visible: false,
      value: ""
    }
  ];
};

module.exports.institution = function() {
  return [
    {
      name: "name",
      display: "Name",
      type: "text",
      visible: true,
      dropdown: false
    },
    {
      name: "about",
      display: "About",
      type: "textarea",
      visible: true,
      dropdown: false,
      textarea: true
    },
    {
      name: "_id",
      display: "Hidden",
      type: "hidden",
      visible: false,
      dropdown: false
    },
    {
      name: "country",
      isCountry: true,
      display: "Country",
      type: "select",
      visible: true,
      dropdown: true
    },
    {
      name: "type",
      isType: true,
      display: "Institution Type",
      type: "select",
      visible: true,
      dropdown: true
    },
    {
      name: "city",
      isCity: true,
      display: "City",
      type: "select",
      visible: true,
      dropdown: true
    }
  ];
};

var photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/photos");
  },
  filename: (req, file, cb) => {
    var filetype = "";
    if (file.mimetype === "image/gif") {
      filetype = "gif";
    }
    if (file.mimetype === "image/png") {
      filetype = "png";
    }
    if (file.mimetype === "image/jpeg") {
      filetype = "jpg";
    }
    cb(null, "photo-" + Date.now() + "." + filetype);
  }
});

// To get more info about 'multer'.. you can go through https://www.npmjs.com/package/multer..
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});
var storage2 = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/credentials/");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

var upload = multer({
  storage: storage
});
var photo = multer({
  storage: photoStorage
});
var upload2 = multer({
  storage: storage2
});
module.exports.cpUpload2 = upload2.fields([
  { name: "credential", maxCount: 1 }
]);
module.exports.convertText = function(htmlText) {
  let text = h2p(htmlText);
  return text;
};
module.exports.cacheData = function(key, val) {
  cacheData.set(key, val, 5000);
};
module.exports.getCacheData2 = key => {
  return cacheData.get(key);
};
var getCacheData = (module.exports.getCacheData = function(key) {
  if (cacheData.get(key)) {
    console.log("this has been cached before" + key);
    return cacheData.get(key);
  } else {
    console.log(key + " this has not  been cached before");
    return false;
  }
});
var storageAny = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  }
});
var uploadAny = multer({
  storage: storageAny
});

module.exports.photoChooser = function(photo) {
  console.log(photo);
  console.log("--------------------------------------");
  return photo === "" ? "no_photo.jpg" : photo;
};
module.exports.uploadAny = uploadAny;
module.exports.photo = photo;
module.exports.cpUpload = upload.fields([{ name: "logo", maxCount: 1 }]);
module.exports.cpUpload3 = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "banner", maxCount: 8 }
]);
module.exports.cpUploadHome = upload.fields([
  { name: "topLogo", maxCount: 1 },
  { name: "bottomLogo", maxCount: 1 },
  { name: "banner", maxCount: 8 }
]);
