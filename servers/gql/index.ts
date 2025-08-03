import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import gql from "graphql-tag";
import { eventResolvers } from "./modules/event/eventResolver";
import { eventTypeDefs } from "./modules/event/eventTypeDefs";
import { pollResolvers } from "./modules/poll/pollResolvers";
import { pollTypeDefs } from "./modules/poll/pollTypeDefs";
import { pollOptionTypeDefs } from "./modules/pollOption/pollOptionTypeDefs";
import { projectResolvers } from "./modules/project/projectResolvers";
import { projectTypeDefs } from "./modules/project/projectTypeDefs";
import { resourceResolvers } from "./modules/resource/resourceResolvers";
import { resourceTypeDefs } from "./modules/resource/resourceTypeDefs";
import { userResolvers } from "./modules/user/userResolver";
import { userTypeDefs } from "./modules/user/userTypeDefs";
import { voteResolvers } from "./modules/vote/voteResolvers";
import { voteTypeDefs } from "./modules/vote/voteTypeDefs";

const rootTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const typeDefs = mergeTypeDefs([
  rootTypeDefs,
  
  userTypeDefs,
  eventTypeDefs,
  projectTypeDefs,
  resourceTypeDefs,
  pollTypeDefs,
  voteTypeDefs,
  pollOptionTypeDefs,
]);

const resolvers = mergeResolvers([
  userResolvers,
  eventResolvers,
  projectResolvers,
  resourceResolvers,
  pollResolvers,
  voteResolvers,
  // ratingResolvers,
]);

export const schema = makeExecutableSchema({ typeDefs, resolvers });
