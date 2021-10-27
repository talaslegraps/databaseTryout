const express = require("express");
const app = express();
const db = require("./client");
require("dotenv").config();
const { validationResult } = require("express-validator");
const { idValidation, newUserValidation } = require("./validations");

app.use(express.json());

app.get("/", (req, res) => {
  db.query("SELECT * FROM users ORDER BY id ASC")
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
    .then((dbData) => {
      if (dbData.rows.length < 1) {
        return res
          .status(404)
          .send("404: No user with this id exists in the database.");
      }
      res.send(dbData.rows);
    })
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

app.put("/:id", idValidation, newUserValidation, (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, active } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  const updateUser = {
    text: `
    UPDATE users
    SET first_name=$1, last_name=$2, age=$3, active=$4
    WHERE id=$5
    RETURNING *
    `,
    values: [first_name, last_name, age, active, id],
  };

  db.query(updateUser)
    .then((dbData) => {
      if (dbData.rows.length < 1) {
        return res
          .status(404)
          .send("404: No user with this id exists in the database.");
      }
      res.send(dbData.rows);
    })
    .catch((err) => res.sendStatus(500));
});

app.delete("/:id", idValidation, (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  const deleteUser = {
    text: `
    DELETE FROM users
    WHERE id = $1
    RETURNING *
    `,
    values: [id],
  };

  db.query(deleteUser)
    .then((dbData) => {
      if (dbData.rows.length < 1) {
        return res
          .status(404)
          .send("404: No user with this id exists in the database.");
      }
      res.send(dbData.rows);
    })
    .catch((err) => res.sendStatus(500));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
