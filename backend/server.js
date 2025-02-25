require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

const connectToMongo = require("./utils/connectToMongo");
const globalErrorHandler = require("./controllers/errorController");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const orderController = require("./controllers/orderController");
const app = express();

cloudinary.config({
  secure: true,
});

// Placed here before bodyparser because request body needs to be in raw format
app.post(
  "/api/v1/orders/webhook",
  express.raw({ type: "application/json" }),
  orderController.handleStripeWebhook
);

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
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);

// Error handler middleware
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Server is listening in port ${port}`);
  connectToMongo();
});
