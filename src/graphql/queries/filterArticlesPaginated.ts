import { gql } from '@apollo/client';

import {
  PaginationInput,
  ArticleData
} from "types";


export interface ArticleFilterInput {
  startTime?: string,
  endTime?: string,
}

export interface IGetArticlesVars {
  paginationInput: PaginationInput;
  filters: ArticleFilterInput;
}

export interface IGetArticles {
  filterArticlesPaginated: ArticleData;
}

export const GET_ARTICLES = gql`
  query filterArticlesPaginated($paginationInput: PaginationInput!, $filters: ArticleFilterInput!) {
    filterArticlesPaginated(paginationInput: $paginationInput, filters: $filters) {
      data {
        id
        clientId
        userId
        language
        title
        content
        summary
        featureImage
        featureImageDesc
        articleImages
        status
        category
        publishType
        timezone
        notes
        bundleIds
        publicationIds
        mediaContact {
          name
          email
          phone
          website
          state
          address
          country
          facebook
          instagram
          linkedIn
          linkedIn
          youtube
          others
        }
       
        status
        label
        note
        isStarred
        senderInfo {
          firstName
          lastName
          profilePhotoId
        }
        msgInfo {
          id
          link
          isLinkPublic
          updatedAt
          content {
            text
            webPage {
              url
              siteName
              type
              title
              description
            }
          }
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


