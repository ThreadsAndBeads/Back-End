const nodemailer = require("nodemailer");
const User = require("../Models/UserModel");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.APP_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3",
  },
});

const sendVerificationEmail = async (name, email, userId) => {
  try {
    const verificationToken = Math.random().toString(36).substr(2);
    const mailOptions = {
      from: "Threads-and-Beads@gmail.com",
      to: email,
      subject: `${name}, please verify your email for Threads and Beads`,
      html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; box-sizing: border-box; background-color: #fff; border-radius: 5px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
      <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 20px; font-family=Delicious Handrawn ">Welcome to Threads and Beads, ${name}!</h1>
      <p style="margin-bottom: 16px;">Thank you for creating an account with us. To get started, please click the following link to verify your email:</p>
      <p style="margin-bottom: 16px;"><a href="http://localhost:7000/api/v1/users/verify?token=${verificationToken}" style="text-decoration:none; color:#008CBA; font-weight:bold;">Verify your email</a></p>
      <p style="margin-bottom: 16px;">Once you've verified your email, you'll be able to access your account and start shopping at Threads and Beads.</p>
      <p style="margin-bottom: 16px;">If you have any questions or concerns, please don't hesitate to contact us at:</p>
      <h2 style="margin-bottom: 16px;">Threads and Beads Customer Support</h2>
      <p style="margin-bottom: 16px;">Email: <a href="mailto:support@threadsandbeads.com" style="text-decoration:none; color:#008CBA; font-weight:bold;">support@threadsandbeads.com</a></p>
    </div>
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
  } catch (error) {
    throw new Error("Failed to send verification email");
  }
};

// module.exports = {
//   sendVerificationEmail,
// };
module.exports = sendVerificationEmail;
