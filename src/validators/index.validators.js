import { body } from "express-validator";

const registerUserValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Email is not Valid")
      .bail()
      .trim()
      .isLowercase()
      .withMessage("Email is in lowercase"),
    body("username").notEmpty().withMessage("Username is required").trim(),
    body("password")
      .notEmpty()
      .withMessage("Username is required")
      .bail()
      .isLength({ min: 6 })
      .withMessage("Password should be 6 character long"),
  ];
};
const loginUserValidation=() => {
 return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .bail()
      .isEmail()
      .withMessage("Email is not Valid")
      .bail()
      .trim()
      .isLowercase()
      .withMessage("Email is in lowercase"),
    body("username").notEmpty().withMessage("Username is required").trim(),
    body("password")
      .notEmpty()
      .withMessage("Username is required")
      .bail()
      .isLength({ min: 6 })
      .withMessage("Password should be 6 character long"),
  ];
}

export {registerUserValidator,loginUserValidation}