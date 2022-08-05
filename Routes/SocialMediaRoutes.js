const express = require("express");
const {
  CreateNewPost,
  GetAllPosts,
  RegisterNewUser,
  loginUser,
  CreateNewComment,
  addDownVote,
  addUpVote,
  GetAllUsers,
} = require("../Controllers/SocialMedia");
const router = express.Router();

router.post("/add-new", CreateNewPost);
router.put("/add-new-comment/:id", CreateNewComment);
router.put("/add-upvote/:id", addUpVote);
router.put("/add-downvote/:id", addDownVote);
router.post("/get-all", GetAllPosts);
router.post("/get-all-users", GetAllUsers);
router.post("/register", RegisterNewUser);
router.post("/login", loginUser);

module.exports = router;
