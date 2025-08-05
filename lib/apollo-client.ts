import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri:
    typeof window === 'undefined'
      ? process.env.NEXT_PUBLIC_GRAPHQL_URL
      : '/api/graphql',
});


const authLink = setContext(async (_, { headers }) => {
  // Server-side token (e.g., from Clerk's server-side API if available)
  const token = process.env.CLERK_JWT_TOKEN || null; // Replace with actual server-side token logic
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;