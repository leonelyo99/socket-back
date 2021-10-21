const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const newToken = require("../helpers/token");

const { errorsDictionary } = require("../helpers/errors");
const User = require("../models/user");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg || errorsDictionary.auth_missing_fields_error);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        email: email,
        password: hashedPw,
        username,
      });
      return user.save();
    })
    .then((result) => {
      const token = newToken(username, result._id.toString());

      res.status(201).json({
        error: false,
        data: { username, _id: result._id, token },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg || errorsDictionary.auth_missing_fields_error);
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const username = req.body.username;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        const error = new Error(errorsDictionary.auth_user_password_error);
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error(errorsDictionary.auth_user_password_error);
        error.statusCode = 401;
        throw error;
      }

      const token = newToken(loadedUser.username, loadedUser._id.toString());

      res.status(200).json({
        error: false,
        data: {
          username: loadedUser.username,
          token,
          _id: loadedUser._id.toString(),
        },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
