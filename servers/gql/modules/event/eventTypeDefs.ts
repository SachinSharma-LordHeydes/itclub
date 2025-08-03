import { gql } from "graphql-tag";

export const eventTypeDefs = gql`
  type Event {
    id: ID!
    host: User
    userId: ID!
    title: String!
    description: String!
    type: String!
    guest: String
    location: String!
    tags: String
    time: String!
    participant: Int
    createdAt: String!
  }

  extend type Query {
    getEvent(id: ID!): Event
    getEvents: [Event!]!
  }

  extend type Mutation {
    createEvent(
      title: String!
      description: String!
      type: String!
      guest: String
      location: String!
      tags: String
      datetime: String!
      
      participant: Int
    ): Event!
    
    updateEvent(
      id: ID!
      title: String
      description: String
      type: String
      guest: String
      location: String
      tags: String
      datetime: String # Same as create mutation
      participant: Int
    ): Event
    
    deleteEvent(id: ID!): Boolean!
  }
`;