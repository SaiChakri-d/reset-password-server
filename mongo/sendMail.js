import nodemailer from "nodemailer";

export const sendMail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.in",
    port: 465,
    secure: true, //ssl
    auth: {
      user: process.env.RESET_MAILID,
      pass: process.env.RESET_MAILPASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  var mailOptions = {
    from: process.env.RESET_MAILID,
    to: email,
    subject: subject,
    text: text,
    html:`<p>Hello! ${email}, You have requested to reset your password.</p>
          <p>Please click the following link to reset your password.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log("Error in sending mail", error);
    else console.log("Email sent:" + info.response);
  });
};
