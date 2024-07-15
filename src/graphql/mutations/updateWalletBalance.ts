import { gql } from "@apollo/client";

export const UPDATE_WALLET_BALANCE = gql`
  mutation updateWalletBalance($amount: Int!, $notes: String!, $userId: ID!) {
    updateWalletBalance(amount: $amount, notes: $notes, userId: $userId)
  }
`;
