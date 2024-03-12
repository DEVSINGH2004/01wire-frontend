import { gql } from '@apollo/client';

export interface ClientCreateInput {
  title: string;
  phone: string;
}
export interface ICreateClientVars {
  params: ClientCreateInput;
}
export const CREATE_CLIENT = gql`
  mutation createClient($params: ClientCreateInput!) {
    createClient(params: $params) {
     id
     link
    }
  }
`;
