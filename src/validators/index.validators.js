import { body } from "express-validator";
import { availableUserRole } from "../utils/constant.js";
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
const loginUserValidation = () => {
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

const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
  ];
};

const addMemberProjectValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is not valid"),
    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(availableUserRole)
      .withMessage("Role is invalid"),
  ];
};

const createTaskValidator=() => {
  return [
    body("title").notEmpty().withMessage("Title is required").bail().trim(),
    body("description").optional(),
    body("status").notEmpty().withMessage("Status is required")
  ]
}
const createSubTaskValidtor=() => {
  return [
    body("title").notEmpty().withMessage("Title is required").bail().trim(),
  ]
}
export {
  registerUserValidator,
  loginUserValidation,
  createProjectValidator,
  addMemberProjectValidator,
  createTaskValidator,
createSubTaskValidtor
};
