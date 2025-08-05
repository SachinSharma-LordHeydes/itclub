import { createContext } from "@/servers/gql/context";
import { createYoga } from "graphql-yoga";
import type { NextRequest } from "next/server";
import { schema } from "../../../servers/gql/index";

const yoga = createYoga<{
  req: NextRequest;
}>({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Request, Response },
  context: async ({ request }) => {
    return await createContext(request);
  },
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? [
            process.env.NEXT_PUBLIC_APP_URL ||
              "https://itclub-xi.vercel.app"
          ]
        : ["https://itclub-xi.vercel.app"],
    credentials: true,
  },
});

export async function GET(request: NextRequest) {
  return yoga.handleRequest(request, { req: request });
}

export async function POST(request: NextRequest) {
  return yoga.handleRequest(request, { req: request });
}
