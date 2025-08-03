import { FileText, Github, Link, Plus, X } from "lucide-react";

const AddProjectModal = ({setShowAddModal,resetForm,handleSubmit,formData,handleInputChange}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
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

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title Field */}
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

          {/* Description Field */}
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

          {/* GitHub Link */}
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

          {/* Live Link */}
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

          {/* Tags Field */}
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

              {/* Tag Suggestions Dropdown */}
              {showTagSuggestions && getFilteredSuggestions().length > 0 && (
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

            {/* Display Selected Tags */}
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

            {/* Popular Tags Quick Select */}
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

          {/* Form Actions */}
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
              {isSubmitting ? (
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
  );
};

export default AddProjectModal;
