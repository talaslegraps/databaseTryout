const express = require("express");
const app = express();
const db = require("./client");
require("dotenv").config();
const { validationResult } = require("express-validator");
const { idValidation, newUserValidation } = require("./validations");
const userRouter = require("./routes/userRouter");
const orderRouter = require("./routes/orderRouter");

app.use(express.json());
app.use("/users", userRouter);
app.use("/orders", orderRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
