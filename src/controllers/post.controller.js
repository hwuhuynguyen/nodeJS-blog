const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, uniqueSuffix + "." + fileExtension);
  },
});

var upload = multer({ storage: storage });

exports.getAllPosts = async function (req, res, next) {
  const date = Date.now();
  const posts = await Post.find().populate("comments");
  console.log("Find all: ", Date.now() - date);
  //   const jwt = res.headers['jwt'];
  res.status(200).json({
    status: "success",
    length: posts.length,
    data: posts,
  });

  //   res.render("home-page", { posts });
};

exports.getPostById = async function (req, res, next) {
  const time = Date.now();
  const post = await Post.findById(req.params.id).populate("comments");
  // const post = await Post.findById(req.params.id).populate('comments');

  // const comments = await Comment.find({ post: req.params.id });
  // comments.sort((a, b) => a.path.localeCompare(b.path));
  // console.log(comments);
  // post.comments.sort((a, b) => a.path.localeCompare(b.path));
  console.log(Date.now() - time);
  console.log("here");
  res.status(200).json({
    status: "success",
    data: post,
  });
  // res.render("post-detail", { post, comments });
};

exports.getAllPostsByUserId = async function (req, res, next) {
  const posts = await Post.find({ author: req.params.userId });

  res.status(200).json({
    status: "success",
    length: posts.length,
    data: posts,
  });
};

exports.createPost = async function (req, res, next) {
  //   if (!req.body.author) req.body.author = req.user.id;
  // console.log(req.body);
  // const post = new Post(req.body);
  // const savedPost = await post.save();
  // console.log(post);
  // res.status(201).json({
  //     status: "success",
  //     data: savedPost,
  // });
  // console.log(req);
  upload.single("postPicture")(req, res, async (err) => {
    if (err) {
      // Handle the error if the file upload fails
      console.error(err);
      return next(err);
    }

    let convertedPath = "/" + path.relative("src/public", req.file.path);

    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      postPicture: convertedPath,
      author: req.user.id,
    });

    res.redirect("/view/posts");
  });
};

exports.updatePost = async function (req, res, next) {
  console.log(req.body);
  upload.single("postPicture")(req, res, async (err) => {
    if (err) {
      // Handle the error if the file upload fails
      console.error(err);
      return next(err);
    }

    let convertedPath = "/" + path.relative("src/public", req.file.path);

    const post = await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content,
      postPicture: convertedPath,
      author: req.user.id,
    });
    res.redirect("/view/posts");
  });
  //   const post = await Post.findByIdAndUpdate(req.params.id, req.body);
  // console.log(post);
  //   res.status(200).json({
  //     status: "success",
  //     data: post,
  //   });
};

exports.deletePost = async function (req, res, next) {
  const post = await Post.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    data: post,
  });
};
