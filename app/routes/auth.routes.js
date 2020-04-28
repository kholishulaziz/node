const { signin, signup, checkDuplicateUserOrEmail} = require("../controllers/auth.controller");
const { userValidationRules, validate } = require("../validators/user.validator.js");
const router = require("express").Router();

module.exports = app => {

  router.post("/signup", 
    userValidationRules(), 
    validate, 
    checkDuplicateUserOrEmail, 
    signup);

  router.post("/signin", signin);

  app.use("/api/auth", router);

};
