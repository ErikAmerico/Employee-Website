const { signToken, AuthenticationError } = require("../utils/auth");
const { User, Company, Post } = require("../models/Company");
const ChatMessage = require("../models/ChatMessage");

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
                const companyId = context.user.company;
                const params = companyId ? { company: companyId } : {};
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
        posts: async (parent, args, context) => {
            // return await Post.find({ "user.company._id": context.user.company })
            return await Post.find({
                //     user: {
                //         company: {
                //             _id: new mongoose.Types.ObjectId(
                //                 "6502e51f83a006d7ebbef2cd"
                //             ),
                //         },
                //     },
                // })
                //     // "user._id": new mongoose.Types.ObjectId("6502e51f83a006d7ebbef2cf"),  })
                //     .populate("user")
                //     .populate({
                //         path: "comments",
                //         populate: "user",
                //     });
                user: context.user._id,
            }).populate({
                path: "user",
                select: "firstName lastName profileImage company",
            });
        },
        //find a single post
        post: async (parent, { postId }) => {
            if (postId) {
                return await Post.findOne({ _id: postId })
                    .populate("user")
                    .populate("comments")
                    .populate({
                        path: "comments",
                        populate: "user",
                    });
            } else {
                throw new Error("Post not found");
            }
        },
        //find a selected User
        user: async (parent, {}) => {
            return await User.findOne({ _id: context.user._id }).populate(
                "company"
            );
        },
        getChatMessages: async (parent, { companyId }) => {
            try {
                const messages = await ChatMessage.find({ companyId });
                return messages;
            } catch (error) {
                throw new Error("Error getting chat messages");
            }
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
            return { token, user, company };
        },
        //add a new post
        createPost: async (parent, { images, postText }, context) => {
            if (context.user) {
                const post = await Post.create({
                    images,
                    postText,
                    user: context.user._id,
                });
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
        createComment: async (parent, { postId, commentText, images }) => {
            try {
                const post = await Post.findById(postId);
                if (!post) {
                    throw new Error("No post found");
                }
                const newComment = {
                    user: context.user._id,
                    commentText,
                    images,
                    createdAt: new Date().toISOString(),
                };
                post.comments.push(newComment);
                await post.save();
                return newComment;
            } catch (error) {
                console.error(error);
                throw new Error("Error creating comment");
            }
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

        updateComment: async (parent, { postId, commentId, commentText }) => {
            try {
                const post = await Post.findById(postId);
                if (!post) {
                    throw new Error("No post found");
                }
                const comment = post.comments.id(commentId);
                if (!comment) {
                    throw new Error("No comment found");
                }
                comment.commentText = commentText;
                comment.updatedAt = new Date().toISOString();
                await post.save();
                return comment;
            } catch (error) {
                console.error(error);
                throw new Error("Error updating comment");
            }
        },

        removeUser: async (parent, {userId}) => {
            const user = await User.findByIdAndDelete(userId);
            return user;
        },

        removePost: async (parent, { postId }) => {
            const post = await Post.findOneAndDelete({
                _id: postId,
            });
            return post;
        },

        removeComment: async (parent, { postId, commentId }) => {
            try {
                const post = await Post.findById(postId);
                if (!post) {
                    throw new Error("No post found");
                }
                const comment = post.comments.id(commentId);
                if (!comment) {
                    throw new Error("No comment found");
                }
                comment.remove();
                await post.save();
                return comment;
            } catch (error) {
                console.error(error);
                throw new Error("Error deleting comment");
            }
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
        createChatMessage: async (
            parent,
            { companyId, text, sender, name },
            context
        ) => {
            try {
                const newMessage = new ChatMessage({
                    companyId,
                    text,
                    sender,
                    name,
                });
                await newMessage.save();
                return newMessage;
            } catch (error) {
                console.error(error);
                throw new Error("Error creating chat message");
            }
        },
    },
};

module.exports = resolvers;
