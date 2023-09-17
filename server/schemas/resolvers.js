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
                const companyId = context.user.companyId; // changed to companyId from company
                const params = companyId ? { companyId: companyId } : {}; //
                const users = await User.find(params).populate("companyId"); //changed to companyId

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
            // check if user is logged in
            if (context.user) {
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
                    select: "firstName lastName profileImage companyId", //changed from company to companyId
                });
            } else {
                throw new AuthenticationError("Not logged in");
            }
        },
        //find a single post
        post: async (parent, { postId }, context) => {
            //check if logged in
            if (context.user) {
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
            } else {
                throw new AuthenticationError("Not logged in");
            }
        },
        //find a selected User
        user: async (parent, {}, context) => {
            if (context.user) {
                return await User.findOne({ _id: context.user._id }).populate(
                  "companyId" //changed from company to companyId
                );
            } else {
                throw new AuthenticationError("Not logged in");
            }
        },
        getChatMessages: async (parent, { companyId }, context) => {
            if (context.user) {
                try {
                    const messages = await ChatMessage.find({ companyId });
                    return messages;
                } catch (error) {
                    throw new Error("Error getting chat messages");
                }
            } else {
                throw new AuthenticationError("Not logged in");
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
                companyId, //changed from company to companyId
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
                companyId, //changed from company to companyId
                title,
                email,
                phone,
                password,
                profileImage,
            });

            const token = signToken(user); //create company id to payload of token
            return { token, user, companyId }; //changed from company to companyId
        },
        //add a new post
        createPost: async (parent, { images, postText, companyId }, context) => {
            // check if user is logged in and is owner or admin role
            if (
                (context.user && context.user.role == "Owner") ||
                context.user.role == "Admin"
            ) {
                const post = await Post.create({
                    companyId,
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
            throw new AuthenticationError(
                "You need to be logged in and be and admin/owner to create a post"
            );
        },

        //add a new comment
        createComment: async (parent, { postId, commentText, images }, context) => {
            if (context.user) {
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
            } else {
                throw new AuthenticationError(
                    "You need to be logged in to create a comment"
                );
            }
        },

        //login
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email }).populate("companyId"); //changed from company to companyId
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
              companyId: user.companyId, // changed from company._id,
            });
            return { token, user };
        },

        updateCompany: async (parent, { name, type, logo }, context) => {
            if (context.user.role == "Owner") {
                const updatedCompany = await Company.findOneAndUpdate(
                    { name, type, logo },
                    { new: true }
                );
                return updatedCompany;
            } else {
                throw new AuthenticationError(
                    "You need to be logged in and be an owner to update a company"
                );
            }
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

        updatePost: async (parent, { postId, images, postText }, context) => {
            if (
                (context.user && context.user.role == "Admin") ||
                context.user.role == "Owner"
            ) {
                const updatedPost = await Post.findOneAndUpdate(
                    { _id: postId },
                    { images, postText },
                    { new: true }
                );
                return updatedPost;
            } else {
                throw new AuthenticationError(
                    "You need to be logged in and be an admin/owner to update a post"
                );
            }
        },

        updateComment: async (parent, { postId, commentId, commentText }, context) => {
            if (context.user) {
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
            } else {
                throw new AuthenticationError(
                    "You need to be logged in to update a comment"
                );
            }
        },

        removeUser: async (parent, { userId }, context) => {
            if (
                context.user.role == "Owner" ||
                context.user.role == "Admin"
            ) {
                const user = await User.findById(userId);

                 if (!user) {
                    throw new Error("User not found");
                 }
                
                await User.findByIdAndDelete(userId);

                if (user.companyId) {
                  const company = await Company.findById(user.companyId); //changed from company to companyId

                  if (company) {
                    company.users.pull(userId);
                    await company.save();
                  }
                }
                return user;
            } else {
                throw new AuthenticationError(
                    "You need to be logged in and be an owner/admin to delete a user"
                );
            }
        },

        removeCompany: async (parent, { companyId }, context) => {
            if (context.user.role.includes("Owner")) {
                try {
                    await User.deleteMany({ companyId });
                    await ChatMessage.deleteMany({ companyId });
                    await Post.deleteMany({ companyId });
                    await Company.findByIdAndDelete(companyId);
                    return null;
                } catch (error) {
                    console.error(error);
                    throw new Error("Error removing company");
                }
            } else {
                throw new AuthenticationError(
                    "You need to be logged in and be an owner to delete a company"
                );
            }
        },

        removePost: async (parent, { postId }, context) => {
            if (
                context.user.role == "Owner" ||
                context.user.role == "Admin"
            ) {
                const post = await Post.findOneAndDelete({
                    _id: postId,
                });
                return post;
            } else {
                throw new AuthenticationError(
                    "You need to be logged in and be an owner/admin to delete a post"
                );
            }
        },

        removeComment: async (parent, { postId, commentId }, context) => {
            if (context.user) {
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
            } else {
                throw new AuthenticationError(
                    "You need to be logged in to delete a comment"
                );
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
            if (context.user) {
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
            } else {
                throw new AuthenticationError(
                    "You need to be logged in to create a chat message"
                );
            }
        },
    },
};

module.exports = resolvers;
