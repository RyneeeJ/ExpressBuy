const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: "Ryne Gandia <imrynegandia@gmail.com>",
    to: options.recipient,
    subject: options.subject,
    text: options.message,
    html: options.html,
  });
};

module.exports = sendEmail;
