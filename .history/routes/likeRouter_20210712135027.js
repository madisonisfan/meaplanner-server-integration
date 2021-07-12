const express = require("express");
const likeRouter = express.Router();
const Like = require("../models/likeModel");
const authenticate = require("../authenticate");
const cors = require("./cors");

likeRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200));

/*
postRouter
  .route("/:postId/likes")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Post.findById(req.params.postId)
      .populate("likes")
      .then((post) => {
        console.log("post", post);
        if (post) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(post.likes);
        } else {
          err = new Error(`Post ${req.params.postId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Post.findById(req.params.postId)
      .then((post) => {
        if (post) {
          post.likes.push({ _id: req.user._id });
          post
            .save()
            .populate("likes")
            .then((post) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(post);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Post ${req.params.postId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/plain");
    res.end("PUT operation not support on /posts");
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      //finish after
    }
  );

  */
