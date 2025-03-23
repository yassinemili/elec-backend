const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    attechment: {
      type: String,
    },
    hints: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      enum: ["AI", "Graphic Design", "Problem Solving", "Cyber Security"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Challenge", challengeSchema);
