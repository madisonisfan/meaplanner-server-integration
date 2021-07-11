const express = require("express");
const Favorite = require("../models/favoriteModel");
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();

module.exports = favoriteRouter;

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((userFavDoc) => {
        console.log("favorite/userfavdoc", favorite);
        if (!userFavDoc) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ exists: false });
        } else {
          Favorite.findById(userFavDoc._id)
            .populate("recipes")
            .then((userFavDoc) => {
              console.log("favorite", userFavDoc);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({ exists: true, recipes: userFavDoc.recipes });
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((userFavoriteDoc) => {
        if (userFavoriteDoc) {
          req.body.forEach((recipeToAdd) => {
            if (!userFavoriteDoc.recipes.includes(recipeToAdd)) {
              console.log("adding recipe");
              userFavoriteDoc.recipes.push(recipeToAdd);
            }
          });
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(userFavoriteDoc);
        } else {
          Favorite.create({ user: req.user._id }).then((userFavoriteDoc) => {
            req.body.forEach((recipeToAdd) => {
              userFavoriteDoc.recipes.push(recipeToAdd);
            });

            userFavoriteDoc
              .save()
              .then((userFavoriteDoc) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(userFavoriteDoc);
              })
              .catch((err) => next(err));
          });
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites`);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({
      user: req.user._id,
    })
      .then((userFavoriteDoc) => {
        res.statusCode = 200;
        if (userFavoriteDoc) {
          res.setHeader("Content-Type", "application/json");
          res.json(userFavoriteDoc);
        } else {
          res.setHeader("Content-Type", "text/plain");
          res.end("You do not have any favorites to delete.");
        }
      })
      .catch((err) => next(err));
  });

favoriteRouter
  .route("/:recipeId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /favorites/${req.params.recipeId}`);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((userFavoriteDoc) => {
        if (userFavoriteDoc) {
          console.log("userFavDoc", userFavoriteDoc);
          if (!userFavoriteDoc.recipes.includes(req.params.campsiteId)) {
            userFavoriteDoc.recipes.push({ _id: req.params.campsiteId });
            userFavoriteDoc
              .save()
              .then((userFavoriteDoc) => {
                Favorite.findById(userFavoriteDoc._id)
                  .populate("recipes")
                  .then((userFavoriteDoc) => {
                    console.log("after save", userFavoriteDoc);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({
                      exists: true,
                      recipes: userFavoriteDoc.recipes,
                    });
                  })
                  .catch((err) => next(err));
              })
              .catch((err) => next(err));
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ exists: true, recipes: userFavoriteDoc.recipes });
          }
        } else {
          Favorite.create({
            user: req.user._id,
            campsites: [req.params.campsiteId],
          })
            .then((favorite) => {
              Favorite.findById(favorite._id)
                .populate("campsites")
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json({ exists: true, campsites: favorite.campsites });
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.recipeId}`);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((userFavoriteDoc) => {
        if (userFavoriteDoc) {
          const newFavorites = userFavoriteDoc.recipes.filter(
            (recipe) => recipe._id.toString() !== req.params.recipeId
          );
          userFavoriteDoc.recipes = newFavorites;
          userFavoriteDoc
            .save()
            .then((userFavoriteDoc) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(userFavoriteDoc);
            })
            .catch((err) => next(err));
        } else {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("There are no favorites to delete.");
        }
      })
      .catch((err) => next(err));
  });

module.exports = favoriteRouter;
