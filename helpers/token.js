const jwt = require("jsonwebtoken");

module.exports = (username, id) =>
  jwt.sign(
    {
      username: username,
      userId: id,
    },
    process.env.SEED_TOKEN,
    { expiresIn: process.env.TOKEN_DURATION }
  );
