const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "plases ad user name"],
  },
  email: {
    type: String,
    required: [true, "add email address of user"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "enter valid email"],
    unique: true,
  },
  address: {
    type: String,
  },
  holidays: {
    type: Number,
    default: 30
  },
  password: {
    type: String,
    required: [true, `add password of user`],
    select: false,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = new mongoose.model("Worker", workerSchema);