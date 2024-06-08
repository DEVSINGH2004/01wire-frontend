import { gql } from "@apollo/client";
import { PaginationInput, OrderData } from "types";

export interface OrderFilterInput {
  id?: string;
  userId?: string;
  articleId?: string;
  publicationId?: string;
  bundleId?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}

export interface IGetOrdersVars {
  paginationInput: PaginationInput;
  filterInput: OrderFilterInput;
}

export interface IGetOrders {
  filterOrdersPaginated: OrderData;
}

export const GET_ORDERS = gql`
  query filterOrdersPaginated($paginationInput: PaginationInput!, $filterInput: OrderFilterInput!) {
    filterOrdersPaginated(paginationInput: $paginationInput, filterInput: $filterInput) {
      data {
        id
        userId
        articleId
        publicationId
        bundleId
        status
        notes
        publishAt
        publishBy
        createdAt
        updatedAt
        articleInfo {
          id
          title
        }
        bundleInfo {
          id
          type
        }
        publicationInfo {
          id
          title
        }
      }
      paginationInfo {
        currentPage
        perPage
        pageCount
        itemCount
        hasNextPage
      }
    }
  }
`;
