import { gql } from '@apollo/client';

export interface ISignupVars {
  email: string;
  password: string;
  fullName: string;
}
export interface ISignup {
  status: string;
  token: string;
  expireAt: string;
}
export const SIGNUP = gql`
  mutation signup($email: String!, $password: String!, $fullName: String!) {
    signup(email: $email, password: $password, fullName: $fullName ) {
      status
      token
      expireAt
    }
  }
`;
