import nodemailer from "nodemailer";
export const sendMail = async (email, subject, text) => {
  var transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true, //ssl
    auth: {
      user: process.env.RESET_MAILID,
      pass: process.env.RESET_MAILPASS,
    },
  });

  var mailOptions = {
    from: process.env.RESET_MAILID,
    to: email,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log("Error in sending mail", error);
    else console.log("Email sent:" + info.response);
  });
};
