import { gql } from "graphql-tag";

export const voteTypeDefs = gql`
  type Vote {
    id: ID!
    option: PollOption!
    poll: Poll!
    pollId: ID!
    user: User!
    userId: ID!
  }

  extend type Query {
    getVote(id: ID!): Vote
    getVotes(limit: Int, offset: Int): [Vote!]!
  }

  extend type Mutation {
    votePoll(pollId: String!, optionId: String!): Vote!
    deleteVote(id: ID!): Boolean!
  }
`;
