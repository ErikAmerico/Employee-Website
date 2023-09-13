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
