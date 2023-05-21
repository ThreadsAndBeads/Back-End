const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.APP_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  //email options
  const mailOptions = {
    from: "Threads-and-Beads@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,

    // html:
  };

  // send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
