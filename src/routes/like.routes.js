const express = require("express");
const likeController = require("../controllers/like.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router({ mergeParams: true });

router
  .route("/comment")
  .get(authController.protect, likeController.checkIfUserLikedComment, likeController.getLikeInComment);

  router
  .route("/post")
  .get(authController.protect, likeController.checkIfUserLikedPost, likeController.getLikeInPost);

module.exports = router;
