const { signToken, AuthenticationError } = require("../utils/auth");
const { User, Company, Post } = require("../models/Company");

const resolvers = {
    Query: {
        //find a single user
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({
                    _id: context.user._id,
                }).select("-__v -password");
                return userData;
            }
            throw new AuthenticationError("Not logged in");
        },

        users: async (parent, {}, context) => {
            if (context.user) {
                const params = Company ? { Company } : {};
                const users = await User.find(params).populate("company");

                const usersWithRolesAsString = users.map((user) => ({
                    ...user.toObject(),
                    role: user.role.join(", "),
                }));

                return usersWithRolesAsString;
                //return await User.find(params).populate("company");
            }
            throw new AuthenticationError("Not logged in");
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
        user: async (parent, {}) => {
            return await User.findOne({ _id: context.user._id }).populate(
                "company"
            );
        },
    },
    Mutation: {
        //add a new company
        createCompany: async (parent, { name, type, logo }) => {
            return await Company.create({ name, type, logo });
        },
        //add a new user and link to the company you are in
        createUser: async (
            parent,
            {
                firstName,
                lastName,
                role,
                company,
                title,
                email,
                phone,
                password,
                profileImage, // change to object
            }
        ) => {
            //const company = await Company.create;
            const user = await User.create({
                firstName,
                lastName,
                role,
                company,
                title,
                email,
                phone,
                password,
                profileImage,
            });

            const token = signToken(user); //create company id to payload of token
            return { token, user };
        },
        //add a new post
        createPost: async (parent, { images, postText }, context) => {
            if (context.user) {
                const post = await Post.create({ images, postText, user: context.user._id });
                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { post: post._id } },
                    { new: true }
                );
                return post;
            }
            throw new AuthenticationError("You need to be logged in!");
        },

        //add a new comment
        createComment: async (parent, { text, images }) => {
            return await Comment.create({ text, images });
        },

        //login
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email }).populate("company");
            if (!user) {
                throw new AuthenticationError("Incorrect credentials");
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError("Incorrect credentials");
            }
            // const token = signToken(user);
            const token = signToken({
                ...user.toObject(),
                company: user.company._id,
            });
            return { token, user };
        },

        updateCompany: async (parent, { name, type, logo }) => {
            const updatedCompany = await Company.findOneAndUpdate(
                { name, type, logo },
                { new: true }
            );
            return updatedCompany;
        },

        updateUser: async (
            parent,
            {
                firstName,
                lastName,
                role,
                title,
                email,
                phone,
                password,
                profileImage,
            }
        ) => {
            const updatedUser = await User.findOneAndUpdate(
                {
                    firstName,
                    lastName,
                    role,
                    title,
                    email,
                    phone,
                    password,
                    profileImage,
                },
                { new: true }
            );
            return updatedUser;
        },

        updatePost: async (parent, { postId, images, postText }) => {
            const updatedPost = await Post.findOneAndUpdate(
                { _id: postId },
                { images, postText },
                { new: true }
            );
            return updatedPost;
        },

        updateComment: async (parent, { text, images }) => {
            const updatedComment = await Comment.findOneAndUpdate(
                { text, images },
                { new: true }
            );
            return updatedComment;
        },

        removeUser: async (parent, {}) => {
            const user = await User.findByIdAndDelete({
                _id: context.user._id,
            });
            return user;
        },

        removePost: async (parent, { postId }) => {
            const post = await Post.findOneAndDelete({
                _id: postId,
            });
            return post;
        },

        addUserToCompany: async (parent, { companyId, userId }) => {
            try {
                const company = await Company.findById(companyId);

                if (!company) {
                    throw new Error("Company not found");
                }

                company.users.push(userId);

                await company.save();

                return company;
            } catch (error) {
                throw new Error("Error adding user to company");
            }
        },
    },
};

module.exports = resolvers;
