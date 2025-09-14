import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit, Tag, Plus, Lock } from "lucide-react";
import type { ThreadResponse, UpdateThreadRequest } from "../../types/forum";

interface EditThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateThreadRequest) => Promise<void>;
  loading: boolean;
  thread?: ThreadResponse;
}

export const EditThreadModal: React.FC<EditThreadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  thread,
}) => {
  const [formData, setFormData] = useState<UpdateThreadRequest>({
    title: "",
    content: "",
    tags: [],
    isClosed: false,
    closedReason: "",
  });
  const [newTag, setNewTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (thread && isOpen) {
      setFormData({
        title: thread.title,
        content: thread.content,
        tags: [...thread.tags],
        isClosed: thread.isClosed,
        closedReason: thread.closedReason || "",
      });
    }
  }, [thread, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.title && formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    } else if (formData.title && formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (formData.content && formData.content.length < 20) {
      newErrors.content = "Content must be at least 20 characters";
    } else if (formData.content && formData.content.length > 5000) {
      newErrors.content = "Content must be less than 5000 characters";
    }

    if (formData.isClosed && !formData.closedReason?.trim()) {
      newErrors.closedReason =
        "Closed reason is required when closing a thread";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error("Failed to update thread:", error);
    }
  };

  const handleClose = () => {
    setNewTag("");
    setErrors({});
    onClose();
  };

  const addTag = () => {
    if (
      newTag.trim() &&
      !formData.tags?.includes(newTag.trim().toLowerCase())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim().toLowerCase()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target === document.activeElement) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Edit className="w-6 h-6 text-blue-500" />
                  Edit Thread
                </h2>
                <motion.button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter thread title..."
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {(formData.title || "").length}/200 characters
                </p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={formData.content || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  rows={8}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    errors.content ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Edit your thread content..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {(formData.content || "").length}/5000 characters
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Tags
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a tag..."
                  />
                  <motion.button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </motion.button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag, index) => (
                    <motion.span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-blue-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Close Thread Option */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="closed"
                    checked={formData.isClosed}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isClosed: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label
                    htmlFor="closed"
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <Lock className="w-4 h-4 text-red-500" />
                    Close this thread
                  </label>
                </div>

                {formData.isClosed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <input
                      type="text"
                      value={formData.closedReason || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          closedReason: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.closedReason
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Reason for closing this thread..."
                    />
                    {errors.closedReason && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.closedReason}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  whileHover={{ scale: loading ? 1 : 1.05 }}
                  whileTap={{ scale: loading ? 1 : 0.95 }}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Update Thread
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
