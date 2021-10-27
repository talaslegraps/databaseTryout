const express = require("express");
const app = express();
const db = require("./client");
require("dotenv").config();

app.use(express.json());

app.get("/", (req, res) => {
  db.query("SELECT * FROM users")
    .then((dbData) => res.send(dbData.rows))
    .catch((err) => res.sendStatus(500));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
