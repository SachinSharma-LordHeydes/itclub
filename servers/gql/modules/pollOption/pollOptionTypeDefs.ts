import gql from "graphql-tag";

export const pollOptionTypeDefs = gql`
  type PollOption {
    id: String!
    text: String!
    pollId: String!
    #votes: [Vote!]!
  }
`;
