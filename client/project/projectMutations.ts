import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $title: String!
    $description: String!
    $githubLink: String!
    $liveLink: String
    $tags: [String]
  ) {
    createProject(
      title: $title
      description: $description
      githubLink: $githubLink
      liveLink: $liveLink
      tags: $tags
    ) {
      id
    }
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects($limit: Int, $offset: Int) {
    getProjects(limit: $limit, offset: $offset) {
      description
      githubLink
      id
      likes
      liveLink
      tags
      title
      userId
      user {
        first_name
        clerkId
      }
      likedBy {
        projectId
        user {
          clerkId
        }
      }
    }
  }
`;

export const TOGGLE_PRODUCT_LIKES = gql`
  mutation ToggleProjectLikes($projectId: String!) {
    toggleProjectLikes(projectId: $projectId) {
      liked
    }
  }
`;
