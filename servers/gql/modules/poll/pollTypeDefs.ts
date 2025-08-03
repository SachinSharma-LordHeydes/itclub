import { gql } from "graphql-tag";

export const pollTypeDefs = gql`
  enum PollStatus {
    OPEN
    CLOSE
  }

  type Poll {
    id: String!
    adminId: String!
    title: String!
    description: String!
    status: PollStatus!
    expiresAt: String!
    createdAt: String!
    options: [PollOption!]!
    votes: [Vote!]!
  }

  type PollOption {
    id: String!
    text: String!
    pollId: String!
    #votes: [Vote!]!
  }

  type Query {
    getPoll(id: String!): Poll
    getPolls: [Poll!]!
  }

  type Mutation {
    createPoll(
      title: String!
      description: String!
      options: [String!]!
      expiresAt: String!
    ): Poll!

    

    updatePoll(
      id: String!
      title: String
      description: String
      status: PollStatus
      expiresAt: String
      options: [String]
    ): Poll!

    deletePoll(id: String!): Poll!
  }
`;
