import { gql } from "@apollo/client";

export interface PublicationUpdateInput {
  id: string;
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
export interface IUpdatePublicationVars {
  params: PublicationUpdateInput;
}
export const UPDATE_PUBLICATION = gql`
  mutation updatePublication($params: PublicationUpdateInput!) {
    updatePublication(params: $params) {
      id
    }
  }
`;
