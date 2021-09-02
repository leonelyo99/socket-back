const express = require("express");
const mongoose = require("mongoose");
const { connectSocket } = require("./controllers/socket");

// const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const MONGODB_URI =
  "mongodb+srv://mern_user:yqgUWiCPZaaGExOs@cluster0.bpinj.mongodb.net/messages?retryWrites=true";

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// app.use("/feed", feedRoutes);
app.use("/api/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const server = app.listen(8080);
    connectSocket(server);
  })
  .catch((err) => console.log(err));
