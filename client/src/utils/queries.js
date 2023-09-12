export const QUERY_ME = gql`
  query me {
    me {
      token
      user {
        firstName
        lastName
        email
      }
    }
  }
`;
