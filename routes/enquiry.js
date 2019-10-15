var express = require("express");
var router = express.Router();
var multer = require("multer");
var FacultyImage = require("../models/feerange");
var StudyArea = require("../models/studyArea");
var config = require("../my_modules/config");
var Query = require("../queries/query");
var nodeMailer = require("nodemailer");

const entityName = {
  name: "Fee Range",
  entity: "facultyImage",
  url: "/feeRange/"
};

router.post("/add", function(req, res) {
  let name = req.body.name;
  let phone = req.body.phone;
  let email = req.body.email;
  let address = req.body.address;
  let message = req.body.message;

  let transporter = nodeMailer.createTransport({
    host: "mail.thescotiaworld.co.uk",
    port: 465,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: "info@thescotiaworld.co.uk",
      pass: "D^cu6)!T5,xT"
    }
  });
  let mailOptions = {
    from: `"${name}" <${email}>`, // sender address
    to: "info@thescotiaworld.co.uk", // list of receivers
    subject: `Personal Advice Request From ${name}`, // Subject line
    text: req.body.body, // plain text body
    html: `<h3>Personal Advice Form</h3>
            <p>${message}</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
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
});

module.exports = router;
