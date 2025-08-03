import { gql } from "graphql-tag";

export const resourceTypeDefs = gql`
  type Resource {
    id: ID!
    user: User!
    userId: ID!
    title: String!
    description: String!
    category: String!
    document_type: String!
    resourceLink: [String!]!
    createdAt: String!
  }

  extend type Query {
    getResource(id: ID!): Resource
    getResources(limit: Int, offset: Int): [Resource!]!
  }

  extend type Mutation {
    createResource(
      title: String!
      description: String!
      category: String!
      document_type: String!
      resourceLink: [String!]!
    ): Resource!
    updateResource(
      id: ID!
      title: String
      description: String
      category: String
      document_type: String
      resourceLink: [String]
    ): Resource
    deleteResource(id: ID!): Boolean!
  }
`;
