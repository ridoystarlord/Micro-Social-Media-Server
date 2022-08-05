const mongoose = require("mongoose");
const Posts = require("../Models/Post");
const Users = require("../Models/Users");
const Comment = require("../Models/Comment");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");

const CreateNewPost = async (req, res) => {
  const postData = req.body;
  if (postData?._id === null) {
    delete postData._id;
  }
  const newPost = new Posts(postData);
  try {
    await newPost.save().then(async (res) => {
      await Users.updateOne(
        { _id: newPost?.userref },
        { $push: { userpost: res?._id } }
      );
    });
    res.status(200).json({ message: "Status Posted Successfully" });
  } catch (error) {
    res.status(500).json(error?.message);
  }
};

const GetPostSearchObj = (query) => {
  let searchQuery = {};
  if (query.userrefisused) {
    searchQuery["userref"] = query.userref;
  }
  return searchQuery;
};

const GetAllPosts = async (req, res) => {
  const query = GetPostSearchObj(req.body);
  try {
    const postList = await Posts.find(query)
      .populate([
        {
          path: "userref",
          model: Users,
        },
        {
          path: "comments",
          populate: {
            path: "userref",
            model: Users,
          },
        },
      ])
      .sort({ posttime: -1 });
    res.status(200).json({ results: postList });
  } catch (error) {
    res.status(500).json(error?.message);
  }
};
const GetAllUsers = async (req, res) => {
  try {
    const userList = await Users.find({});
    res.status(200).json({ results: userList });
  } catch (error) {
    res.status(500).json(error?.message);
  }
};

const RegisterNewUser = async (req, res) => {
  const userData = req.body;
  if (userData?._id === null) {
    delete userData._id;
  }
  const newUser = new Users(userData);
  const salt = genSaltSync(10);
  newUser.password = hashSync(newUser.password, salt);
  try {
    const user = await Users.find({ email: newUser.email });
    if (user.length > 0) {
      res.status(409).json({ message: "This Email Already Registered" });
    } else {
      const result = await newUser.save();
      res.status(200).json({
        message: "Registered Successfully",
        user: {
          useremail: result.email,
          name: result.name,
          _id: result._id,
          gender: result.gender,
          birthday: result.dateofbirth,
        },
      });
    }
  } catch (error) {
    res.status(500).json(error?.message);
  }
};
const loginUser = async (req, res) => {
  const userData = req.body;
  const userInfo = new Users(userData);
  try {
    const user = await Users.find({ email: userInfo.email });
    const result = compareSync(userInfo.password, user[0].password);
    if (result) {
      user[0].password = undefined;
      res.status(200).json({
        message: "Login Successfully",
        user: {
          useremail: user[0].email,
          name: user[0].name,
          _id: user[0]._id,
          gender: user[0].gender,
          birthday: user[0].dateofbirth,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid Email and Password" });
    }
  } catch (error) {
    res.status(500).json(error?.message);
  }
};

const CreateNewComment = async (req, res) => {
  const { id } = req.params;
  const commentData = req.body;
  if (commentData?._id === null) {
    delete commentData._id;
  }
  const newComment = new Comment(commentData);
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Post Found with the Query");
  try {
    await newComment.save().then(async (result) => {
      await Posts.updateOne({ _id: id }, { $push: { comments: result?._id } });
    });
    res.status(200).json({ message: "Comment Added Successfully" });
  } catch (error) {
    res.status(500).json(error?.message);
  }
};
const addUpVote = async (req, res) => {
  const { id } = req.params;
  const voteData = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Post Found with the Query");
  try {
    const singlePost = await Posts.find({ _id: id });
    const filterDownvote = singlePost[0]?.downvote?.filter(
      (com) => com.toString() !== voteData?.userref
    );
    await Posts.updateOne(
      { _id: id },
      {
        $set: { downvote: filterDownvote },
        $addToSet: { upvote: voteData.userref },
      }
    );
    res.status(200).json({ message: "Upvote Added Successfully" });
  } catch (error) {
    res.status(500).json(error?.message);
  }
};
const addDownVote = async (req, res) => {
  const { id } = req.params;
  const voteData = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Post Found with the Query");
  try {
    const singlePost = await Posts.find({ _id: id });
    const filterUpvote = singlePost[0]?.upvote?.filter(
      (com) => com.toString() !== voteData?.userref
    );
    await Posts.updateOne(
      { _id: id },
      {
        $set: { upvote: filterUpvote },
        $addToSet: { downvote: voteData.userref },
      }
    );
    res.status(200).json({ message: "Downvote Added Successfully" });
  } catch (error) {
    res.status(500).json(error?.message);
  }
};

module.exports = {
  CreateNewPost,
  GetAllPosts,
  RegisterNewUser,
  loginUser,
  CreateNewComment,
  addUpVote,
  addDownVote,
  GetAllUsers,
};
