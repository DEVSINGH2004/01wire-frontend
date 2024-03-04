import { HttpLink, ApolloLink , concat, InMemoryCache, ApolloClient} from "@apollo/client";

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
  }

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,

    },
  }));

  return forward(operation);
})




const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_SERVER_URL,
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
 
});
