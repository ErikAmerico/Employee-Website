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
    $company: String
    $role: String
    $phone: String
    $title: String
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      company: $company
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
        company {
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
  mutation createPost($postText: String!, $images: [String]) {
    createPost(postText: $postText, images: $images) {
      postText
    }
  }
`;

// export const CREATE_POST = gql`
//     mutation createPost($postText: String!, $images: [String]) {
//         createPost(postText: $postText, images: $images) {
//             _id
//             postText
//             user {
//                 _id
//                 firstName
//                 lastName
//             }
//             images
//             likes
//             comments {
//                 _id
//                 text
//             }
//         }
//     }
// `;

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
