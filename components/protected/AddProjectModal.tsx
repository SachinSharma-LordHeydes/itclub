"use client";

import { FileText, Github, Link, Plus, X } from "lucide-react";
import { useState } from "react";

interface FormData {
  title: string;
  description: string;
  githubLink?: string;
  projectLink?: string;
  tags: string[];
}

interface CustomEvent {
  target: {
    name: string;
    value: string[];
  };
}

interface Props {
  setShowAddModal: (val: boolean) => void;
  resetForm: () => void;
  handleSubmit: () => void;
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | CustomEvent
  ) => void;
}

const AddProjectModal = ({
  setShowAddModal,
  resetForm,
  handleSubmit,
  formData,
  handleInputChange,
}: Props) => {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !formData.tags.includes(trimmed)) {
      handleInputChange({
        target: {
          name: "tags",
          value: [...formData.tags, trimmed],
        },
      } as CustomEvent);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    handleInputChange({
      target: {
        name: "tags",
        value: formData.tags.filter((t) => t !== tag),
      },
    } as CustomEvent);
  };

  const handleClose = () => {
    setShowAddModal(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-600 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-center">Add New Project</h2>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText size={18} />
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Project Title"
              className="w-full p-2 rounded-md border dark:bg-zinc-800"
            />
          </div>

          <div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full p-2 rounded-md border dark:bg-zinc-800"
              rows={4}
            />
          </div>

          <div className="flex items-center gap-2">
            <Github size={18} />
            <input
              name="githubLink"
              value={formData.githubLink}
              onChange={handleInputChange}
              placeholder="GitHub Link"
              className="w-full p-2 rounded-md border dark:bg-zinc-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <Link size={18} />
            <input
              name="projectLink"
              value={formData.projectLink}
              onChange={handleInputChange}
              placeholder="Live Project Link"
              className="w-full p-2 rounded-md border dark:bg-zinc-800"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Enter a tag"
                className="flex-1 p-2 rounded-md border dark:bg-zinc-800"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-zinc-800 text-white px-4 py-2 rounded-md"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex flex-wrap mt-2 gap-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="bg-zinc-700 text-white px-3 py-1 rounded-full flex items-center gap-2"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-md border text-zinc-700 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-zinc-800 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
