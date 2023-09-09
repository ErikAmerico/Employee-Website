const { signToken, AuthenticationError } = require("../utils/auth");
const { User, Company, Post, Comment } = require("../models");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({
                    _id: context.user._id,
                }).select("-__v -password");
                return userData;
            }
            throw new AuthenticationError("Not logged in");
        },
        company: async (parent, { companyId }) => {
            return await Company.findOne({ companyId })
                .populate("users")
                .populate({
                    path: "users",
                    populate: "posts",
                });
        },
        //find all users in a company
        users: async (parent, { companyId }) => {
            const params = companyId ? { companyId } : {};
            return await User.find(params).populate("company");
        },
        //find all posts in a company
        posts: async (parent, { companyId }) => {
            const params = companyId ? { companyId } : {};
            return await Post.find(params).populate("user").populate({
                path: "comments",
                populate: "user",
            });
        },
        //find a single post
        post: async (parent, { postId }) => {
            const params = postId ? { postId } : {};
            return await Post.findOne(params).populate("user").populate({
                path: "comments",
                populate: "user",
            });
        },
        //find a selected User
        user: async (parent, { userId }) => {
            return await User.findOne({ userId }).populate("company");
        },
    },
    Mutation: {},
};

module.exports = resolvers;
