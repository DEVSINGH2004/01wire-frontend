import { gql } from '@apollo/client';

export interface ClientUpdateInput {
  id: string
  title: string;
  phone: string;
}
export interface IUpdateClientVars {
  params: ClientUpdateInput;
}
export const UPDATE_CLIENT = gql`
  mutation updateClient($params: ClientUpdateInput!) {
    updateClient(params: $params) {
     id
    }
  }
`;
