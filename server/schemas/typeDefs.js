const typeDefs = `
    type Company {
        _id: ID
        companyId: String
        name: String
        type: String
        users: [User]
        logo: String
    }

    type User {
        _id: ID
        userId: String
        name: String
        role: String
        title: String
        company: Company
        email: String
        phone: String
        password: String
        profileImage: String
        posts: [Post]
    }

    type Post {
        _id: ID
        postId: String
        user: User
        images: [String]
        text: String
        createdAt: String
        updatedAt: String
        likes: Int
        comments: [Comment]
    }
     
    type Comment {
        _id: ID
        commentId: String
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

    type Query {
        company(companyId: String!): Company
        user(userId: String!): User
        post(postId: String!): Post
        comment(commentId: String!): Comment
        me: User
    }

    type Mutation {
        addCompany(name: String!, type: String!, logo: String): Company
        addUser(name: String!, role: String!, title: String!, email: String!, phone: String!, password: String!, profileImage: String): Auth
        addPost(images: [String], text: String): Post
        addComment(postId: String!, text: String image: String): Comment
        login(email: String!, password: String!): Auth
        updateCompany(companyId: String!, name: String, type: String, logo: String): Company
        updateUser(userId: String!, name: String, role: String, title: String, email: String, phone: String, password: String, profileImage: String): User
        updatePost(postId: String!, images: [String], text: String): Post
        updateComment(commentId: String!, text: String, image: String): Comment
        removeUser(userId: String!): User
        removePost(postId: String!): Post
        removeComment(commentId: String!): Comment
    }
`;

module.exports = typeDefs;