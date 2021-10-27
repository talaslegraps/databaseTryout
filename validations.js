const { check } = require("express-validator");

const idValidation = [check("id").isInt()];

module.exports = {
  idValidation,
};
