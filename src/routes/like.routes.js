const express = require("express");
const likeController = require("../controllers/like.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router({ mergeParams: true });

router
  .route("/comment")
  .patch(authController.protect, likeController.getLikeInComment);

  router
  .route("/post")
  .patch(authController.protect, likeController.getLikeInPost);

module.exports = router;
