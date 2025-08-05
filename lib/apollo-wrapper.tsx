"use client";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

export default function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = useAuth();

  const client = useMemo(() => {
    const httpLink = createHttpLink({
      // uri: "http://localhost:3000//api/graphql",
      uri: `${process.env.NEXT_PUBLIC_RUN_DEV}/api/graphql`,
    });

    const authLink = setContext(async (_, { headers }) => {
      try {
        const token = await getToken();
        console.log("Apollo auth token acquired:", !!token);
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
          },
        };
      } catch (error) {
        console.error("Error getting auth token:", error);
        return {
          headers: {
            ...headers,
          },
        };
      }
    });

    return new ApolloClient({
      link: from([authLink, httpLink]),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          errorPolicy: "all",
        },
        query: {
          errorPolicy: "all",
        },
      },
    });
  }, [getToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
