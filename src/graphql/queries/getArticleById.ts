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
      publishAt
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
