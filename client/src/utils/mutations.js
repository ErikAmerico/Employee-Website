import { gql } from "@apollo/client";

export const ADD_COMPANY = gql`
  mutation AddCompany($name: String!, $type: String!, $logo: String) {
    addCompany(name: $name, type: $type, logo: $logo) {
      _id
      companyId
      name
      type
      logo
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser(
    $firstName: String!
    $lastName: String!
    $role: String!
    $title: String!
    $email: String!
    $phone: String!
    $password: String!
    $profileImage: String
  ) {
    addUser(
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
