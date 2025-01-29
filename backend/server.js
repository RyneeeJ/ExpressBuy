require("dotenv").config();
const express = require("express");

const connectToMongo = require("./utils/connectToMongo");

const app = express();

const port = process.env.PORT || 4242;

app.get("/", (req, res) => {
  res.send("Server ready");
});

app.listen(port, () => {
  console.log(`Server is listening in port ${port}`);
  connectToMongo();
});
