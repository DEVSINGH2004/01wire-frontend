import { gql } from "@apollo/client";

export interface PublicationCreateInput {
  title: string;
  image: string;
  categories: [string];
  linkType: string;
  url: string;
  timeline: string;
  price: number;
  stats: {
    da: number;
    pa: number;
    dr: number;
    ur: number;
    traffic: number;
  };
}
export interface ICreatePublicationVars {
  params: PublicationCreateInput;
}
export const CREATE_PUBLICATION = gql`
  mutation createPublication($params: PublicationCreateInput!) {
    createPublication(params: $params) {
      id
      title
      image
    }
  }
`;
