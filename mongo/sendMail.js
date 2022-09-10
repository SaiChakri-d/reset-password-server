import nodemailer from "nodemailer";
export const sendMail = async (email, subject, text) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.RESET_MAILID,
      pass: process.env.RESET_MAILPASS,
    },
  });

  var mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log("Error in sending mail", error);
    else console.log("Email sent:" + info.response);
  });
};
