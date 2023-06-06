const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

exports.getAllPosts = async function (req, res, next) {
  const posts = await Post.find();
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
    const post = await Post.findById(req.params.id);
    // const post = await Post.findById(req.params.id).populate('comments');

    // const comments = await Comment.find({ post: req.params.id });
    // comments.sort((a, b) => a.path.localeCompare(b.path));
    // console.log(comments);
    // post.comments.sort((a, b) => a.path.localeCompare(b.path));
    console.log(Date.now() - time);
    console.log('here');
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
}

exports.createPost = async function (req, res, next) {
    if (!req.body.author) req.body.author = req.user.id;
    console.log(req.body);
    const post = new Post(req.body);
    const savedPost = await post.save();
    // console.log(post);
    // res.status(201).json({
    //     status: "success",
    //     data: savedPost,
    // });
    res.redirect('/view/posts');
};

exports.updatePost = async function (req, res, next) {
    console.log(req.body);
    const post = await Post.findByIdAndUpdate(req.params.id, req.body);
    // console.log(post);
    res.status(200).json({
        status: "success",
        data: post,
    });
};

exports.deletePost = async function (req, res, next) {
    const post = await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: "success",
        data: post,
    });
};