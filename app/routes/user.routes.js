const users = require("../controllers/user.controller.js");
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
    users.findAll);

  // Retrieve with id
  router.get("/:user_id", 
    users.findOne);

  // Update with id
  router.put("/:user_id", 
    userValidationRules(), 
    validate, 
    users.update);

  // Delete with id
  router.delete("/:user_id",  
    users.deleteOne);

  // Delete all
  router.delete("/", 
    users.deleteAll);

  app.use("/api/users", router);
};
