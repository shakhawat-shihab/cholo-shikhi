let nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  // service: "gmail",
  auth: {
    user: process.env.MAIL_TRAP_USER,
    pass: process.env.MAIL_TRAP_PASSWORD,
    // user: process.env.GMAIL_USER,
    // pass: process.env.GMAIL_PASSWORD,
  },
});
module.exports = transport;
