import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { RetryLink } from '@apollo/client/link/retry';
import { APOLLO_SERVER_URL } from 'data/constants';

const httpLink = new HttpLink({
  uri: APOLLO_SERVER_URL,
  fetchOptions: 'no-cors',
  fetch
});

// RetryLink is a link that retries requests based on the status code returned.
const retryLink = new RetryLink({
  delay: {
    initial: 100
  },
  attempts: {
    max: 2,
    retryIf: (error) => Boolean(error)
  }
});

export const addressLink = (address: string) => {
  const link = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers }) => ({ headers: {
      authorization: address,
      ...headers
    }}));
    return forward(operation);
  });
  return from([retryLink, link, httpLink])
}

const client = new ApolloClient({
  link: from([retryLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },

  }
});

export const apiQuery = (options) => {
  if (options?.variables?.address) {
    options.variables.address = options.variables.address.toLowerCase();
  }
  return client.query(options)
}

export default client;
