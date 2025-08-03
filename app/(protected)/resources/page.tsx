"use client";

import { getDashboardData } from "@/actions/resources";
import { DELETE_RESOURCE } from "@/client/resource/resourceQueries";
import EditResourceModal from "@/components/protected/EditResourceModal";
import UploadResource from "@/components/protected/UploadResource";
import { useMutation } from "@apollo/client";
import {
  Code,
  FileText,
  Filter,
  Image,
  Link,
  Search,
  User,
  Video,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ResourceData = {
  id: string;
  title: string;
  type: string;
  category: string;
  description: string;
  resourceLink: string[];
  userName: string | null;
  clerkId: string | null;
  createdAt: string;
};

type Resource = {
  id: string;
  title: string;
  description: string;
  type: "docs" | "videos" | "images" | "links";
  category:
    | "Programming"
    | "Web Development"
    | "DevOps"
    | "Data Science"
    | "Database";
  resourceLink: string[];
  userName: string | null;
  clerkId: string | null;
  createdAt: string;
};

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resources, setResources] = useState<ResourceData[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [deleteResourceState, setDeleteResourceState] =
    useState<ResourceData | null>(null);

  const [
    deleteResource,
    { data: mutationData, error: mutationError, loading: mutationLoading },
  ] = useMutation(DELETE_RESOURCE);

  const router = useRouter();

  const getresourchData = async () => {
    const data = await getDashboardData();
    setResources(data.recentResources);
    console.log("resources-->", data.recentResources);
    setCurrentUserId(data.clerkId);
  };

  useEffect(() => {
    getresourchData();
  }, []);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "document":
        return FileText;
      case "video":
        return Video;
      case "images":
        return Image;
      case "links":
        return Link;
      default:
        return Code;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-100 text-blue-800";
      case "video":
        return "bg-red-100 text-red-800";
      case "images":
        return "bg-green-100 text-green-800";
      case "links":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.userName!.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || resource.type === filterType;
    const matchesCategory =
      filterCategory === "all" || resource.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const tabs = [
    { id: "all", label: "All Resources", count: resources.length },
    {
      id: "My",
      label: "My Uploads",
      count: resources.filter((r) => r.clerkId === currentUserId).length,
    },
    { id: "Upload", label: "Upload Resource" },
  ];

  const handleEdit = (resource: ResourceData) => {
    const mappedResource: Resource = {
      id: resource.id,
      title: resource.title,
      description: resource.description,
      type: resource.type as "docs" | "videos" | "images" | "links",
      category: resource.category as
        | "Programming"
        | "Web Development"
        | "DevOps"
        | "Data Science"
        | "Database",
      resourceLink: resource.resourceLink,
      userName: resource.userName,
      clerkId: resource.clerkId,
      createdAt: resource.createdAt,
    };
    setSelectedResource(mappedResource);
  };

  const handleDelete = (resource: ResourceData) => {
    setDeleteResourceState(resource); // Open delete confirmation modal
  };

  const confirmDelete = async () => {
    if (deleteResourceState) {
      try {
        await deleteResource({
          variables: {
            id: deleteResourceState.id,
          },
        });

        setResources(resources.filter((r) => r.id !== deleteResourceState.id));

        console.log(`Deleted resource with id: ${deleteResourceState.id}`);
      } catch (err) {
        console.error("Delete failed", err);
      } finally {
        setDeleteResourceState(null); // Close modal after action
      }
    }
  };

  const cancelDelete = () => {
    setDeleteResourceState(null); // Close modal without deleting
  };

  const handleSave = (updatedResource: Resource) => {
    setResources(
      resources.map((r) =>
        r.id === updatedResource.id ? { ...r, ...updatedResource } : r
      )
    );
    setSelectedResource(null);
  };

  const handleClose = () => {
    setSelectedResource(null);
  };

  const categories = [...new Set(resources.map((r) => r.category))];
  const types = [...new Set(resources.map((r) => r.type))];

  const renderContent = () => {
    if (activeTab === "Upload") return <UploadResource />;

    const displayResources =
      activeTab === "all"
        ? filteredResources
        : activeTab === "My"
        ? resources.filter((r) => r.clerkId === currentUserId)
        : [];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayResources.map((resource) => {
          const IconComponent = getResourceIcon(resource.type);
          return (
            <div
              key={resource.id}
              className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getResourceTypeColor(
                        resource.type
                      )}`}
                    >
                      {resource.type}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {resource.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{resource.userName}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div
                    onClick={() => router.push(`/resources/${resource.id}`)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2 hover:cursor-pointer"
                  >
                    view
                  </div>
                  {activeTab === "My" && (
                    <div
                      onClick={() => handleEdit(resource)}
                      className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center space-x-2 hover:cursor-pointer"
                    >
                      Edit
                    </div>
                  )}
                  {activeTab === "My" && (
                    <div
                      onClick={() => handleDelete(resource)}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2 hover:cursor-pointer"
                    >
                      Delete
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resource Library
        </h1>
        <p className="text-gray-600">
          Access curated learning materials, tutorials, and tools
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources, authors, or topics..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}s
                </option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-100 mb-8">
        <div className="border-b border-gray-200">
          <nav
            className="flex space-x-8 px-6 overflow-x-auto"
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {renderContent()}

      {selectedResource && (
        <EditResourceModal
          resource={selectedResource}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}

      {deleteResourceState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Confirm Delete</h2>
              <button
                onClick={cancelDelete}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6">
              Are you sure you want to delete "{deleteResourceState.title}"?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
              >
                {mutationLoading ? "Deleting..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
