const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secureConnection: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  //email options
  const mailOptions = {
    from: "Threads And Beads  <marim.khaled99@gmail.gom>",
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
