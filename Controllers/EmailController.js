const nodemailer = require("nodemailer");
const User = require("../Models/UserModel");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });


let transporter = nodemailer.createTransport({
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

const sendVerificationEmail = async (name, email, userId) => {
  const verificationToken = Math.random().toString(36).substr(2);
  let mailOptions = {
    from: "marim.khaled99@gmail.com",
    to: email,
    subject: "Threads and Beads Email Verification",
    html: `<p>Hi ${name},</p><p>Please click the following link to verify your email:</p><a href="http://localhost:7000/api/v1/users/verify?token=${verificationToken}">http://localhost:7000/api/v1/users/verify?token=${verificationToken}</a>`,
  };
  const user = await User.findOneAndUpdate(
    { email: email },
    { verificationToken: verificationToken }
  );

  if (!user) {
    throw new Error("User not found");
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      throw new Error("Failed to send verification email");
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  sendVerificationEmail,
};
