"use client";

import { UPDATE_RESOURCE } from "@/client/resource/resourceQueries";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary"; // Import the function
import { useMutation } from "@apollo/client";
import {
  File,
  FileText,
  Image,
  Link,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Resource {
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
  resourceLink?: string[];
}

interface EditResourceModalProps {
  resource: Resource;
  onClose: () => void;
  onSave: (updatedResource: Resource) => void;
}

const EditResourceModal = ({
  resource,
  onClose,
  onSave,
}: EditResourceModalProps) => {
  const [formData, setFormData] = useState(resource);
  const [dragActive, setDragActive] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  console.log("resources modal-->", resource);

  const [
    updateResource,
    { data: mutationData, error: mutationError, loading: mutationLoading },
  ] = useMutation(UPDATE_RESOURCE);

  useEffect(() => {
    setFormData(resource);
  }, [resource]);

  // Create preview URLs for new files
  useEffect(() => {
    const urls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup URLs on unmount
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newFiles]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const validTypes = {
        docs: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ],
        videos: ["video/mp4", "video/avi", "video/mov", "video/wmv"],
        images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
        links: [],
      };

      return (
        validTypes[formData.type]?.includes(file.type) ||
        formData.type === "links"
      );
    });

    setNewFiles((prev) => [...prev, ...validFiles]);
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      resourceLink: prev.resourceLink?.filter((_, i) => i !== index),
    }));
  };

  const getFileIcon = (file: File | string) => {
    if (typeof file === "string") {
      // For existing URLs, determine type by extension or URL pattern
      if (file.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return Image;
      if (file.match(/\.(mp4|avi|mov|wmv)$/i)) return Video;
      if (file.match(/\.(pdf|doc|docx|txt)$/i)) return FileText;
      return Link;
    }

    // For new files (File objects)
    if (file.type.startsWith("image/")) return Image;
    if (file.type.startsWith("video/")) return Video;
    if (
      file.type.includes("pdf") ||
      file.type.includes("document") ||
      file.type.includes("text")
    ) {
      return FileText;
    }
    return File;
  };

  const renderFilePreview = (
    file: File | string,
    index: number,
    isExisting: boolean = false
  ) => {
    const IconComponent = getFileIcon(file);
    const fileName =
      typeof file === "string"
        ? file.split("/").pop() || "Unknown file"
        : file.name;

    return (
      <div key={index} className="relative group">
        {(typeof file === "string" &&
          file.match(/\.(jpg|jpeg|png|gif|webp)$/i)) ||
        (typeof file !== "string" && file.type.startsWith("image/")) ? (
          <div className="w-24 h-24 rounded-lg overflow-hidden">
            <img
              src={typeof file === "string" ? file : previewUrls[index]}
              alt={fileName}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
            <IconComponent className="h-12 w-12 text-gray-500" />
          </div>
        )}
        <button
          type="button"
          onClick={() =>
            isExisting ? removeExistingFile(index) : removeNewFile(index)
          }
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          title={`Remove ${fileName}`}
        >
          <Trash2 className="h-3 w-3" />
        </button>
        <span className="absolute bottom-1 left-1 text-xs text-white bg-black bg-opacity-70 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {fileName}
        </span>
      </div>
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setLoading(true); // Start loading

    try {
      // Upload new files to Cloudinary
      const uploadPromises = newFiles.map(async (file) => {
        let resourceType: "image" | "video" | "raw" = "raw"; // Default to raw for docs
        if (file.type.startsWith("image/")) resourceType = "image";
        else if (file.type.startsWith("video/")) resourceType = "video";

        const uploadResult = await uploadToCloudinary(file, resourceType);
        return uploadResult.url; // Return the secure URL
      });

      const newResourceLinks = await Promise.all(uploadPromises);
      const updatedResourceLink = [
        ...(formData.resourceLink || []),
        ...newResourceLinks,
      ];

      const updatedResource = {
        ...formData,
        resourceLink: updatedResourceLink,
      };
      console.log("Updated updatedResource-->", updatedResource);

      // Perform the mutation with the updated resourceLink
      await updateResource({
        variables: {
          id: resource.id,
          title: updatedResource.title,
          description: updatedResource.description,
          document_type: updatedResource.type, // Corrected to 'type' to match interface
          category: updatedResource.category,
          resourceLink: updatedResource.resourceLink, // Updated with Cloudinary URLs
        },
      });

      console.log("Updated successfully!");
      onSave(updatedResource);
    } catch (err) {
      console.error("Update or upload failed", err);
    } finally {
      setLoading(false); // End loading
    }

    onClose();
  };

  const getAcceptedFileTypes = () => {
    const typeMap = {
      docs: ".pdf,.doc,.docx,.txt",
      videos: ".mp4,.avi,.mov,.wmv",
      images: ".jpg,.jpeg,.png,.gif,.webp",
      links: "", // Links don't use file upload
    };
    return typeMap[formData.type] || "";
  };
console.log("form data-->",formData)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Edit Resource</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="docs">Docs</option>
                  <option value="videos">Videos</option>
                  <option value="images">Images</option>
                  <option value="links">Links</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Database">Database</option>
                </select>
              </div>
            </div>

            {/* Right Column - File Management */}
            <div className="space-y-6">
              {/* Existing Files Preview */}
              {/* {formData.resourceLink && formData.resourceLink.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Current Files
                  </h3>
                  <div className="grid grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                    {formData.resourceLink.map((url, index) =>
                      renderFilePreview(url, index, true)
                    )}
                  </div>
                </div>
              )} */}

              {formData.resourceLink && formData.resourceLink.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Current Files
                  </h3>
                  <div className="grid grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                    {formData.resourceLink 
                      .map((url, index) => renderFilePreview(url, index, true))}
                  </div>
                </div>
              )}

              {/* File Upload Section (for non-links types) */}
              {formData.type !== "links" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Add New Files
                  </h3>

                  {/* Drag and Drop Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drop files here or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Supported formats:{" "}
                      {getAcceptedFileTypes().replace(/\./g, "").toUpperCase()}
                    </p>
                    <input
                      type="file"
                      multiple
                      accept={getAcceptedFileTypes()}
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block"
                    >
                      Browse Files
                    </label>
                  </div>

                  {/* New Files Preview */}
                  {newFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-gray-900 mb-2">
                        New Files to Upload
                      </h4>
                      <div className="grid grid-cols-3 gap-4 max-h-40 overflow-y-auto">
                        {newFiles.map((file, index) =>
                          renderFilePreview(file, index, false)
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Links Section for link type resources */}
              {formData.type === "links" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Resource Links
                  </h3>
                  <div className="space-y-2">
                    {formData.resourceLink?.map((link, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="url"
                          value={link}
                          onChange={(e) => {
                            const newLinks = [...(formData.resourceLink || [])];
                            newLinks[index] = e.target.value;
                            setFormData({
                              ...formData,
                              resourceLink: newLinks,
                            });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newLinks =
                              formData.resourceLink?.filter(
                                (_, i) => i !== index
                              ) || [];
                            setFormData({
                              ...formData,
                              resourceLink: newLinks,
                            });
                          }}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )) || []}
                    <button
                      type="button"
                      onClick={() => {
                        const newLinks = [...(formData.resourceLink || []), ""];
                        setFormData({ ...formData, resourceLink: newLinks });
                      }}
                      className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700"
                    >
                      + Add Link
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <Upload className="h-5 w-5" />
              {mutationLoading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
          {mutationError && (
            <p className="text-red-600 mt-2">Error: {mutationError.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditResourceModal;
