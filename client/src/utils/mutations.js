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
    mutation createUser($user: UserInput, $company: CompanyInput) {
        createUser(user: $user, company: $company) {
            token
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
