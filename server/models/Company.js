const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const companySchema = new mongoose.Schema({
  name: String,
  type: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  logo: String,
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: [String],
  title: String,
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: String,
  password: { type: String, required: true },
  profileImage: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  images: [String],
  postText: String,
  // createdAt: { type: Date, default: Date.now },
  // updatedAt: { type: Date, default: Date.now },
  likes: Number,
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      images: [String],
      // createdAt: { type: Date, default: Date.now },
      // updatedAt: { type: Date, default: Date.now },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Company = mongoose.model("Company", companySchema);
const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);
// const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Company, User, Post };
