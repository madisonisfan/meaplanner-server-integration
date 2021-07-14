const express = require("express");
const Like = require("../models/likeModel");
const authenticate = require("../authenticate");
const cors = require("./cors");
const likeModel = require("../models/likeModel");

const likeRouter = express.Router();

likeRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Like.find()
      .populate("liker")
      .populate("post")
      .then((likes) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(likes);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /likes/");
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /likes/");
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    //authenticate.verifyAdmin,
    (req, res, next) => {
      Like.remove({})
        .then((resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        })
        .catch((err) => next(err));
    }
  );

likeRouter
  .route("/:postId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /likes/${req.params.postId}`);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Like.create({
      liker: req.user._id,
      post: req.params.postId,
    })

      .then((like) => {
        console.log("like to delete", like);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(like);
      })
      .catch((err) => next(err));
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /likes/");
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Like.findOne({ liker: req.user._id, post: req.params.postId })
      .then((like) => {
        if (like) {
          Like.findOneAndDelete({
            liker: req.user._id,
            post: req.params.postId,
          })
            .then((like) => {
              console.log("like to delete", like);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(like);
            })
            .catch((err) => next(err));
        } else {
          const err = new Error(`No like for this post and user`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = likeRouter;
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
