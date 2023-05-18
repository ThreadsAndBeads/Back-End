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
  const mailOptions = {
    from: "Threads-and-Beads@gmail.com",
    to: email,
    subject: `${name}, please verify your email for Threads and Beads`,
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for creating an account with Threads and Beads! To get started, please click the following link to verify your email:</p>
      <a href="http://localhost:7000/api/v1/users/verify?token=${verificationToken}" style="text-decoration:none; color:#008CBA; font-weight:bold;">Verify your email</a>
      <p>Once you've verified your email, you'll be able to access your account and start shopping at Threads and Beads.</p>
      <br>
      <p>If you have any questions or concerns, please don't hesitate to contact us at:</p>
      <p>Threads and Beads Customer Support</p>
      <p>Email: support@threadsandbeads.com</p>
    `,
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

// module.exports = {
//   sendVerificationEmail,
// };
module.exports = sendVerificationEmail;
