import { mongo } from "../mongo/mongo.js";
import bcrypt from "bcrypt";
import randomstring from "randomstring";
import { sendMail } from "../mongo/sendMail.js";
import { ObjectId } from "mongodb";

export const helper = {
  async sendToken(req, res) {
    const { email } = req.body;
    let userDB = await mongo.users.findOne({ email: email });
    if (!userDB)
      return res.status(400).send({ message: "Invalid User email provided" });
    //creating random string and bcrypt to hash the token
    let token = randomstring.generate({
      length: 32,
      charset: "alphanumeric",
    });

    //creating expiry after 1 hour
    let expiry = new Date(Date.now() + 3600 * 1000);
    //updating users collection with resetToken and resetExpiry Time
    const resetUpdateDB = await mongo.users.findOneAndUpdate(
      { email: email },
      {
        $set: {
          resetToken: token,
          resetExpiry: expiry,
        },
      },
      { returnNewDocument: true }
    );

    let link = `https://reset-password-client-chakri.netlify.app/resetPassword/${userDB._id}/${token}`;
    // let link = `http://localhost:3000/resetPassword/${userDB._id}/${token}`;

    await sendMail(userDB.email, "Password Reset App - Reset your password", `<p>Hello! ${email}, You have requested to reset your password.</p>
    <p>Please click the following link to reset your password: ${link}`);
    res.status(200).send({
      message: "Reset link sent to mail",
    });
  },

  async verifyAndUpdatePassword(req, res) {
    const { userid, token } = req.params;
    let userDB = await mongo.users.findOne({ _id: ObjectId(userid) });
    //checking user is in db or not
    if (!userDB)
      return res.status(400).send({ Error: "Invalid Link or Expired" });
    //checking token is present in db is the token sent by the user or not
    const isTokenValid = userDB.resetToken === token;
    //checking if the time limit to change the password has the expired
    const isntExpired = userDB.resetExpiry > Date.now();
    console.log(isTokenValid, isntExpired);
    if (isTokenValid && isntExpired) {
      const { password } = req.body;
      const hashedNewPassword = await bcrypt.hash(password, Number(10));
      //deleting the token and expiry time after updating password
      const updatePasswordDB = await mongo.users.findOneAndUpdate(
        { _id: ObjectId(userid) },
        {
          $set: { password: hashedNewPassword },
          $unset: {
            resetExpiry: 1,
            resetToken: 1,
          },
        },
        { returnNewDocument: true }
      );

      res.status(200).send({ success: "password updated successfully" });
    } else res.status(400).send({ Error: "Invalid Link or Expired" });
  },
};
