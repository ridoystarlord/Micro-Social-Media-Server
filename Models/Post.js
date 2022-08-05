const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  userref: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: "Users",
  },
  content: {
    type: String,
    required: [true, "Write Something to Post"],
  },
  img: {
    type: String,
    default: "",
  },
  upvote: [mongoose.Schema.Types.ObjectId],
  downvote: [mongoose.Schema.Types.ObjectId],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
  posttime: {
    type: Date,
    default: Date.now,
  },
});

const Posts = mongoose.model("Posts", postSchema);
module.exports = Posts;
