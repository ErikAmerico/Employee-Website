import { gql } from "@apollo/client";

export const CREATE_COMPANY = gql`
  mutation createCompany($name: String!, $type: String!, $logo: String) {
    createCompany(name: $name, type: $type, logo: $logo) {
      _id
      companyId
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
    $role: String!
    $title: String!
    $email: String!
    $phone: String!
    $password: String!
    $profileImage: String
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      role: $role
      title: $title
      email: $email
      phone: $phone
      password: $password
      profileImage: $profileImage
    ) {
      token
      user {
        email
        firstName
        lastName
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
        userId
        name
        role
        title
        company {
          _id
          companyId
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
