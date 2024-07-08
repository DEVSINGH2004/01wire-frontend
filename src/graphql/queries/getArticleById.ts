import { gql } from "@apollo/client";
import { ArticleType } from "types";

export interface IGetArticleByIdVars {
  id: string;
}

export interface IGetArticleById {
  getArticleById: ArticleType;
}

export const GET_ARTICLE_BY_ID = gql`
  query getArticleById($id: String!) {
    getArticleById(id: $id) {
      id
      userId
      clientId
      title
      content
      language
      summary
      publicationIds
      bundleIds
      featureImage
      featureImageDesc
      status
      category
      publishType
      timezone
      notes
      instructions
      totalCredits
      publishAt
      clientInfo {
        email
        website
        title
        social {
          facebook
          instagram
          linkedIn
          twitter
        }
      }
      bundleInfo {
        id
        category
        publicationIds
        price
        traffic
        type
      }
      publicationInfo {
        id
        categories
        title
        stats {
          dr
          pa
          ur
          da
          traffic
        }
        url
        price
        linkType
        image
      }
      mediaContact {
        name
        email
        phone
        website
        address
        state
        country
        facebook
        instagram
        linkedIn
        twitter
        youtube
        others
      }
    }
  }
`;
