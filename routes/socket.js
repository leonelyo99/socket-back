const { incomingMessage } = require("../controllers/socket");

exports.connectSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT"],
    },
  });

  console.log("listening ", process.env.PORT);

  io.sockets.on("connection", function (socket) {
    console.log("connection to the socket");

    /**
     * Listen to the messages sent by the front
     */
    socket.on("new-message", (data, callback) => {
      incomingMessage(data).then((resp) => {
        if (!resp.error) {
          /**
           * io
           * emit the message and the event has the id of the room
           */
          io.emit(`message-${data.room}`, resp.data);
          resp.usersToNotify.forEach((user) => {
            /**
             * io
             * Send notifications to all users who need to be notified
             */
            io.emit(`notification-${user.id}`, {
              error: false,
              data: resp.user,
            });
          });
        } else {
          /**
           * socket
           * Send the error to the user who is connected to the socket
           */
          socket.emit(`error`, resp);
        }
      });
    });
  });
};
