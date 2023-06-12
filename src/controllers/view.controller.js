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
      $limit: 5,
    },
  ]);
  console.log(activeUsers);
  const date = Date.now();
  const posts = await Post.find().populate("comments");
  console.log(posts);
  console.log("Find all: ", Date.now() - date);
  const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5);

  res.render("home-page", {
    posts,
    recentPosts,
    activeUsers,
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

  console.log("User: ", req.user);
  if (typeof req.user !== "undefined") {
    console.log("check post and comment like or not");
    if (post.like.includes(req.user.id)) {
      post.isLiked = true;
    } else {
      post.isLiked = false;
    }
    post.save();
    // comments.forEach(async (comment) => {
    //   // if (comment.isLiked === true) {
    //   //   comment.isLiked = false;
    //   // }
    //   if (await comment.like.includes(req.user.id)) {
    //     console.log("true");
    //     comment.isLiked = true;
    //   } else {
    //     console.log("false");
    //     comment.isLiked = false;
    //   }
    //   await comment.save();
    //   console.log("comment after save: " + comment.isLiked);
    // });
    for (let comment of comments) {
      if (comment.like.includes(req.user.id)) {
        comment.isLiked = true;
      } else {
        comment.isLiked = false;
      }
      await comment.save();
    }
  }
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
