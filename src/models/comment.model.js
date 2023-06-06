const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Comment must have content"],
      maxlength: [280, "Comment must have less than 280 characters"],
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
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "Comment must belong to a post"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Comment must belong to a user"],
    },
    path: {
      type: String,
      default: "",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

commentSchema.virtual('level').get(function() {
  return this.path.split('.').length;
});


commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: '-__v'
  }).populate({
    path: 'post',
    select: '-__v'
  });

  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
