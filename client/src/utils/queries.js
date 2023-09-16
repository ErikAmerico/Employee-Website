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
      createdAt
      user {
        firstName
        lastName
      }
    }
  }
`;

//get one post
export const QUERY_SINGLE_POST = gql`
  query singlePost($postId: ID!) {
    post(postId: $postId) {
      _id
      postText
      createdAt
      user {
        firstName
        lastName
      }
      comments {
        _id
        commentText
        createdAt
        user {
          firstName
          lastName
        }
      }
    }
  }
`;

//get all comments
export const QUERY_COMMENTS = gql`
  query comments {
    comments {
      _id
      commentText
      createdAt
      user {
        firstName
        lastName
      }
    }
  }
`;


//get all users in a company
export const GET_USERS_BY_COMPANY = gql`
  query getUsersByCompany($companyId: ID!) {
    users (companyId: $companyId) {
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

export const GET_PREV_CHAT_MESSAGES = gql`
  query getPrevChatMessages($companyId: ID!) {
    getChatMessages(companyId: $companyId) {
      _id
      companyId
      text
      sender
      name
    }
  }
`;
