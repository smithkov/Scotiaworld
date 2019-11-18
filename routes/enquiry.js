var express = require("express");
var router = express.Router();
var multer = require("multer");
var FacultyImage = require("../models/feerange");
var StudyArea = require("../models/studyArea");
var config = require("../my_modules/config");
var mailer = require("../my_modules/mailer");
var Query = require("../queries/query");

const entityName = {
  name: "Fee Range",
  entity: "facultyImage",
  url: "/feeRange/"
};

router.post("/scholarshipAdd", function(req, res) {
  let name = req.body.name;
  let phone = req.body.phone;
  let email = req.body.email;
  let grade = req.body.grade;
  let address = req.body.address;
  let content = req.body.content;
  let obj = {
    name: name,
    phone: phone,
    email: email,
    address: address,
    grade: grade,
    content: content
  };
  let mailOptions = {
    from: `"${name}" <${email}>`, // sender address
    to: "info@thescotiaworld.co.uk", // list of receivers
    subject: `Scholarship request From ${name}`, // Subject line
    text: req.body.body, // plain text body
    html: `<h3>Scholarship Form</h3>
            <strong>Phone:</strong> ${phone}<br/>
            <strong>Address:</strong> ${address}<br/>
            <strong>Grade:</strong> ${grade}<br/>
            <p>${content}</p>`
  };
  mailer.send(mailOptions);
  Query.Scholarship.create(obj)
    .then(result => {
      return res.send({
        data: result,
        error: false
      });
    })
    .catch(err => {
      return res.send({
        data: err,
        error: true
      });
    });
});
router.post("/add", function(req, res) {
  let name = req.body.name;
  let phone = req.body.phone;
  let email = req.body.email;
  let address = req.body.address;
  let message = req.body.message;

  let mailOptions = {
    from: `"${name}" <${email}>`, // sender address
    to: "info@thescotiaworld.co.uk", // list of receivers
    subject: `Personal Advice Request From ${name}`, // Subject line
    text: req.body.body, // plain text body
    html: `<h3>Personal Advice Form</h3>
            <p>${message}</p>`
  };
  mailer.send(mailOptions);
  Query.Enquiry.create({
    name: name,
    phone: phone,
    email: email,
    address: address,
    message: message
  })
    .then(data => {
      return res.send({
        data: data,
        error: false
      });
    })
    .catch(err => {
      return res.send({
        data: null,
        error: true
      });
    });
});

module.exports = router;
