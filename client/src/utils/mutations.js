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
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      token
      user {
        _id
        email
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
        name
        role
        title
        company {
          _id
          name
          type
          logo
        }
        email
        phone
        profileImage
      }
    }
  }
`;
