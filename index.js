const express = require("express");
const app = express();
const db = require("./client");
require("dotenv").config();
const { validationResult } = require("express-validator");
const { idValidation, newUserValidation } = require("./validations");

app.use(express.json());

app.get("/", (req, res) => {
  db.query("SELECT * FROM users")
    .then((dbData) => res.send(dbData.rows))
    .catch((err) => res.sendStatus(500));
});

app.get("/:id", idValidation, (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  const getSingleUser = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  };

  db.query(getSingleUser)
    .then((dbData) => res.send(dbData.rows))
    .catch((err) => res.sendStatus(500));
});

app.post("/", newUserValidation, (req, res) => {
  const { first_name, last_name, age, active } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  const createNewUser = {
    text: `
    INSERT INTO users(first_name, last_name, age, active)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    values: [first_name, last_name, age, active],
  };

  db.query(createNewUser)
    .then((dbData) => res.send(dbData.rows))
    .catch((err) => res.sendStatus(500));
});

app.put("/:id", idValidation, (req, res) => {
  db.query(createNewUser)
    .then((dbData) => res.send(dbData.rows))
    .catch((err) => res.sendStatus(500));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
