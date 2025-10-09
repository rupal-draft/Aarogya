// components/Articles/UpdateArticleModal.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit3, Sparkles, RefreshCw } from "lucide-react";
import type { Article, ArticleUpdateRequestDto } from "../../types/article";

interface UpdateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, articleData: ArticleUpdateRequestDto) => Promise<void>;
  article: Article | null;
}

export const UpdateArticleModal: React.FC<UpdateArticleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  article,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
      });
    }
  }, [article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;

    setLoading(true);
    try {
      await onSubmit(article.id, formData);
      onClose();
    } catch (error) {
      console.error("Error updating article:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !article) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-amber-100"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  className="p-2 bg-white/20 rounded-xl"
                >
                  <Edit3 className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Update Article
                  </h2>
                  <p className="text-amber-100">
                    Refine and improve your medical content ✨
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
          >
            <div className="space-y-6">
              {/* Current Article Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 text-amber-800 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Currently Editing</span>
                </div>
                <p className="text-amber-700 text-sm">
                  <strong>Category:</strong> {article.category} •{" "}
                  <strong>Views:</strong> {article.views} •{" "}
                  <strong>Created:</strong>{" "}
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Edit3 className="w-4 h-4 text-amber-500" />
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                />
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <RefreshCw className="w-4 h-4 text-orange-500" />
                  Article Content *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  rows={10}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-300"
                />
              </motion.div>
            </div>

            {/* Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3 pt-6 mt-6 border-t border-gray-200"
            >
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.content}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative">
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Updating...
                    </div>
                  ) : (
                    "Update Article 🔄"
                  )}
                </span>
              </button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
