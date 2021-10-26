const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  // app.send("send something");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
