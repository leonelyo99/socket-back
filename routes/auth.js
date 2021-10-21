const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");
const { errorsDictionary } = require("../helpers/errors");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage(errorsDictionary.auth_email_error)
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(errorsDictionary.auth_duplicate_email_error);
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }).withMessage(errorsDictionary.auth_password_error),
    body("username").trim().not().isEmpty().withMessage(errorsDictionary.auth_password_error),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("username").trim().not().isEmpty().withMessage(errorsDictionary.auth_username_error),
    body("password").trim().isLength({ min: 3 }).not().isEmpty().withMessage(errorsDictionary.auth_password_error),
  ],
  authController.login
);

module.exports = router;
