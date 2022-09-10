import { mongo } from "../mongo/mongo.js";
import { registerSchema, loginSchema } from "../validation schema/schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const helper = {
  async login(req, res) {
    let { email, password } = req.body;
    const { value, error } = loginSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .send({ value: value, Error: error.details[0].message });
    const userDB =
      (await mongo.users.findOne({ email: email })) ??
      (await mongo.users.findOne({ username: email }));
    if (!userDB)
      return res.status(401).send({ message: "Invalid Credentials" });

    const isPasswordMatch = await bcrypt.compare(password, userDB.password);
    if (isPasswordMatch) {
      //creating a token for successful login
      const token = jwt.sign({ id: userDB._id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      //sending token
      res
        .status(200)
        .send({ message: "Login Completed Successfully", token: token });
    } else return res.status(401).send({ message: "Invalid Credentials" });
  },

  
  async register(req, res) {
    // validating using JOI schema
    try {
      let { username, email, password } = req.body;
      const { value, error } = registerSchema.validate(req.body);
      const createdAt = new Date();
      if (error)
        return res
          .status(400)
          .send({ value: value, Error: error.details[0].message });

      const usernameDB = await mongo.users.findOne({ username: username });
      const useremailDB = await mongo.users.findOne({ email: email });
      //checking if username or useremail exists in db
      if (usernameDB || useremailDB)
        return res.status(400).send({ Error: "Username/Email already exists" });
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      const createUser = await mongo.users.insertOne({
        username,
        email,
        password,
        createdAt,
      });
      console.log(createUser);
      res.status(201).send({ confirmation: "User Registration Successful" });
    } catch (err) {
      console.log("Error in registering", err);
      res.status(400).send({ Error: "Username/Email already exists" });
    }
  },
};
export { helper };
