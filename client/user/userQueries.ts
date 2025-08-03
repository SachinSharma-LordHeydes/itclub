import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser {
    getUser {
      first_name
      events {
        id
      }
      projects {
        id
      }
      resources {
        id
      }
    }
  }
`;

export const GET_USER_ROLE = gql`
  query GetUser {
    getUser {
      role
    }
  }
`;
