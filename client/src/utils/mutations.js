import { gql } from "@apollo/client";

export const CREATE_COMPANY = gql`
    mutation createCompany($name: String!, $type: String!, $logo: String) {
        createCompany(name: $name, type: $type, logo: $logo) {
            _id
            name
            type
            logo
        }
    }
`;

export const CREATE_USER = gql`
    mutation createUser(
        $firstName: String!
        $lastName: String!
        $email: String!
        $password: String!
        $companyId: String
        $role: String
        $phone: String
        $title: String
    ) {
        createUser(
            firstName: $firstName
            lastName: $lastName
            email: $email
            password: $password
            companyId: $companyId
            role: $role
            phone: $phone
            title: $title
        ) {
            token
            user {
                _id
                email
                firstName
                lastName
                companyId {
                    _id
                    name
                    type
                    logo
                }
            }
        }
    }
`;

export const ADD_USER_TO_COMPANY = gql`
    mutation addUserToCompany($companyId: ID!, $userId: ID!) {
        addUserToCompany(companyId: $companyId, userId: $userId) {
            _id
            name
            type
            logo
            users {
                _id
                firstName
                lastName
                email
            }
        }
    }
`;

export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                firstName
                lastName
            }
        }
    }
`;

export const CREATE_POST = gql`
    mutation createPost(
        $postText: String!
        $images: [String]
        $companyId: String
    ) {
        createPost(
            postText: $postText
            images: $images
            companyId: $companyId
        ) {
            _id
            postText
        }
    }
`;

export const REMOVE_POST = gql`
    mutation removePost($postId: ID!) {
        removePost(postId: $postId) {
            _id
            postText
            images
        }
    }
`;

export const UPDATE_POST = gql`
    mutation updatePost($postId: ID!, $postText: String!, $images: [String]) {
        updatePost(postId: $postId, postText: $postText, images: $images) {
            _id
            postText
            images
        }
    }
`;

export const CREATE_CHAT_MESSAGE = gql`
    mutation createChatMessage(
        $companyId: ID!
        $text: String!
        $sender: String!
        $name: String!
    ) {
        createChatMessage(
            companyId: $companyId
            text: $text
            sender: $sender
            name: $name
        ) {
            _id
            companyId
            text
            sender
            name
        }
    }
`;

export const CREATE_COMMENT = gql`
    mutation createComment($postId: ID!, $commentText: String!) {
        createComment(postId: $postId, commentText: $commentText) {
            _id
            commentText
        }
    }
`;

export const REMOVE_COMMENT = gql`
    mutation removeComment($postId: ID!, $commentId: ID!) {
        removeComment(postId: $postId, commentId: $commentId) {
            _id
            commentText
        }
    }
`;

export const CREATE_MSG_CNT = gql`
    mutation createMsgCnt($companyId: ID!, $userId: ID!, $count: Int!) {
        createMsgCnt(companyId: $companyId, userId: $userId, count: $count) {
            companyId
            userId
            count
        }
    }
`;

export const UPDATE_COMMENT = gql`
    mutation updateComment(
        $postId: ID!
        $commentId: ID!
        $commentText: String!
    ) {
        updateComment(
            postId: $postId
            commentId: $commentId
            commentText: $commentText
        ) {
            _id
            commentText
            updatedAt
        }
    }
`;

export const REMOVE_USER = gql`
    mutation RemoveUser($userId: ID!) {
        removeUser(userId: $userId) {
            _id
        }
    }
`;

export const REMOVE_COMPANY = gql`
    mutation RemoveCompany($companyId: ID!) {
        removeCompany(companyId: $companyId) {
            _id
        }
    }
`;
