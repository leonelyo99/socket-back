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
    //emito mensaje al cliente
    socket.emit("message", { message: "Buenas" });
    setTimeout(function(){ 
      socket.emit("message", { message: "Soy otro mensaje" });
    }, 1500);
    setTimeout(function(){ 
      socket.emit("message", { message: "Soy otro mensaje 2" });
    }, 3000);
  });
};
