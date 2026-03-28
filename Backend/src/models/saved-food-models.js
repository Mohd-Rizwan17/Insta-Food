const mongoose = require("mongoose");

const savedFoodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
      required: true,
    },
  },
  { timestamps: true },
);

const savedFoodModel = mongoose.model("savedFood", savedFoodSchema);

module.exports = savedFoodModel;
