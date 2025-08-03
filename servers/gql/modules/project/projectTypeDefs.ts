import { gql } from "graphql-tag";

export const projectTypeDefs = gql`
  type Project {
    id: ID!
    title: String!
    description: String!
    tags: [String]
    likes: Int
    likedBy: [Like]
    createdAt: String!
    githubLink: String!
    liveLink: String
    user: User!
    userId: ID!
  }
  type ToggleLikeResponse {
    liked: Boolean!
  }
  extend type Query {
    getProject(id: ID!): Project
    getProjects(limit: Int, offset: Int): [Project!]!
  }

  extend type Mutation {
    createProject(
      title: String!
      description: String!
      tags: [String]
      githubLink: String!
      liveLink: String
    ): Project!

    updateProject(
      id: ID!
      title: String
      description: String
      tags: [String]
      githubLink: String
      liveLink: String
    ): Project

    toggleProjectLikes(projectId: String!): ToggleLikeResponse

    deleteProject(id: ID!): Boolean!
  }
`;
