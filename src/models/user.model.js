const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User must have a name"],
    },
    email: {
      type: String,
      required: [true, "User must have an email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User must have a password"],
    },
    gender: {
      type: String,
      required: [true, "User must have a gender"],
    },
    profilePicture: {
      type: String,
      default: "/img/1686112105983-552835236.png",
    },
    dateOfBirth: {
      type: Date,
      required: [true, "User must have a date of birth"],
    },
    role: {
      type: String,
      default: "user",
    }
    // post: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "Post",
    //   },
    // ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
