"use client"
import {
  CREATE_PROJECT,
  GET_PROJECTS,
  TOGGLE_PRODUCT_LIKES,
} from "@/client/project/projectMutations";
import { useMutation, useQuery } from "@apollo/client";
import { useAuth } from "@clerk/nextjs";
import {
  Calendar,
  Code,
  ExternalLink,
  Github,
  Heart,
  Loader,
  Plus,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTech, setFilterTech] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [likedProjects, setLikedProjects] = useState<string[]>([]);
  const [starredProjects, setStarredProjects] = useState<string[]>([]);
  const [myProjects, setMyProjects] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubLink: "",
    liveLink: "",
    tags: [] as string[],
  });
  const [currentTag, setCurrentTag] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const { userId } = useAuth();

  const [
    createProject,
    { loading: mutationProjectLoading, error: mutationProjectError },
  ] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: GET_PROJECTS }],
  });

  const [
    toggleProjectLikes,
    {
      loading: mutationtoggleProjectLikesLoading,
      error: mutationtoggleProjectLikesError,
    },
  ] = useMutation(TOGGLE_PRODUCT_LIKES);

  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
  } = useQuery(GET_PROJECTS);

  const popularTags = [
    "React",
    "Vue.js",
    "Angular",
    "Node.js",
    "Express",
    "Next.js",
    "Nuxt.js",
    "JavaScript",
    "TypeScript",
    "Python",
  ];

  const projects = projectData?.getProjects || [];

  useEffect(() => {
    if (projectData?.getProjects && userId) {
      const liked = projectData.getProjects
        .filter((project: any) =>
          project.likedBy?.some((like: any) => like.user?.clerkId === userId)
        )
        .map((project: any) => project.id);
      setLikedProjects(liked);
    }
  }, [projectData, userId]);

  const tabs = useMemo(
    () => [
      { id: "all", label: "All Projects", count: projects.length },
      {
        id: "my",
        label: "My Projects",
        count: projects.filter(
          (project: any) => project.user.clerkId === userId
        ).length,
      },
      { id: "liked", label: "Liked", count: likedProjects.length },
      { id: "add", label: "Add Project", icon: Plus, isAction: true },
    ],
    [projects.length, myProjects.length, likedProjects.length]
  );

  const allTechnologies = useMemo(
    () => [...new Set(projects.flatMap((p: any) => p.tags))].sort(),
    [projects]
  );

  const getFilteredProjectsByTab = useMemo(() => {
    switch (activeTab) {
      case "my":
        return projects.filter(
          (project: any) => userId === project.user.clerkId
        );
      case "liked":
        return projects.filter((project: any) =>
          likedProjects.includes(project.id)
        );
      case "starred":
        return projects.filter((project: any) =>
          starredProjects.includes(project.id)
        );
      default:
        return projects;
    }
  }, [activeTab, projects, myProjects, likedProjects, starredProjects]);

  const filteredProjects = useMemo(() => {
    return getFilteredProjectsByTab.filter((project: any) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some((tech: string) =>
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        project.user.first_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesTech =
        filterTech === "all" || project.tags.includes(filterTech);

      return matchesSearch && matchesTech;
    });
  }, [getFilteredProjectsByTab, searchTerm, filterTech]);

  const getTechColor = (tech: string) => {
    const colors = {
      React: "bg-blue-100 text-blue-800 border-blue-200",
      "Vue.js": "bg-green-100 text-green-800 border-green-200",
      "Node.js": "bg-green-100 text-green-800 border-green-200",
      Python: "bg-yellow-100 text-yellow-800 border-yellow-200",
      JavaScript: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[tech] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const toggleLike = async (
    e: React.MouseEvent<HTMLButtonElement>,
    projectId: string
  ) => {
    e.preventDefault();
    const previousLikedProjects = [...likedProjects];
    setLikedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
    try {
      await toggleProjectLikes({
        variables: { projectId },
        update: (cache, { data }) => {
          const updatedLikes = data.toggleProjectLikes?.likes || 0;
          cache.modify({
            id: cache.identify({ __typename: "Project", id: projectId }),
            fields: {
              likes() {
                return updatedLikes;
              },
              likedBy(existingLikes = []) {
                const isLiked = existingLikes.some(
                  (like: any) => like.user?.clerkId === userId
                );
                if (isLiked) {
                  return existingLikes.filter(
                    (like: any) => like.user?.clerkId !== userId
                  );
                } else {
                  return [
                    ...existingLikes,
                    {
                      __typename: "Like",
                      user: { __typename: "User", clerkId: userId },
                    },
                  ];
                }
              },
            },
          });
        },
      });
      console.log("Like toggled successfully");
    } catch (error: any) {
      console.error("Toggle like error", error);
      setLikedProjects(previousLikedProjects);
    }
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === "add") {
      setShowAddModal(true);
      return;
    }
    setActiveTab(tabId);
  };

  // ... rest of the form handlers (unchanged)

  if (projectLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">
          Error loading projects: {projectError.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      {/* ... other JSX */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredProjects.map((project: any) => {
          if (!project.likedBy) {
            console.log(`Project ${project.id} has no likedBy field`);
          }
          return (
            <div
              key={project.id}
              className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                    <Code className="h-6 w-6 text-blue-600" />
                  </div>
                  <button
                    onClick={(e) => toggleLike(e, project.id)}
                    className={`flex items-center space-x-1 transition-all duration-200 hover:scale-110 ${
                      project.likedBy?.some(
                        (like: any) => like.user?.clerkId === userId
                      )
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        project.likedBy?.some(
                          (like: any) => like.user?.clerkId === userId
                        )
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                    <span className="text-sm font-medium">{project.likes}</span>
                  </button>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags
                    .slice(0, 3)
                    .map((tech: string, index: number) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 ${getTechColor(
                          tech
                        )}`}
                      >
                        {tech}
                      </span>
                    ))}
                  {project.tags.length > 3 && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-2">
                    <img
                      src={project.user.avatar}
                      alt={project.user.first_name}
                      className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                    />
                    <span className="font-medium">
                      {project.user.first_name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <a
                    href={project.githubLink}
                    className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-all duration-200 font-medium flex items-center justify-center space-x-2 hover:scale-105"
                  >
                    <Github className="h-4 w-4" />
                    <span>Code</span>
                  </a>
                  {project.liveLink ? (
                    <a
                      href={project.liveLink}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2 hover:scale-105"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Demo</span>
                    </a>
                  ) : (
                    <div className="flex-1 bg-gray-200 text-gray-500 py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 cursor-not-allowed">
                      <ExternalLink className="h-4 w-4" />
                      <span>No Demo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* ... rest of the JSX */}
    </div>
  );
};

export default Projects;
