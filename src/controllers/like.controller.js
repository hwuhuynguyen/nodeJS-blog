const Post = require("../models/post.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");

exports.getLikeInPost = async function (req, res, next) {
  console.log("get like in post");
  const post = await Post.findById(req.params.postId);
  let likeList = post.like;
  console.log(req.isLiked);
  if (!req.isLiked) {
    likeList.push(req.user.id);
  } else {
    likeList.pull(req.user.id);
  }
  await post.save();
  console.log(req.user.id);
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
};

exports.getLikeInComment = async function (req, res, next) {
  console.log("get like in comment");
  console.log(req.isLiked);
  const comment = await Comment.findById(req.params.commentId);
  let likeList = comment.like;
  if (!req.isLiked) {
    likeList.push(req.user.id);
  } else {
    likeList.pull(req.user.id);
  }
  await comment.save();
  console.log(req.user.id);
  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
};

exports.checkIfUserLikedPost = async function (req, res, next) {
  console.log("check if user liked this post");
  const post = await Post.findById(req.params.postId);
  let users = post.like;
  if (users.includes(req.user.id)) {
    req.isLiked = true;
    return next();
  }
  next();
};

exports.checkIfUserLikedComment = async function (req, res, next) {
  console.log("check if user liked this comment");
  const comment = await Comment.findById(req.params.commentId);
  let users = comment.like;
  if (users.includes(req.user.id)) {
    req.isLiked = true;
    return next();
  }
  next();
};
