require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const connectToMongo = require("./utils/connectToMongo");
const globalErrorHandler = require("./controllers/errorController");

const authRoutes = require("./routes/authRoutes");

const app = express();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parser
app.use(cookieParser());

const port = process.env.PORT || 4242;

app.get("/", (req, res) => {
  res.send("Server ready");
});

app.use("/api/v1/auth", authRoutes);
app.use(globalErrorHandler);
app.listen(port, () => {
  console.log(`Server is listening in port ${port}`);
  connectToMongo();
});
