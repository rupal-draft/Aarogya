import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  RefreshCw,
  FileText,
  User,
  Calendar,
  Plus,
  Star,
  Bookmark,
  Zap,
  Sparkles,
} from "lucide-react";
import type {
  UpdateJournalEntryRequest,
  JournalEntryResponse,
} from "../../types/journal";
import { journalService } from "../../Services/journalService";
import { EntryType } from "../../Data/enums/Journal";

interface UpdateEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: JournalEntryResponse;
  onSuccess: () => void;
}

const UpdateEntryModal: React.FC<UpdateEntryModalProps> = ({
  isOpen,
  onClose,
  entry,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<UpdateJournalEntryRequest>({});
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title,
        content: entry.content,
        patientId: entry.patientId || "",
        tags: entry.tags || [],
        type: entry.type,
        priority: entry.priority,
        isBookmarked: entry.isBookmarked,
        isPinned: entry.isPinned,
        reminderDate: entry.reminderDate || "",
        changeSummary: "",
      });
      setWordCount(
        entry.content
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length
      );
    }
  }, [entry]);

  useEffect(() => {
    // Check if changes were made
    const hasChanges =
      formData.title !== entry.title ||
      formData.content !== entry.content ||
      formData.patientId !== (entry.patientId || "") ||
      JSON.stringify(formData.tags) !== JSON.stringify(entry.tags || []) ||
      formData.type !== entry.type ||
      formData.priority !== entry.priority ||
      formData.isBookmarked !== entry.isBookmarked ||
      formData.isPinned !== entry.isPinned ||
      formData.reminderDate !== (entry.reminderDate || "");

    setChangesMade(hasChanges);
  }, [formData, entry]);

  const handleInputChange = (
    field: keyof UpdateJournalEntryRequest,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await journalService.updateEntry(entry.id, formData);

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error updating entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateX: 10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      rotateX: -10,
      transition: {
        duration: 0.3,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const successVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
    exit: { scale: 0, opacity: 0 },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Success Overlay */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                variants={successVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="bg-white rounded-2xl p-8 shadow-2xl text-center"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 0.8 }}
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Save className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Entry Updated!
                  </h3>
                  <p className="text-gray-600">
                    Your changes have been saved successfully.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden border border-white/20 relative"
          >
            {/* Animated Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-50"></div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-blue-200/30"
                  style={{
                    width: Math.random() * 6 + 2,
                    height: Math.random() * 6 + 2,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, Math.random() * 10 - 5, 0],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
                  >
                    <RefreshCw className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold">Update Entry</h2>
                    <p className="text-blue-100 text-sm">
                      Edit your medical journal entry
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="relative p-6 overflow-y-auto max-h-[calc(95vh-120px)]"
            >
              <div className="space-y-6">
                {/* Change Indicator */}
                <AnimatePresence>
                  {changesMade && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl"
                    >
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700 font-medium">
                        You have unsaved changes
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-medium"
                    placeholder="Enter entry title..."
                    required
                    maxLength={200}
                  />
                </div>

                {/* Type and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type || EntryType.NOTE}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value={EntryType.NOTE}>Note</option>
                      <option value={EntryType.CLINICAL_OBSERVATION}>
                        Clinical Observation
                      </option>
                      <option value={EntryType.TREATMENT_PLAN}>
                        Treatment Plan
                      </option>
                      <option value={EntryType.RESEARCH_IDEA}>
                        Research Idea
                      </option>
                      <option value={EntryType.PATIENT_FOLLOWUP}>
                        Patient Follow-up
                      </option>
                      <option value={EntryType.MEETING_NOTES}>
                        Meeting Notes
                      </option>
                      <option value={EntryType.EDUCATIONAL}>Educational</option>
                      <option value={EntryType.PERSONAL_REFLECTION}>
                        Personal Reflection
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority || "LOW"}
                      onChange={(e) =>
                        handleInputChange("priority", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="LOW">Low</option>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleInputChange("isBookmarked", !formData.isBookmarked)
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      formData.isBookmarked
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-300 shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        formData.isBookmarked ? "fill-yellow-500" : ""
                      }`}
                    />
                    {formData.isBookmarked ? "Bookmarked" : "Bookmark"}
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      handleInputChange("isPinned", !formData.isPinned)
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      formData.isPinned
                        ? "bg-blue-100 text-blue-700 border border-blue-300 shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        formData.isPinned ? "fill-blue-500" : ""
                      }`}
                    />
                    {formData.isPinned ? "Pinned" : "Pin"}
                  </motion.button>
                </div>

                {/* Patient ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    Patient ID (Optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={formData.patientId || ""}
                      onChange={(e) =>
                        handleInputChange("patientId", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter patient ID..."
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags?.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm border border-blue-200"
                      >
                        {tag}
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={() => removeTag(tag)}
                          className="p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </motion.button>
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                      className="flex-1 px-4 py-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Add a tag..."
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addTag}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Content *
                    </label>
                    <span className="text-sm text-gray-500">
                      {wordCount} words
                    </span>
                  </div>
                  <textarea
                    value={formData.content || ""}
                    onChange={(e) => {
                      handleInputChange("content", e.target.value);
                      setWordCount(
                        e.target.value
                          .trim()
                          .split(/\s+/)
                          .filter((word) => word.length > 0).length
                      );
                    }}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows={12}
                    placeholder="Start writing your entry..."
                    required
                    maxLength={10000}
                  />
                </div>

                {/* Reminder Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Reminder Date (Optional)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="datetime-local"
                      value={formData.reminderDate || ""}
                      onChange={(e) =>
                        handleInputChange("reminderDate", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Change Summary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    Change Summary (Optional)
                  </label>
                  <textarea
                    value={formData.changeSummary || ""}
                    onChange={(e) =>
                      handleInputChange("changeSummary", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                    placeholder="Briefly describe what you changed..."
                    maxLength={500}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-blue-200 mt-8">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{
                    scale: changesMade ? 1.05 : 1,
                    y: changesMade ? -2 : 0,
                  }}
                  whileTap={{ scale: 0.95 }}
                  disabled={
                    isSubmitting ||
                    !formData.title?.trim() ||
                    !formData.content?.trim() ||
                    !changesMade
                  }
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-semibold relative overflow-hidden group"
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />

                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Update Entry</span>
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

export default UpdateEntryModal;
