import { gql } from "@apollo/client";

export interface TransactionCreateInput {
  kind: string;
}
export interface ICreateTransactionVars {
  params: TransactionCreateInput;
}
export const CREATE_TRANSACTION = gql`
  mutation createTransaction($params: TransactionCreateInput!) {
    createTransaction(params: $params) {
      id
      userId
      status
      type
      kind
      amount
      createdAt
      updatedAt
    }
  }
`;
