const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mealplanDaySchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  breakfast: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
  },
  lunchDinner: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
  },
  snacks: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
  },
  drinks: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
  },
});

const mealplanSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  days: [mealplanDaySchema],
});

module.exports = mongoose.model("Mealplan", mealplanSchema);
