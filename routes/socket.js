const { incomingMessage } = require("../controllers/socket");

exports.connectSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT"],
    },
  });

  console.log("listening ",process.env.PORT);

  io.sockets.on("connection", function (socket) {
    console.log("connection to the socket");

    socket.on("new-message", (data, callback) => {
      incomingMessage(data).then((resp) => {
        if (!resp.error) {
          io.emit(`message-${data.room}`, resp.data);
          resp.usersToNotify.forEach((user) => {
            io.emit(`notification-${user.id}`, {
              error: false,
              data: resp.user,
            });
          });
        } else {
          socket.emit(`error`, resp);
        }
      });
    });
  });
};
