const nodemailer = require("nodemailer");
const User = require("../Models/UserModel");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const GMAIL = process.env.GMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL,
    pass: APP_PASSWORD,
  },
});

const sendVerificationEmail = async (name, email, userId) => {
  const verificationToken = Math.random().toString(36).substr(2);
  let mailOptions = {
    from: "marim.khaled99@gmail.com",
    to: email,
    subject: "Threads and Beads Email Verification",
    html: `<p>Hi ${name},</p><p>Please click the following link to verify your email:</p><a href="https://example.com/verify?token=${verificationToken}">https://example.com/verify?token=${verificationToken}</a>`,
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
