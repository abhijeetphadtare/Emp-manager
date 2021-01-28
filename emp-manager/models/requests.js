const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Approved', 'Pending', 'Rejected'],
    default: "Pending"
  },
  requestCreatedAt: {
    type: Date,
    default: Date.now,
  },
  vacationStartDate: {
    type: Date,

  },
  vacationEndDate: {
    type: Date,

  },
  auther: {
    type: mongoose.Types.ObjectId,
    ref: "Worker",
    required: true
  },
  resolvedBy: {
    type: mongoose.Types.ObjectId,
    ref: "Manager",
  }
});

module.exports = new mongoose.model("Request", requestSchema);