"use client";

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
  FileText,
  Github,
  Heart,
  Link,
  Loader,
  Plus,
  Search,
  Tag,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

interface User {
  clerkId: string;
  first_name: string;
  avatar: string;
}

interface Like {
  user: User;
}

interface Project {
  id: string;
  title: string;
  description: string;
  githubLink: string;
  liveLink?: string;
  tags: string[];
  likes: number;
  likedBy: Like[];
  user: User;
  createdAt: string;
}

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTech, setFilterTech] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [likedProjects, setLikedProjects] = useState<string[]>([]);
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

  const [createProject, { loading: mutationProjectLoading }] = useMutation(
    CREATE_PROJECT,
    {
      refetchQueries: [{ query: GET_PROJECTS }],
    }
  );

  const [toggleProjectLikes, {}] = useMutation(TOGGLE_PRODUCT_LIKES);

  const {
    data: projectData,
    loading: projectLoading,
    error: projectError,
  } = useQuery(GET_PROJECTS);

  // Popular technology suggestions
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

  useEffect(() => {
    if (projectData?.getProjects && userId) {
      const liked = projectData.getProjects
        .filter((project: Project) =>
          project.likedBy?.some((like: Like) => like.user?.clerkId === userId)
        )
        .map((project: Project) => project.id);
      setLikedProjects(liked);
    }
  }, [projectData, userId]);

  // Use fetched projects instead of hardcoded ones
  const projects = useMemo(() => projectData?.getProjects || [], [projectData]);

  // Fixed tabs with proper counts
  const tabs = useMemo(
    () => [
      { id: "all", label: "All Projects", count: projects.length },
      {
        id: "my",
        label: "My Projects",
        count: projects.filter(
          (project: Project) => project.user.clerkId === userId
        ).length,
      },
      { id: "liked", label: "Liked", count: likedProjects.length },
      { id: "add", label: "Add Project", icon: Plus, isAction: true },
    ],
    [projects, likedProjects.length, userId]
  );

  console.log("projects-->", projects);

  // Filter projects based on active tab
  const getFilteredProjectsByTab = useMemo(() => {
    switch (activeTab) {
      case "liked":
        return projects.filter((project: Project) =>
          likedProjects.includes(project.id)
        );
      case "my":
        return projects.filter(
          (project: Project) => project.user.clerkId === userId
        );
      default:
        return projects;
    }
  }, [activeTab, projects, likedProjects]);

  // Apply search and technology filters
  const filteredProjects = useMemo(() => {
    return getFilteredProjectsByTab.filter((project: Project) => {
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
    const colors: { [key: string]: string } = {
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
          const updatedLikes = data.toggleProjectLikes?.likes;
          cache.modify({
            id: cache.identify({ __typename: "Project", id: projectId }),
            fields: {
              likes() {
                return updatedLikes;
              },
              likedBy(existingLikes = []) {
                const isLiked = existingLikes.some(
                  (like: Like) => like.user?.clerkId === userId
                );
                if (isLiked) {
                  return existingLikes.filter(
                    (like: Like) => like.user?.clerkId !== userId
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
    } catch (error) {
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

  // Form handlers (unchanged)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = (tagToAdd?: string) => {
    const tag = (tagToAdd || currentTag).trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setCurrentTag("");
      setShowTagSuggestions(false);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "Escape") {
      setShowTagSuggestions(false);
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentTag(value);
    setShowTagSuggestions(value.length > 0);
  };

  const getFilteredSuggestions = () => {
    if (!currentTag) return [];
    return popularTags
      .filter(
        (tag) =>
          tag.toLowerCase().includes(currentTag.toLowerCase()) &&
          !formData.tags.includes(tag)
      )
      .slice(0, 8);
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      githubLink: "",
      liveLink: "",
      tags: [],
    });
    setCurrentTag("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.githubLink.trim()
    ) {
      console.log(
        "Please fill in all required fields (Title, Description, and GitHub Link)"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await createProject({
        variables: {
          description: formData.description,
          githubLink: formData.githubLink,
          liveLink: formData.liveLink,
          tags: formData.tags,
          title: formData.title,
        },
      });
      setShowAddModal(false);
      resetForm();
      console.log("Project created successfully!");
    } catch (error) {
      console.error("Error creating project:", error);
      console.log("Error creating project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  console.log("liked project", likedProjects);

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
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Project Showcase
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover amazing projects built by our community members and get
          inspired by their creativity
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 mb-8 hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search projects, technologies, authors..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 mb-8 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav
            className="flex space-x-0 px-2 overflow-x-auto"
            aria-label="Tabs"
          >
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id && !tab.isAction
                      ? "border-blue-500 text-blue-600 bg-blue-50/50"
                      : tab.isAction
                      ? "border-transparent text-green-600 hover:text-green-700 hover:bg-green-50/50 hover:border-green-300"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50 hover:border-gray-300"
                  }`}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  <span>{tab.label}</span>
                  {!tab.isAction && (
                    <span
                      className={`py-0.5 px-2 rounded-full text-xs transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Projects Grid */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredProjects.map((project: Project) => {
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
                        (like: Like) => like.user?.clerkId === userId
                      )
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        project.likedBy?.some(
                          (like: Like) => like.user?.clerkId === userId
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

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Code className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No projects found
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Try adjusting your search terms or filter criteria to find more
            projects
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterTech("all");
              setActiveTab("all");
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Add New Project
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Share your amazing work with the community
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Project Title *
                </label>
                <div className="relative">
                  <FileText className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter your project title"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project, its features, and what makes it special..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="githubLink"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  GitHub Repository *
                </label>
                <div className="relative">
                  <Github className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    id="githubLink"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/repository"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="liveLink"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Live Demo Link
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Link className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    id="liveLink"
                    name="liveLink"
                    value={formData.liveLink}
                    onChange={handleInputChange}
                    placeholder="https://your-project-demo.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Technologies Used
                  <span className="text-gray-400 font-normal ml-1">
                    ({formData.tags.length} selected)
                  </span>
                </label>
                <div className="relative">
                  <Tag className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="tags"
                    value={currentTag}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    onFocus={() => setShowTagSuggestions(currentTag.length > 0)}
                    onBlur={() =>
                      setTimeout(() => setShowTagSuggestions(false), 200)
                    }
                    placeholder="Type technology and press Enter (e.g., React, Node.js, MongoDB)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />

                  {showTagSuggestions &&
                    getFilteredSuggestions().length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {getFilteredSuggestions().map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAddTag(suggestion)}
                            className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center space-x-2 border-b border-gray-100 last:border-b-0"
                          >
                            <Tag className="h-4 w-4 text-gray-400" />
                            <span>{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Press Enter, comma, or click suggestions to add tags
                </p>

                {formData.tags.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Selected Technologies:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200 hover:bg-blue-200 transition-colors"
                        >
                          <Tag className="h-3 w-3" />
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:bg-blue-300 rounded-full p-0.5 transition-colors ml-1"
                            title={`Remove ${tag}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {formData.tags.length < 8 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Popular Technologies:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {popularTags
                        .filter((tag) => !formData.tags.includes(tag))
                        .slice(0, 12)
                        .map((tag, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAddTag(tag)}
                            className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                          >
                            {tag}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !formData.title.trim() ||
                    !formData.description.trim() ||
                    !formData.githubLink.trim()
                  }
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {mutationProjectLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Creating Project...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Create Project</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
