const express = require("express");
const app = express();
const db = require("./client");
require("dotenv").config();
const { validationResult } = require("express-validator");
const { idValidation } = require("./validations");

app.use(express.json());

app.get("/", (req, res) => {
  db.query("SELECT * FROM users")
    .then((dbData) => res.send(dbData.rows))
    .catch((err) => res.sendStatus(500));
});

app.get("/:id", idValidation, (req, res) => {
  const { id } = req.params;

  const getSingleUser = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  };

  db.query(getSingleUser)
    .then((dbData) => {
      if (dbData.rows.length < 1) {
        return res.status(404).send("404: No user with this id was found.");
      }
      res.send(dbData.rows);
    })
    .catch((err) => res.sendStatus(500));
});

app.post("/", (req, res) => {
  db.query("SELECT * FROM users")
    .then((dbData) => res.send(dbData.rows))
    .catch((err) => res.sendStatus(500));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
