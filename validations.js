const { check } = require("express-validator");

const idValidation = [check("id").isInt()];

const newUserValidation = [
  check("first_name").not().isEmpty().isAlpha(),
  check("last_name").not().isEmpty().isAlpha(),
  check("age").not().isEmpty().isInt(),
  check("active").not().isEmpty().isBoolean(),
];

const newOrderValidation = [
  check("price").not().isEmpty().isCurrency(),
  check("user_id").not().isEmpty().isInt(),
];

module.exports = {
  idValidation,
  newUserValidation,
  newOrderValidation,
};
