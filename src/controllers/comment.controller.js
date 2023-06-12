const Comment = require("../models/comment.model");

exports.setPostUserIds = (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllComments = async function (req, res, next) {
  const comments = await Comment.find();

  res.status(200).json({
    status: "success",
    length: comments.length,
    data: comments,
  });
};

exports.getCommentById = async function (req, res, next) {
  const comment = await Comment.findById(req.params.commentId);
  console.log("get comment by id");

  if (!comment) {
    return res.status(404).json({
      status: "fail",
      message: "Comment not found",
    });
  }

  res.status(200).json({ 
    status: "success",
    data: comment,
  });
};

exports.getAllCommentsByPost = async function (req, res, next) {
  if (!req.body.post) req.body.post = req.params.postId;
  const comments = await Comment.find({ post: req.params.postId });

  res.status(200).json({
    status: "success",
    length: comments.length,
    data: comments,
  });
};

exports.createComment = async function (req, res, next) {
  if (!req.body.post) req.body.post = req.params.postId;
  if (!req.body.user) req.body.user = req.user.id;
  console.log("REQUEST: ", req.body);
  console.log("END REQUEST");
  
  const comment = new Comment(req.body);
  if (!req.params.commentId) comment.path = comment.id;
  else {
    const parentComment = await Comment.findById(req.params.commentId);
    comment.path = parentComment.path + "." + comment.id;
  }
  console.log(comment);

  const savedComment = await comment.save();
  // res.redirect('/view/posts/' + req.params.postId);
  res.status(200).json({
    status: "success",
    post: req.body.post,
    user: req.body.user,
    data: savedComment,
  });
};

exports.getSubCommentsByCommentId = async (req, res, next) => {
  const comments = await Comment.find({
    path: {
      $regex: new RegExp(req.params.commentId),
    },
  });

  res.status(201).json({
    status: "success",
    length: comments.length,
    data: comments,
  });
};
