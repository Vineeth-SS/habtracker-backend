const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "User must have user name."],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "User must have email."],
    lowercase: true,
    validate: [validator.isEmail, "Please provide your email"],
  },
  profilePic: {
    profilePic: {
      type: String,
      default: null,
    },
  },

  password: {
    type: String,
    required: [true, "Please provide your password"],
    select: false,
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    require: [true, "Please provide the confirm password"],
    validte: {
      validator: function (confpass) {
        return confpass === this.password;
      },
      message: "Confirm password is not same",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
