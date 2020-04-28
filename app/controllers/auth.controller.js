const { create, checkDuplicateUserOrEmail, verifyUser} = require("../controllers/user.controller.js");

module.exports = {
  signup: create,
  signin: verifyUser,
  checkDuplicateUserOrEmail
}