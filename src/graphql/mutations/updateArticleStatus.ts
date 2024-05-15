import { gql } from "@apollo/client";

export interface ArticleUpdateStateInput {
  id: string;
  status: string;
  rejectionReason?: string;
}
export interface IUpdateArticleStatusVars {
  params: ArticleUpdateStateInput;
}
export const UPDATE_ARTICLE_STATUS = gql`
  mutation updateArticleStatus($params: ArticleUpdateStateInput!) {
    updateArticleStatus(params: $params) {
      id
    }
  }
`;
