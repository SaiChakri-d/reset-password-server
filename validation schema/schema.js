import joi from "joi";

const registerSchema = joi.object({
  username: joi.string().alphanum().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(
      new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/)
    )
    .required(),
});

const loginSchema = joi.object({
  email: joi.string().required(),
  password: joi
    .string()
    .pattern(
      new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/)
    )
    .required(),
});

export { registerSchema, loginSchema };
