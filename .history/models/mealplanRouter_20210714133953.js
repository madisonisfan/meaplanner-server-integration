const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mealplanSchema = new Schema(
  (user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  })
);

module.exports = mongoose.model("Mealplan", mealplanSchema);
