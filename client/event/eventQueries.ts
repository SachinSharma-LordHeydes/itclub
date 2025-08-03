import { gql } from "@apollo/client";
export const GET_EVENTS = gql`
  query GetEvents {
    getEvents {
      title
      type
      host {
        first_name
      }
    }
  }
`;
