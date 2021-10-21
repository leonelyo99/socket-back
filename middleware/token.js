const jwt = require("jsonwebtoken");
const { errorsDictionary } = require("../helpers/errors");
const newToken = require("../helpers/token");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error(errorsDictionary.middleware_invalid_token_error);
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SEED_TOKEN);
  } catch (err) {
    const error = new Error(errorsDictionary.middleware_invalid_token_error);
    error.statusCode = 401;
    throw error;
  }
  if (!decodedToken) {
    const error = new Error(errorsDictionary.middleware_invalid_token_error);
    error.statusCode = 401;
    throw error;
  } else {
    const token = newToken(decodedToken.username, decodedToken.userId);
    res.setHeader("X-Token", token);
    req.userId = decodedToken.userId;
    next();
  }
};
