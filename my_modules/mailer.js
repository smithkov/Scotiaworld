require("dotenv").config();
const nodemailer = require("nodemailer");
const altMailID = "info@scotstudy.co.uk";
const mailID = "no-reply@scotstudy.co.uk";

module.exports.sender = function() {
  return mailID;
};
module.exports.altSender = function() {
  return altMailID;
};
module.exports.applicationSubject = function() {
  return "APPLICATION STATUS";
};

module.exports.messageSubject = function(username) {
  return `MESSAGE FROM ${username} OF SCOTSTUDY`;
};
module.exports.sender = function(username) {
  return;
};

module.exports.messageForAppStatus = function(recipient) {
  return `Hi ${recipient}, <br/> You have a new notification regarding your application with Scotstudy. kindly login for the latest update`;
};

module.exports.messageForAppSubmission = function(recipient, status) {
  return `Hi ${recipient}, <br/> Thank you for submitting your application, we will get back to you shortly.`;
};

module.exports.send = function(recipient, subject, message) {
  let mailOptions = {
    from: mailID,
    sender: "Message from Scotstudy",
    to: recipient,
    subject: subject,
    html: message
  };

  let transporter = nodemailer.createTransport({
    host: `mail.scotstudy.co.uk`,
    port: 465,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: `${mailID}`,
      pass: process.env.password
    }
  });
  transporter.sendMail(mailOptions, (error, info) => {
    if (error)
      return console.log(
        `--------------------------------------------${error}`
      );
    else
      return console.log(
        `--------------------------------------------sent mail successfully`
      );
  });
};
