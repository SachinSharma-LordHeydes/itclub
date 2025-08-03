import { gql } from "@apollo/client";
export const GET_RESOURCE = gql`
  query GetResource($id: ID!) {
    getResource(id: $id) {
      category
      createdAt
      user {
        first_name
      }
      description
      document_type
      resourceLink
      title
    }
  }
`;

export const CREATE_RESOURCE = gql`
  mutation CreateResource(
    $title: String!
    $description: String!
    $category: String!
    $document_type: String!
    $resourceLink: [String!]!
  ) {
    createResource(
      description: $description
      category: $category
      document_type: $document_type
      resourceLink: $resourceLink
      title: $title
    ) {
      id
    }
  }
`;

export const GET_RESOURCES = gql`
  query GetResources($limit: Int, $offset: Int) {
    getResources(limit: $limit, offset: $offset) {
      title
      document_type
      createdAt
      user {
        first_name
      }
    }
  }
`;

export const UPDATE_RESOURCE = gql`
  mutation UpdateResource(
    $id: ID!
    $title: String!
    $description: String!
    $document_type: String!
    $category: String!
    $resourceLink: [String!]!
  ) {
    updateResource(
      id: $id
      title: $title
      description: $description
      document_type: $document_type
      category: $category
      resourceLink: $resourceLink
    ) {
      id
    }
  }
`;

export const DELETE_RESOURCE = gql`
  mutation DeleteResource($id: ID!) {
    deleteResource(id: $id)
  }
`;
