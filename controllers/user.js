const Room = require("../models/room");
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
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    
    if (!rooms.length) {
      const room = new Room({ users: [req.body.users], messages: [] });
      room.save().then((result) => {
        return res.status(200).json({
          ok: true,
          room: result._id,
          messages: [],
        });
      });
    } else {
      return res.status(200).json({
        ok: true,
        room: rooms[0]._id,
        messages: rooms[0].messages,
      });
    }
  });
};
