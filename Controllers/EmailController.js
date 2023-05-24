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
    from: "Threads-and-Beads@gmail.com",
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


const sendWorkshopEmail = async (req, res, next) => { 
  const { name, email } = req.body;
  const emailContent = `
    <p>Hi ${name},</p>
    <p>Thank you for booking a workshop with Threads and Beads!</p>
    <p>This email is to confirm your workshop reservation.</p>
    <p>We look forward to seeing you at the workshop. Should you have any questions or need further assistance, please don't hesitate to contact us.</p>
    <p>Best regards,</p>
    <p>The Threads and Beads Team</p>
  `;
  let mailOptions = {
    from: "Threads-and-Beads@gmail.com",
    to: email,
    subject: "Threads and Beads Workshops",
    html: emailContent,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to send email" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Email sent successfully" });
    }
  });
}
module.exports = {
  sendVerificationEmail,
  sendWorkshopEmail,
};
