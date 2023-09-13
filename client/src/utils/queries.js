import gql from 'graphql-tag';

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
