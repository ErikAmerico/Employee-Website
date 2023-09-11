const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    companyId: {
        type: String,
        default: () => Math.random().toString(36).substring(7),
    },
    name: String,
    type: String,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    logo: String,
});

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userId: {
        type: String,
        default: () => Math.random().toString(36).substring(7),
    },
    role: String,
    title: String,
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    email: String,
    phone: String,
    password: String,
    profileImage: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

const postSchema = new mongoose.Schema({
    postId: {
        type: String,
        default: () => Math.random().toString(36).substring(7),
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    images: [String],
    text: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    likes: Number,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const commentSchema = new mongoose.Schema({
    commentId: {
        type: String,
        default: () => Math.random().toString(36).substring(7),
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    images: [String],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Company = mongoose.model("Company", companySchema);
const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Company, User, Post, Comment };
