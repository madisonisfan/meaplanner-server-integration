const express = require("express");
const Mealplan = require("../models/mealplanModel");
const authenticate = require("../authenticate");
const cors = require("./cors");

const mealplanRouter = express.Router();

module.exports = mealplanRouter;
