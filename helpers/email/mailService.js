const nodemailer = require("nodemailer");
const { emailTemp } = require("./emailTemp");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailSender = async ({ to, name, otp, purpose, expiresInMinutes }) => {
  const { subject, text, html } = emailTemp({
    name,
    otp,
    purpose,
    expiresInMinutes,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
};

module.exports = { mailSender };
