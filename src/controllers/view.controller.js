const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

exports.displayHomePage = async function (req, res, next) {
  const activeUsers = await Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $group: {
        _id: "$author",
        user: { $first: "$user" },
        totalPosts: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$user.name",
        email: "$user.email",
        profilePicture: "$user.profilePicture",
        totalPosts: 1,
      },
    },
    {
      $sort: {
        totalPosts: -1,
      },
    },
    {
      $limit: 5
    }
  ]);
  console.log(activeUsers);
  const date =  Date.now();
  const posts = await Post.find().populate("comments");
  console.log("Find all: ", Date.now() - date);
  const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5);

  res.render("home-page", {
    posts,
    recentPosts,
    activeUsers
  });
};

exports.displayPosts = async function (req, res, next) {
  const posts = await Post.find().populate("comments");

  res.render("post-list", {
    posts,
  });
};

exports.displayPostDetailById = async function (req, res, next) {
  const post = await Post.findById(req.params.postId);
  // console.log(post);
  const comments = await Comment.find({ post: req.params.postId });
  comments.sort((a, b) => a.path.localeCompare(b.path));

  res.render("post-detail", { post, comments });
};

exports.displayLoginPage = async function (req, res, next) {
  res.render("auth/login");
};

exports.displayRegisterPage = async function (req, res, next) {
  res.render("auth/register");
};

exports.displayDashboard = async function (req, res, next) {
  const myPosts = await Post.find({ author: req.user.id }).populate("comments");
  // console.log(req.user.id);
  // console.log(myPosts);
  res.render("dashboard", {
    myPosts,
  });
};
