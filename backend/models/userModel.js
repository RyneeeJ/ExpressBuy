const crypto = require("crypto");

const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
    },
    image: String,
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "admin"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email address"],
      unique: true,
      validate: {
        validator: (val) => isEmail(val),
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password for your account"],
      minLength: [8, "Password must be atleast 8 characters"],
      select: false,
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
    address: {
      type: [
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
      default: [],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON: true,
    toObject: true,
  }
);
// If user role is customer, make sure there is an address input
userSchema.pre("validate", function (next) {
  if (this.role === "customer" && this.address.length === 0) {
    this.invalidate("address", "Address is required for customers");
  }
  next();
});

// Hash password and store to database
userSchema.pre("save", async function (next) {
  // only hash password if the password is modified or new doc created
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  // only set passwordChangedAt if password is modified AND the document is not new
  if (!this.isModified("password") && !this.isNew) return next();

  this.passwordChangedAt = Date.now() - 3000;

  next();
});

userSchema.methods.passwordChangedAfterTokenIssued = function (JWTTimestamp) {
  // return true if passwordChangedAt > jwtTimestamp
  if (this.passwordChangedAt) {
    return this.passwordChangedAt.getTime() > JWTTimestamp * 1000;
  }

  return false;
};

userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
  // generate random 32-byte reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // hash token
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Store hashed token to db and specify expiration
  this.passwordResetToken = hashedToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await this.save({ validateBeforeSave: false });
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
