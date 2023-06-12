const Post = require("../models/post.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");

exports.getLikeInPost = async function (req, res, next) {
  console.log("get like in post");
  const date = Date.now();
  const post = await Post.findById(req.params.postId);
  console.log(Date.now() - date);

  let users = post.like;
  
  if (!users.includes(req.user.id)) {
    users.push(req.user.id);
  } else {
    users.pull(req.user.id);
  }
  post.save(); // get rid of await
  console.log(Date.now() - date);
  console.log(req.user.id);
  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
  console.log(Date.now() - date);

};

exports.getLikeInComment = async function (req, res, next) {
  console.log("get like in comment");
  const date = Date.now();
  const comment = await Comment.findById(req.params.commentId);
  console.log(Date.now() - date);
  let users = comment.like;
  if (!users.includes(req.user.id)) {
    users.push(req.user.id);
  } else {
    users.pull(req.user.id);
  }
  comment.save();
  console.log(req.user.id);
  console.log(Date.now() - date);
  res.status(200).json({
    status: "success",
    data: {
      comment,
    },
  });
};
