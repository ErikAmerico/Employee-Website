import gql from "graphql-tag";

export const QUERY_ME = gql`
  query me {
    me {
      token
      user {
        _id
        firstName
        lastName
      }
    }
  }
`;

//get all posts
export const QUERY_POSTS = gql`
  query posts {
    posts {
      _id
      postText
    }
  }
`;

//get all users in a company
export const GET_USERS_BY_COMPANY = gql`
  query users {
    users {
      _id
      firstName
      lastName
      email
      role
      title
      phone
    }
  }
`;
