'use client';

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth } from '@clerk/nextjs';

const httpLink = createHttpLink({
  uri: '/api/graphql',
});

function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  const authLink = setContext(async (_, { headers }) => {
    const token = await getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default ApolloWrapper;
