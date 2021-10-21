const jwt = require("jsonwebtoken");
const { errorsDictionary } = require("../helpers/errors");
const Room = require("../models/room");
const User = require("../models/user");

exports.incomingMessage = async (data) => {
  if (!data.message || !data.user || !data.room) {
    return {
      error: true,
      data: {
        message: errorsDictionary.socket_user_password_error,
        status: 422,
      }
    };
  }

  const tokenData = await verifyToken(data.user.token);
  if (tokenData.error) {
    return {
      error: true,
      data: {
        message: errorsDictionary.socket_invalid_token_error,
        status: 401,
      },
    };
  } else {
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
            data: {
              message: errorsDictionary.socket_room_found_error,
              status: 404,
            }
          };
        } else {
          room.messages.push(message);
          return room.save();
        }
      })
      .then((result) => {
        usersToNotify = result.users[0].filter(
          (data) => data.id !== tokenData.id
        );
        return {
          error: false,
          data: {
            error: false,
            data: { ...message },
          },
          usersToNotify,
          user: tokenData.id,
        };
      });
  }
};

const verifyToken = async (token) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SEED_TOKEN);
  } catch (err) {
    return {
      id: null,
      error: true,
    };
  }
  if (!decodedToken) {
    return {
      id: null,
      error: true,
    };
  } else {
    return await User.findOne({ id: decodedToken.userId }).then((user) => {
      if (!user) {
        return {
          id: null,
          error: true,
        };
      } else {
        return {
          id: decodedToken.userId,
          error: false,
        };
      }
    });
  }
};
