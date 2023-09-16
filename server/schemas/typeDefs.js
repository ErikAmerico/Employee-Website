const typeDefs = `
    type Company {
        _id: ID!
        name: String
        type: String
        users: [User]
        logo: String
    }

    input CompanyInput {
        name: String
        type: String
        logo: String
    }

    type User {
        _id: ID!
        firstName: String
        lastName: String
        role: String
        title: String
        company: Company
        email: String
        phone: String
        password: String
        profileImage: String
        posts: [Post]
    }

    input UserInput {
        firstName: String
        lastName: String
        role: String
        title: String
        email: String
        phone: String
        password: String
    }

    type Post {
        _id: ID!
        user: User!
        images: [String]
        postText: String!
        createdAt: String
        updatedAt: String
        likes: Int
        comments: [Comment]
    }
     
    type Comment {
        _id: ID!
        commentId: ID
        post: Post
        user: User
        text: String
        images: [String]
        createdAt: String
        updatedAt: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type ChatMessage {
        _id: ID!
        companyId: ID!
        text: String!
        sender: String!
        name: String!
    }

    input ChatMessageInput {
        companyId: ID!
        text: String!
        sender: String!
        name: String!
    }

    type Query {
        company(companyId: ID!): Company
        user(userId: ID!): User
        post(postId: ID!): Post
        comment(commentId: ID!): Comment
        me: User
        users(companyId: ID): [User]
        posts(companyId: ID): [Post]
        getChatMessages(companyId: ID!): [ChatMessage]
    }

    type Mutation {
        createCompany(name: String!, type: String!, logo: String): Company
        createUser(firstName: String!, lastName: String!, company: String, role: String, title: String, email: String!, phone: String, password: String!, profileImage: String): Auth
        createPost(postText: String!, images: [String]): Post
        createComment(postId: ID!, text: String image: String): Comment
        login(email: String!, password: String!): Auth
        updateCompany(companyId: ID!, name: String, type: String, logo: String): Company
        updateUser(userId: ID!, firstName: String, lastName: String, role: String, title: String, email: String, phone: String, password: String, profileImage: String): User
        updatePost(postId: ID!, images: [String], postText: String): Post
        updateComment(commentId: ID!, text: String, image: String): Comment
        removeUser(userId: ID!): User
        removePost(postId: ID!): Post
        removeComment(commentId: ID!): Comment
        addUserToCompany(companyId: ID!, userId: ID!): Company
        createChatMessage(companyId: ID!, text: String!, sender: String!, name: String!): ChatMessage
    }
`;

module.exports = typeDefs;
