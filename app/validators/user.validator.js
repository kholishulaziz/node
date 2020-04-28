const { check, validationResult } = require("express-validator");
const status = require("http-status");

const userValidationRules = () => {
  return [
	  check("user_id",`required`).notEmpty(),
    check("user_id",`must be at least 5 chars long`).isLength({ min: 5 }),
    check("email",`required`).notEmpty(),
    check("email",`must be an email`).isEmail(),
    check("password",`required`).notEmpty(),
    check("password",`must be at least 5 chars long`).isLength({ min: 5 }),
    check("role",`required`).notEmpty(),
    check("role",`must be 'USER' or 'ADMIN'`).isIn(["USER","ADMIN"])
  ]
}

const validate = (req, res, next) => {
  let errors = validationResult(req)
  if (errors.isEmpty()) {
    return next();
  }
  let extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
  return res.status(status.UNPROCESSABLE_ENTITY).json({
    message: extractedErrors,
  });
}

module.exports = {
  userValidationRules,
  validate,
}
