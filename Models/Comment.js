const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  userref: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User Required"],
    ref: "Users",
  },
  content: {
    type: String,
    required: [true, "Write a comment"],
  },
  commenttime: {
    type: Date,
    default: Date.now,
  },
});

const Comments = mongoose.model("Comments", commentSchema);
module.exports = Comments;
