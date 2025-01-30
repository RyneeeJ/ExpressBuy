const mongoose = require("mongoose");
const { isEmail } = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      stype: String,
      required: [true, "Please enter your first name"],
    },
    lastName: {
      stype: String,
      required: [true, "Please enter your last name"],
    },
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "admin"],
    },
    email: {
      type: String,
      required: [true, "A valid email address is required"],
      unique: true,
      validate: {
        validator: (val) => isEmail(val),
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password for your account"],
      minLength: 8,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (val) {
          // In creation of the user, check if password === passwordConfirm
          return val === this.password;
        },
        message: "Passwords do not match",
      },
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    address: [
      {
        street: {
          type: String,
          required: [true, "Please enter your street name"],
        },
        city: {
          type: String,
          required: [true, "Please enter your city/province name"],
        },
        country: {
          type: String,
          required: [true, "Please enter your country name"],
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: true,
    toObject: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
