require("dotenv").config();
const fs = require("fs");
const Product = require("../models/productModel");
const connectToMongo = require("../utils/connectToMongo");

connectToMongo();

const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Product.create(products);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
