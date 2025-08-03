import { createYoga } from "graphql-yoga";
import { createContext } from "@/servers/gql/context";
import { schema }       from "../../../servers/gql/index";

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Request, Response },
  context: async ({ request }) => {
    return await createContext(request);
  },
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000']
      : ['http://localhost:3000'],
    credentials: true,
  },
});

export { handleRequest as GET, handleRequest as POST };