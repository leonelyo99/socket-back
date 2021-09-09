const jwt = require("jsonwebtoken");
const Room = require("../models/room");
const User = require("../models/user");

exports.incomingMessage = async (data) => {
  if (!data.message || !data.user || !data.room) {
    return {
      error: true,
      data: {
        message: "Error de validación, uno o mas campos no fueron encontrados.",
        status: 422,
      }
    };
  }

  const tokenData = await verifyToken(data.user.token);
  if (tokenData.error) {
    return {
      error: true,
      data: {
        message: "Token invalido",
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
              message: "Sala no encontrada",
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
    decodedToken = jwt.verify(token, "somesupersecretsecret");
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
