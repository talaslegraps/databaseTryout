const express = require("express");
const orderRouter = express.Router();
const db = require("../client");
const { validationResult } = require("express-validator");
const {
  idValidation,
  newUserValidation,
  newOrderValidation,
} = require("../validations");

orderRouter.get("/", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY id ASC")
    .then((dbData) => res.send(dbData.rows))
    .catch((err) => res.sendStatus(500));
});

orderRouter.get("/:id", idValidation, (req, res) => {
  const { id } = req.params;

  const getSingleOrder = {
    text: "SELECT * FROM orders WHERE id = $1",
    values: [id],
  };

  db.query(getSingleOrder)
    .then((dbData) => {
      if (dbData.rows.length < 1) {
        return res
          .status(404)
          .send("404: No order with this id exists in the database.");
      }
      res.send(dbData.rows);
    })
    .catch((err) => res.sendStatus(500));
});

orderRouter.post("/", newOrderValidation, (req, res) => {
  const { price, user_id } = req.body;
  const errors = validationResult(req);
  const date = new Date();

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  const createNewOrder = {
    text: `
        INSERT INTO orders(price, date, user_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
    values: [price, date, user_id],
  };

  db.query(createNewOrder)
    .then((dbData) => res.send(dbData.rows))
    .catch((err) => res.sendStatus(500));
});

orderRouter.put("/:id", idValidation, newOrderValidation, (req, res) => {
  const { id } = req.params;
  const { price, user_id } = req.body;
  const errors = validationResult(req);
  const date = new Date();

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  const updateOrder = {
    text: `
        UPDATE orders
        SET price=$1, date=$2, user_id=$3
        WHERE id=$4
        RETURNING *
        `,
    values: [price, date, user_id, id],
  };

  db.query(updateOrder)
    .then((dbData) => {
      if (dbData.rows.length < 1) {
        return res
          .status(404)
          .send("404: No order with this id exists in the database.");
      }
      res.send(dbData.rows);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

orderRouter.delete("/:id", idValidation, (req, res) => {
  const { id } = req.params;

  const deleteOrder = {
    text: `
        DELETE FROM orders
        WHERE id = $1
        RETURNING *
        `,
    values: [id],
  };

  db.query(deleteOrder)
    .then((dbData) => {
      if (dbData.rows.length < 1) {
        return res
          .status(404)
          .send("404: No order with this id exists in the database.");
      }
      res.send(dbData.rows);
    })
    .catch((err) => res.sendStatus(500));
});

module.exports = orderRouter;
