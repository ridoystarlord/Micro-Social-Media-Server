const mongoose = require("mongoose");
const { Schema } = mongoose;

const usersSchema = new Schema({
  name: {
    type: String,
    required: [true, "Enter Your Name"],
  },
  email: {
    type: String,
    required: [true, "Enter Your Email"],
  },
  password: {
    type: String,
    required: [true, "Enter Your Password"],
  },
  gender: {
    type: Boolean,
    required: [true, "Choose Your Gender"],
  },
  userpost: [mongoose.Schema.Types.ObjectId],
  dateofbirth: {
    type: Date,
    required: [true, "Select Your Date of Birth"],
  },
});

const Users = mongoose.model("Users", usersSchema);
module.exports = Users;
