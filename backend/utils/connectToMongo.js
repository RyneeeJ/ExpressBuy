const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Mongo DB");
  } catch (err) {
    console.log(`Error connecting to Mongo: ${err}`);
  }
};
