const users = require("../controllers/user.controller.js");
const { verifyToken, isAdmin } = require("../validators/auth.jwt.js");
const { userValidationRules, validate } = require("../validators/user.validator.js");
const router = require("express").Router();

module.exports = app => {

  // Create
  router.post("/", 
    userValidationRules(), 
    validate, 
    users.create);

  // Retrieve all or filter by string query
  router.get("/", 
    verifyToken, 
    isAdmin, 
    users.findAll);

  // Retrieve with id
  router.get("/:user_id", 
    verifyToken,  
    users.findOne);

  // Update with id
  router.put("/:user_id", 
    verifyToken,
    userValidationRules(), 
    validate, 
    users.update);

  // Delete with id
  router.delete("/:user_id", 
    verifyToken, 
    isAdmin, 
    users.deleteOne);

  // Delete all
  router.delete("/", 
    verifyToken, 
    isAdmin,
    users.deleteAll);

  app.use("/api/users", router);
};
