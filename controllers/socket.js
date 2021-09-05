exports.connectSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT"],
    },
  });

  console.log("listening 8080");

  io.sockets.on("connection", function (socket) {
    console.log("connection to the socket");
    
    socket.on("newMessage", (data, callback) => {
      socket.emit("message", { data });
    });
  });
};
