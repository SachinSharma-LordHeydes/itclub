"use client";

import { CREATE_RESOURCE } from "@/client/resource/resourceQueries";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { useMutation } from "@apollo/client";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";

interface FormData {
  title: string;
  description: string;
  type: "docs" | "videos" | "images" | "links";
  category:
    | "Programming"
    | "Web Development"
    | "DevOps"
    | "Data Science"
    | "Database";
  files: File[];
  resourceLink: string[];
  uploadedUrls: string[];
  uploading: boolean;
}

interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  resourceType: string;
  size: number;
}

const UploadResource = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    type: "docs",
    category: "Programming",
    files: [],
    resourceLink: [],
    uploadedUrls: [],
    uploading: false,
  });

  const [createResource, { loading }] =
    useMutation(CREATE_RESOURCE);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResourceLinkChange = (index: number, value: string) => {
    const newResourceLinks = [...formData.resourceLink];
    newResourceLinks[index] = value;
    setFormData({ ...formData, resourceLink: newResourceLinks });
  };

  const addResourceLink = () => {
    setFormData({ ...formData, resourceLink: [...formData.resourceLink, ""] });
  };

  const removeResourceLink = (index: number) => {
    setFormData({
      ...formData,
      resourceLink: formData.resourceLink.filter((_, i) => i !== index),
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const validTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "video/mp4",
      "video/webm",
    ];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError(
        "Some files have invalid types. Please upload only JPEG, PNG, PDF, MP4, or WebM files."
      );
      return;
    }

    setFormData({ ...formData, files, resourceLink: [] });
    setError("");

    setFormData((prev) => ({ ...prev, uploading: true }));
    const uploadPromises = files.map((file) => {
      const resourceType = file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("image/")
        ? "image"
        : "auto";
      return uploadToCloudinary(file, resourceType);
    });
    try {
      const results = await Promise.all<CloudinaryUploadResult>(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        uploadedUrls: [
          ...prev.uploadedUrls,
          ...results.map((result) => result.url),
        ],
      }));
    } catch {
      setError("Failed to upload files to Cloudinary. Please try again.");
    } finally {
      setFormData((prev) => ({ ...prev, uploading: false }));
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []) as File[];
    const validTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "video/mp4",
      "video/webm",
    ];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setError(
        "Some files have invalid types. Please upload only JPEG, PNG, PDF, MP4, or WebM files."
      );
      return;
    }

    setFormData({ ...formData, files, resourceLink: [] });
    setError("");

    setFormData((prev) => ({ ...prev, uploading: true }));
    const uploadPromises = files.map((file) => {
      const resourceType = file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("image/")
        ? "image"
        : "raw";
      return uploadToCloudinary(file, resourceType);
    });
    try {
      const results = await Promise.all<CloudinaryUploadResult>(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        uploadedUrls: [
          ...prev.uploadedUrls,
          ...results.map((result) => result.url),
        ],
      }));
    } catch {
      setError("Failed to upload files to Cloudinary. Please try again.");
    } finally {
      setFormData((prev) => ({ ...prev, uploading: false }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, index) => index !== indexToRemove),
      uploadedUrls: formData.uploadedUrls.filter(
        (_, index) => index !== indexToRemove
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError("Title and description are required.");
      return;
    }
    if (
      formData.type !== "links" &&
      formData.files.length === 0 &&
      formData.uploadedUrls.length === 0
    ) {
      setError("Please upload at least one file.");
      return;
    }
    if (formData.type === "links" && formData.resourceLink.length === 0) {
      setError("Please provide at least one resource link.");
      return;
    }
    if (formData.type === "links") {
      const invalidUrls = formData.resourceLink.filter((url) => {
        try {
          new URL(url);
          return false;
        } catch {
          return true;
        }
      });
      if (invalidUrls.length > 0) {
        setError("One or more resource links are invalid URLs.");
        return;
      }
    }

    try {
      await createResource({
        variables: {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          document_type: formData.type,
          resourceLink:
            formData.type === "links"
              ? formData.resourceLink
              : formData.uploadedUrls,
        },
      });
      setError("");
      setSuccess("Resource uploaded successfully!");
      setFormData({
        title: "",
        description: "",
        type: "docs",
        category: "Programming",
        files: [],
        resourceLink: [],
        uploadedUrls: [],
        uploading: false,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to create resource: ${errorMessage}`);
    }
  };

  const getPreview = (file: File, index: number) => {
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={formData.uploadedUrls[index] || URL.createObjectURL(file)}
          alt={file.name}
          className="w-20 h-20 object-cover rounded"
        />
      );
    } else if (file.type.startsWith("video/")) {
      return (
        <video controls className="w-20 h-20 object-cover rounded">
          <source
            src={formData.uploadedUrls[index] || URL.createObjectURL(file)}
            type={file.type}
          />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded">
          {file.name}
        </div>
      );
    }
  };

  useEffect(() => {
    return () => {
      formData.files.forEach((file, index) => {
        if (!formData.uploadedUrls[index]) {
          URL.revokeObjectURL(URL.createObjectURL(file));
        }
      });
    };
  }, [formData.files, formData.uploadedUrls]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Upload Resource</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter resource title"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter resource description"
            rows={4}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Programming">Programming</option>
              <option value="Web Development">Web Development</option>
              <option value="DevOps">DevOps</option>
              <option value="Data Science">Data Science</option>
              <option value="Database">Database</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.type === "links" ? "Resource Links" : "Upload Files"}
          </label>
          {formData.type === "links" ? (
            <div>
              {formData.resourceLink.map((link, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) =>
                      handleResourceLinkChange(index, e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter resource URL ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeResourceLink(index)}
                    className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addResourceLink}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Add Another Link
              </button>
            </div>
          ) : (
            <div>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById("fileInput")?.click()}
                className={`w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-500 transition-colors cursor-pointer ${
                  formData.uploading
                    ? "border-gray-400"
                    : "border-gray-300 hover:border-blue-500"
                }`}
              >
                <input
                  id="fileInput"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/jpeg,image/png,application/pdf,video/mp4,video/webm"
                  disabled={formData.uploading}
                />
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2" />
                  <p>Drag and drop or click to upload files</p>
                  <p className="text-xs">(JPEG, PNG, PDF, MP4, WebM)</p>
                  {formData.uploading && (
                    <p className="text-sm text-yellow-500 mt-2">Uploading...</p>
                  )}
                </div>
              </div>
              {formData.files.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                  {formData.files.map((file, index) => (
                    <div
                      key={index}
                      className="relative border rounded-lg p-2 bg-gray-50"
                    >
                      {getPreview(file, index)}
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2 mt-6"
          disabled={formData.uploading || loading}
        >
          <Upload className="h-5 w-5" />
          <span>Upload Resource</span>
        </button>
      </form>
    </div>
  );
};

export default UploadResource;
  