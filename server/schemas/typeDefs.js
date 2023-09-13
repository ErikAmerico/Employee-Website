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
        users(companyId: String): [User]
        posts(companyId: String): [Post]
    }

    type Mutation {
        createCompany(name: String!, type: String!, logo: String): Company
        createUser(firstName: String!, lastName: String!, role: String, title: String, email: String!, phone: String, password: String!, profileImage: String): Auth
        createPost(postText: String!, images: [String]): Post
        createComment(postId: String!, text: String image: String): Comment
        login(email: String!, password: String!): Auth
        updateCompany(companyId: String!, name: String, type: String, logo: String): Company
        updateUser(userId: String!, firstName: String, lastName: String, role: String, title: String, email: String, phone: String, password: String, profileImage: String): User
        updatePost(postId: String!, images: [String], text: String): Post
        updateComment(commentId: String!, text: String, image: String): Comment
        removeUser(userId: String!): User
        removePost(postId: ID!): Post
        removeComment(commentId: String!): Comment
        addUserToCompany(companyId: ID!, userId: ID!): Company
    }
`;

module.exports = typeDefs;
