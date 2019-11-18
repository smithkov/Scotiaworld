const nodemailer = require("nodemailer"),
  EmailTemplate = require("email-templates").EmailTemplate,
  path = require("path"),
  Promise = require("bluebird");

let transporter = nodemailer.createTransport({
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

module.exports.send = function(mailOptions) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    } else return true;
  });
};

function loadTemplate(templateName, contexts) {
  var template = new EmailTemplate(
    path.join(__dirname, "/../templates", templateName)
  );
  return Promise.all(
    contexts.map(context => {
      return new Promise((resolve, reject) => {
        template.render(context, (err, result) => {
          if (err) reject(err);
          else resolve({ email: result, context });
        });
      });
    })
  );
}
// var users = [
//     {
//         name: 'Jack',
//         email: 'nnamdi4nwosu@gmail.com',
//         link:'www.links'
//     }
// ];
module.exports.sendMail = function(users) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport

  var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
      ciphers: "SSLv3"
    },
    auth: {
      user: "smithdegreat@hotmail.com", // generated ethereal user
      pass: "2000years@bc" // generated ethereal password
    }
  });

  // send mail with defined transport object
  loadTemplate("emailfiles", users).then(results => {
    return Promise.all(
      results.map(result => {
        transporter.sendMail({
          from: "Me :)", // sender address
          to: result.context.email, // list of receivers
          subject: result.email.subject, // Subject line
          text: result.email.text, // plain text body
          html: result.email.html // html body
        });
      })
    );
  });
};
