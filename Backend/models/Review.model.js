const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    userImage: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = model("reviews", reviewSchema);