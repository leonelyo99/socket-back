const jwt = require("jsonwebtoken");
const Room = require("../models/room");
const User = require("../models/user");

exports.incomingMessage = async (data) => {
  if (!data.message || !data.user || !data.room) {
    return {
      error: true,
    };
  }

  const tokenData = await verifyToken(data.user.token);
  if (tokenData.error) {
    return {
      error: true,
    };
  }

  const message = {
    data: data.message,
    date: new Date().getTime(),
    user: tokenData.id,
  };
  return await Room.findById(data.room)
    .then((room) => {
      if (!room) {
        return {
          error: true,
        };
      } else {
        room.messages.push(message);
        return room.save();
      }
    })
    .then((result) => {
      usersToNotify = result.users[0].filter((data) => data.id !== tokenData.id);
      return {
        data: {
          error: false,
          message,
        },
        usersToNotify,
        user: tokenData.id
      };
    });
};

const verifyToken = async (token) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret");
  } catch (err) {
    err.statusCode = 500;
    return {
      id: null,
      error: true,
      message: "Token error",
    };
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    return {
      id: null,
      error: true,
      message: "Token error",
    };
  } else {
    return await User.findOne({ id: decodedToken.userId }).then((user) => {
      if (!user) {
        return {
          id: null,
          error: true,
          message: "User not found",
        };
      } else {
        return {
          id: decodedToken.userId,
          error: false,
          message: null,
        };
      }
    });
  }
};
