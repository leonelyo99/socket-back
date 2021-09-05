const User = require("../models/user");

exports.getUsers = (req, res, next) => {
  User.find({ status: "active" })
    .then((users) => {
      res.status(200).json({
        ok: true,
        users,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
