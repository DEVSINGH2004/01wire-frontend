import { gql } from "@apollo/client";

import { PaginationInput, EstimateData } from "types";

export interface EstimateFilterInput {
  id?: string;
  userId?: string;
  publicationIds?: string[];
  bundleIds?: string[];
  totalCredits?: number;
  startTime?: string;
  endTime?: string;
}

export interface IGetEstimatesVars {
  paginationInput: PaginationInput;
  filterInput: EstimateFilterInput;
}

export interface IGetEstimates {
  filterEstimatesPaginated: EstimateData;
}

export const GET_ESTIMATES = gql`
  query filterEstimatesPaginated(
    $paginationInput: PaginationInput!
    $filterInput: ArticleFilterInput!
  ) {
    filterEstimatesPaginated(paginationInput: $paginationInput, filterInput: $filterInput) {
      data {
        id
        userId
        publicationIds
        bundleIds
        totalCredits
        createdAt
        updatedAt
        publicationInfo {
          id
          title
          image
          stats
          price
          linkType
        }
      }
      paginationInfo {
        currentPage
        perPage
        pageCount
        itemCount
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
