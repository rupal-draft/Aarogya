import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Eye, EyeOff, Send } from "lucide-react";
import type { CreateReplyRequest } from "../../types/forum";

interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReplyRequest) => Promise<void>;
  loading: boolean;
  threadTitle?: string;
  parentReplyId?: string;
  parentReplyContent?: string;
}

export const ReplyModal: React.FC<ReplyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  threadTitle,
  parentReplyId,
  parentReplyContent,
}) => {
  const [formData, setFormData] = useState<CreateReplyRequest>({
    content: "",
    parentReplyId,
    isAnonymous: false,
    isSolution: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 5) {
      newErrors.content = "Content must be at least 5 characters";
    } else if (formData.content.length > 2000) {
      newErrors.content = "Content must be less than 2000 characters";
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
      console.error("Failed to create reply:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      content: "",
      parentReplyId,
      isAnonymous: false,
      isSolution: false,
    });
    setErrors({});
    onClose();
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                  {parentReplyId ? "Reply to Comment" : "Reply to Thread"}
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

            <div className="p-6">
              {/* Context */}
              {threadTitle && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-medium text-gray-900 mb-2">
                    {parentReplyId ? "Replying to:" : "Thread:"}
                  </h3>
                  <p className="text-gray-700">
                    {parentReplyContent || threadTitle}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Reply *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      errors.content ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Write your reply here..."
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.content}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.content.length}/2000 characters
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={formData.isAnonymous}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isAnonymous: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="anonymous"
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      {formData.isAnonymous ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      Post anonymously
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="solution"
                      checked={formData.isSolution}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isSolution: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor="solution"
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="text-green-600">✓</span>
                      Mark as solution (if this answers the question)
                    </label>
                  </div>
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
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Post Reply
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
