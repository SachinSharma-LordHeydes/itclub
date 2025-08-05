"use client";

import { GET_RESOURCE } from "@/client/resource/resourceQueries";
import { useQuery } from "@apollo/client";
import {
  ChevronLeft,
  ChevronRight,
  Code,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  User,
  Video,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const ViewResourcePage = () => {
  const { resourceId } = useParams();
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null
  );

  const {
    data: resourcesData,
    loading: resourcesLoading,
    error: resourcesError,
  } = useQuery(GET_RESOURCE, { variables: { id: resourceId } });

  console.log("resource data-->", resourcesData);

  // Handle closing the modal
  const closeMediaModal = useCallback(() => {
    setSelectedMediaIndex(null);
  }, []);

  // Keyboard navigation for accessibility (moved to top level)
  const goToNextMedia = useCallback(() => {
    if (selectedMediaIndex !== null && resourcesData?.getResource?.resourceLink) {
      setSelectedMediaIndex((prev) =>
        prev !== null &&
        prev < resourcesData.getResource.resourceLink.length - 1
          ? prev + 1
          : 0
      );
    }
  }, [selectedMediaIndex, resourcesData]);

  const goToPreviousMedia = useCallback(() => {
    if (selectedMediaIndex !== null && resourcesData?.getResource?.resourceLink) {
      setSelectedMediaIndex((prev) =>
        prev !== null && prev > 0
          ? prev - 1
          : resourcesData.getResource.resourceLink.length - 1
      );
    }
  }, [selectedMediaIndex, resourcesData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedMediaIndex === null) return;
      if (e.key === "ArrowRight") goToNextMedia();
      if (e.key === "ArrowLeft") goToPreviousMedia();
      if (e.key === "Escape") closeMediaModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMediaIndex, goToNextMedia, goToPreviousMedia, closeMediaModal]);

  if (resourcesLoading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  if (resourcesError) {
    console.log("error while fetching resource data--->", resourcesError);
    return (
      <div className="p-6 text-center text-red-600">Error loading resource</div>
    );
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "document":
        return FileText;
      case "video":
        return Video;
      case "images":
        return ImageIcon;
      case "links":
        return LinkIcon;
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

  const IconComponent = getResourceIcon(
    resourcesData.getResource?.document_type
  );

  // Handle opening the modal
  const openMediaModal = (index: number) => {
    setSelectedMediaIndex(index);
  };



  // Check if the link is a video based on its extension or type
  const isVideoLink = (link: string) => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
    return videoExtensions.some((ext) => link.toLowerCase().endsWith(ext));
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Library</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
        <div className="flex items-start mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <IconComponent className="h-5 w-5 text-gray-600" />
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getResourceTypeColor(
                resourcesData.getResource.document_type
              )}`}
            >
              {resourcesData.getResource.document_type}
            </span>
            <span className="ml-4 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {resourcesData.getResource.category}
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {resourcesData.getResource.title}
        </h1>
        <p className="text-gray-600 text-base mb-6">
          {resourcesData.getResource.description}
        </p>

        {(resourcesData.getResource.document_type === "images" ||
          resourcesData.getResource.document_type === "videos") &&
          resourcesData.getResource.resourceLink &&
          resourcesData.getResource.resourceLink.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {resourcesData.getResource.document_type === "video"
                  ? "Video Gallery"
                  : "Image Gallery"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resourcesData.getResource.resourceLink.map(
                  (mediaLink: string, index: number) => (
                    <div
                      key={index}
                      className="cursor-pointer"
                      onClick={() => openMediaModal(index)}
                    >
                      {isVideoLink(mediaLink) ? (
                        <video
                          src={mediaLink}
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={mediaLink}
                          alt={`${resourcesData.getResource.title} - Media ${
                            index + 1
                          }`}
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                        />
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {resourcesData.getResource.resourceLink &&
          resourcesData.getResource.document_type == "links" && (
            <div className="w-full  text-black py-2 px-4 rounded-lg  transition-colors font-medium flex items-center space-y-2 mb-6">
              <div>
                {resourcesData.getResource.resourceLink.map(
                  (link: string, index: string) => (
                    <div key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {resourcesData.getResource.resourceLink &&
          resourcesData.getResource.document_type == "docs" && (
            <div className="w-full  text-black py-2 px-4 rounded-lg  transition-colors font-medium flex items-center space-y-2 mb-6">
              <div>
                {resourcesData.getResource.resourceLink.map(
                  (link: string, index: string) => (
                    <div key={index}>
                      <iframe
                        src={link}
                        width="100%"
                        height="600px"
                        style={{ border: "none" }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>
              {resourcesData.getResource.user.first_name || "Unknown"}
            </span>
          </div>
        </div>
      </div>

      {/* Modal for viewing media */}
      {selectedMediaIndex !== null &&
        resourcesData.getResource.resourceLink && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={closeMediaModal}
                className="absolute z-50 top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Close full-screen view"
              >
                <X className="h-6 w-6 text-gray-800" />
              </button>

              <div className="relative flex items-center justify-center">
                <button
                  onClick={goToPreviousMedia}
                  className="absolute left-4 text-white hover:text-gray-300"
                  aria-label="Previous media"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>

                {isVideoLink(
                  resourcesData.getResource.resourceLink[selectedMediaIndex]
                ) ? (
                  <video
                    src={
                      resourcesData.getResource.resourceLink[selectedMediaIndex]
                    }
                    controls
                    className="max-h-[80vh] w-full rounded-lg"
                  />
                ) : (
                  <img
                    src={
                      resourcesData.getResource.resourceLink[selectedMediaIndex]
                    }
                    alt={`${resourcesData.getResource.title} - Media ${
                      selectedMediaIndex + 1
                    }`}
                    className="max-h-[80vh] w-full object-contain rounded-lg"
                  />
                )}

                <button
                  onClick={goToNextMedia}
                  className="absolute right-4 text-white hover:text-gray-300"
                  aria-label="Next media"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ViewResourcePage;
