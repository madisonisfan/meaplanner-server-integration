const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mealplanSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  days: [mealplanDaySchema],
});

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
module.exports = mongoose.model("Mealplan", mealplanSchema);
