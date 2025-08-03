import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  enum Role {
    USER
    ADMIN
  }

  type Like {
    id: ID!
    userId: String!
    user: User
    projectId: String
    project: Project
    createdAt: String
  }

  type User {
    id: ID!
    clerkId: String!
    email: String!
    first_name: String
    role: Role
    createdAt: String!
    events: [Event!]!
    projects: [Project]
    resources: [Resource]
    polls: [Poll]
    votes: [Vote]
    likes: [Like]
  }

  extend type Query {
    getUser(id: ID): User
    getUsers(limit: Int, offset: Int): [User!]!
  }

  extend type Mutation {
    updateUser(first_name: String): User
  }
`;
