const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post must belong to a user"],
    },
    title: {
      type: String,
      required: [true, "Post must have a title"],
    },
    content: {
      type: String,
      required: [true, "Post must have a content"],
    },
    like: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    postPicture: {
      type: String,
      default: "/img/1686120345198-992272796.png"
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Virtual populate
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id'
});

postSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: '-__v'
  });

  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
