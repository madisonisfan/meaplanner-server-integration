const express = require("express");
const Comment = require("../models/comment");
const authenticate = require("../authenticate");
const cors = require("./cors");

const commentRouter = express.Router();

commentRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Comment.find()
      .populate("author")
      .then((comment) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(comment);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (req.body) {
      console.log("req.body:", req.body);
      req.body.author = req.user._id;
      Comment.create(req.body)
        .then((comment) => {
          Comment.findById(comment._id)
            .populate("author")
            .then((comment) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(comment);
            });
        })
        .catch((err) => next(err));
    } else {
      const err = new Error("Comment not found in request body");
      err.status = 404;
      return next(err);
    }
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /comments/");
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Comment.remove({})
        .then((resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        })
        .catch((err) => next(err));
    }
  );
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
