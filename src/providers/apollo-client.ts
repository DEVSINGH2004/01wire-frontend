import { HttpLink, ApolloLink, concat, InMemoryCache, ApolloClient } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { onError } from "@apollo/client/link/error";

const handleTokenExpiry = () => {
  localStorage.removeItem("token");
  window.location.href = "/sign-in";
};

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }

  operation.setContext(({ headers = {} }) => {
    if (token) {
      const { exp }: any = jwtDecode(token);
      const expirationTime = exp * 1000;
      if (Date.now() >= expirationTime) {
        handleTokenExpiry();
      }
    }
    return {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    };
  });

  return forward(operation);
});

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_SERVER_URL,
});
const errorLink = onError(({ operation, graphQLErrors }) => {
  const { response } = operation.getContext();
  if (response?.status === 500) {
    if (graphQLErrors?.length) {
      if (graphQLErrors[0]?.message === "Context creation failed: invalid signature") {
        if (typeof window !== "undefined") {
          handleTokenExpiry();
        }
      }
    }
  }
});
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([authMiddleware, errorLink, httpLink]),
});
