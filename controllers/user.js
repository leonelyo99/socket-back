const { errorsDictionary } = require("../helpers/errors");
const Room = require("../models/room");
const User = require("../models/user");

exports.getUsers = (req, res, next) => {
  User.find({ status: "active" }, "username")
    .then((data) => {
      res.status(200).json({
        error: false,
        data,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUserMessages = (req, res, next) => {
  Room.find({
    users: req.body.users.sort(function (a, b) {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    }),
  }).exec((err, rooms) => {
    if (err) {
      const error = new Error(errorsDictionary.user_room_found_error);
      error.statusCode = 404;
      throw error;
    }

    if (!rooms.length) {
      const room = new Room({ users: [req.body.users], messages: [] });
      room.save().then((result) => {
        return res.status(200).json({
          error: true,
          data: {
            room: result._id,
            messages: [],
          },
        });
      });
    } else {
      res.status(200).json({
        error: false,
        data: {
          room: rooms[0]._id,
          messages: rooms[0].messages,
        },
      });
    }
  });
};
