import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Pin,
  Calendar,
  Clock,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  Bell,
  Eye,
  FileText,
} from "lucide-react";
import type { JournalEntrySummaryResponse } from "../../types/journal";
import { journalService } from "../../Services/journalService";

interface JournalEntryCardProps {
  entry: JournalEntrySummaryResponse;
  viewMode: "grid" | "list";
  onUpdate: () => void;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  entry,
  viewMode,
  onUpdate,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isPinning, setIsPinning] = useState(false);

  const handleBookmark = async () => {
    setIsBookmarking(true);
    try {
      await journalService.bookmarkEntry({
        entryId: entry.id,
        isBookmarked: !entry.isBookmarked,
      });
      onUpdate();
    } catch (error) {
      console.error("Error bookmarking entry:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handlePin = async () => {
    setIsPinning(true);
    try {
      await journalService.pinEntry({
        entryId: entry.id,
        isPinned: !entry.isPinned,
      });
      onUpdate();
    } catch (error) {
      console.error("Error pinning entry:", error);
    } finally {
      setIsPinning(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await journalService.deleteEntry(entry.id);
        onUpdate();
      } catch (error) {
        console.error("Error deleting entry:", error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "red";
      case "high":
        return "orange";
      case "medium":
        return "yellow";
      case "low":
        return "green";
      default:
        return "gray";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "patient_note":
        return User;
      case "research":
        return FileText;
      case "case_study":
        return Eye;
      default:
        return FileText;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const TypeIcon = getTypeIcon(entry.type);
  const priorityColor = getPriorityColor(entry.priority);

  if (viewMode === "list") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -2 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg transition-all border border-blue-100 p-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 bg-${priorityColor}-100 rounded-lg`}>
                <TypeIcon className={`w-4 h-4 text-${priorityColor}-600`} />
              </div>
              <div className="flex items-center gap-2">
                {entry.isPinned && (
                  <Pin className="w-4 h-4 text-blue-600 fill-current" />
                )}
                {entry.isBookmarked && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
                {entry.hasReminder && (
                  <Bell className="w-4 h-4 text-orange-500" />
                )}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
              {entry.title}
            </h3>

            <p className="text-gray-600 mb-3 line-clamp-2">
              {entry.contentPreview}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(entry.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>{entry.wordCount} words</span>
              </div>
              {entry.patientName && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{entry.patientName}</span>
                </div>
              )}
            </div>

            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {entry.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {entry.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{entry.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10"
                >
                  <button
                    onClick={handleBookmark}
                    disabled={isBookmarking}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        entry.isBookmarked ? "text-yellow-500 fill-current" : ""
                      }`}
                    />
                    {entry.isBookmarked ? "Remove Bookmark" : "Bookmark"}
                  </button>
                  <button
                    onClick={handlePin}
                    disabled={isPinning}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Pin
                      className={`w-4 h-4 ${
                        entry.isPinned ? "text-blue-600 fill-current" : ""
                      }`}
                    />
                    {entry.isPinned ? "Unpin" : "Pin"}
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-xl transition-all border border-blue-100 overflow-hidden group"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-${priorityColor}-100 rounded-lg`}>
              <TypeIcon className={`w-4 h-4 text-${priorityColor}-600`} />
            </div>
            <div className="flex items-center gap-2">
              {entry.isPinned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-1"
                >
                  <Pin className="w-4 h-4 text-blue-600 fill-current" />
                </motion.div>
              )}
              {entry.isBookmarked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-1"
                >
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </motion.div>
              )}
              {entry.hasReminder && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-1"
                >
                  <Bell className="w-4 h-4 text-orange-500" />
                </motion.div>
              )}
            </div>
          </div>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10"
                >
                  <button
                    onClick={handleBookmark}
                    disabled={isBookmarking}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        entry.isBookmarked ? "text-yellow-500 fill-current" : ""
                      }`}
                    />
                    {entry.isBookmarked ? "Remove Bookmark" : "Bookmark"}
                  </button>
                  <button
                    onClick={handlePin}
                    disabled={isPinning}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Pin
                      className={`w-4 h-4 ${
                        entry.isPinned ? "text-blue-600 fill-current" : ""
                      }`}
                    />
                    {entry.isPinned ? "Unpin" : "Pin"}
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {entry.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {entry.contentPreview}
        </p>

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {entry.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{entry.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(entry.updatedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{entry.wordCount}</span>
            </div>
          </div>

          {entry.patientName && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="text-xs">{entry.patientName}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JournalEntryCard;
