const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: String,
    type: String,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    logo: String,
});

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    role: [String],
    title: String,
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    email: String,
    phone: String,
    password: String,
    profileImage: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    images: [String],
    text: String,
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

const Company = mongoose.model("Company", companySchema);
const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);
// const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Company, User, Post };
