require("./config/config");
const express = require("express");
const mongoose = require("mongoose");
const { connectSocket } = require("./routes/socket");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Expose-Headers", "X-Token");
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ error: true, message, data });
});

mongoose
  .connect(process.env.URLDB)
  .then((result) => {
    const server = app.listen(process.env.PORT);
    connectSocket(server);
  })
  .catch((err) => console.log(err));
