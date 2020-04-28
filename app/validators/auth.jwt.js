const jwt = require("jsonwebtoken");
const status = require("http-status");
const { isAdmin } = require("../controllers/user.controller.js");

const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(status.FORBIDDEN).send({
      message: status[status.FORBIDDEN]
    });
  }

  jwt.verify(token, process.env.AUTH_KEY, (e, decoded) => {
    if (e) {
      return res.status(status.UNAUTHORIZED).send({
        message: e.message
      });
    }
    req.user_id = decoded.id;
    next();
  });
};

module.exports = {
  verifyToken,
  isAdmin,
}
