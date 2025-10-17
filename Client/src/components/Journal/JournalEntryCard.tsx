import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Pin,
  Calendar,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  Bell,
  Eye,
  FileText,
  Lock,
} from "lucide-react";
import type {
  JournalEntryResponse,
  JournalEntrySummaryResponse,
} from "../../types/journal";
import { journalService } from "../../Services/journalService";

interface JournalEntryCardProps {
  entry: JournalEntrySummaryResponse;
  viewMode: "grid" | "list";
  onUpdate: () => void;
  onViewEntry: (entryId: string) => void;
  onUpdateEntry: (entry: JournalEntryResponse) => void;
  onDecryptAndUpdate: (entryId: string) => void;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({
  entry,
  viewMode,
  onUpdate,
  onViewEntry,
  onUpdateEntry,
  onDecryptAndUpdate,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isPinning, setIsPinning] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handlePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await journalService.deleteEntry(entry.id);
        onUpdate();
      } catch (error) {
        console.error("Error deleting entry:", error);
      }
    }
  };

  const handleViewEntry = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewEntry(entry.id);
  };

  const handleEdit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (entry.isEncrypted) {
      onDecryptAndUpdate(entry.id);
    } else {
      try {
        const entryData = await journalService.getNonEncryptedEntry(entry.id);
        onUpdateEntry(entryData);
      } catch (error) {
        console.error("Error fetching entry for editing:", error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      URGENT: "bg-red-100 text-red-800 border-red-200",
      HIGH: "bg-orange-100 text-orange-800 border-orange-200",
      MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
      LOW: "bg-green-100 text-green-800 border-green-200",
    };
    return (
      colors[priority as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      NOTE: FileText,
      CLINICAL_OBSERVATION: Eye,
      TREATMENT_PLAN: Star,
      RESEARCH_IDEA: FileText,
      PATIENT_FOLLOWUP: User,
      MEETING_NOTES: FileText,
      EDUCATIONAL: Star,
      PERSONAL_REFLECTION: FileText,
    };
    return icons[type as keyof typeof icons] || FileText;
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

  if (viewMode === "list") {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -2, scale: 1.01 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg transition-all border border-blue-100 p-6 cursor-pointer group"
        onClick={handleViewEntry}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TypeIcon className="w-4 h-4 text-blue-600" />
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                    entry.priority
                  )}`}
                >
                  {entry.priority}
                </span>
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
                {entry.isEncrypted && (
                  <Lock className="w-4 h-4 text-purple-500" />
                )}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {entry.title}
            </h3>

            <p className="text-gray-600 mb-3 line-clamp-2">
              {entry.contentPreview || "No preview available..."}
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

            {entry.tags && entry.tags.length > 0 && (
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

          <div className="flex items-center gap-2 ml-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleViewEntry}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors opacity-0 group-hover:opacity-100"
              title="View Entry"
            >
              <Eye className="w-4 h-4" />
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
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
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={handleBookmark}
                      disabled={isBookmarking}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          entry.isBookmarked
                            ? "text-yellow-500 fill-current"
                            : ""
                        }`}
                      />
                      {isBookmarking
                        ? "Updating..."
                        : entry.isBookmarked
                        ? "Remove Bookmark"
                        : "Bookmark"}
                    </button>
                    <button
                      onClick={handlePin}
                      disabled={isPinning}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Pin
                        className={`w-4 h-4 ${
                          entry.isPinned ? "text-blue-600 fill-current" : ""
                        }`}
                      />
                      {isPinning
                        ? "Updating..."
                        : entry.isPinned
                        ? "Unpin"
                        : "Pin"}
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleViewEntry}
                      className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-xl transition-all border border-blue-100 overflow-hidden group cursor-pointer"
      onClick={handleViewEntry}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TypeIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-center gap-2">
              {entry.isPinned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-1"
                  title="Pinned"
                >
                  <Pin className="w-4 h-4 text-blue-600 fill-current" />
                </motion.div>
              )}
              {entry.isBookmarked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-1"
                  title="Bookmarked"
                >
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </motion.div>
              )}
              {entry.hasReminder && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-1"
                  title="Has Reminder"
                >
                  <Bell className="w-4 h-4 text-orange-500" />
                </motion.div>
              )}
              {entry.isEncrypted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="p-1"
                  title="Encrypted"
                >
                  <Lock className="w-4 h-4 text-purple-500" />
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleViewEntry}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              title="View Entry"
            >
              <Eye className="w-4 h-4" />
            </motion.button>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
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
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={handleBookmark}
                      disabled={isBookmarking}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          entry.isBookmarked
                            ? "text-yellow-500 fill-current"
                            : ""
                        }`}
                      />
                      {isBookmarking
                        ? "Updating..."
                        : entry.isBookmarked
                        ? "Remove Bookmark"
                        : "Bookmark"}
                    </button>
                    <button
                      onClick={handlePin}
                      disabled={isPinning}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Pin
                        className={`w-4 h-4 ${
                          entry.isPinned ? "text-blue-600 fill-current" : ""
                        }`}
                      />
                      {isPinning
                        ? "Updating..."
                        : entry.isPinned
                        ? "Unpin"
                        : "Pin"}
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleViewEntry}
                      className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
              entry.priority
            )}`}
          >
            {entry.priority}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {entry.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {entry.contentPreview || "No preview available..."}
        </p>

        {entry.tags && entry.tags.length > 0 && (
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
              <Calendar className="w-4 h-4" />
              <span>{formatDate(entry.updatedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{entry.wordCount} words</span>
            </div>
          </div>

          {entry.patientName && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="text-xs font-medium text-blue-600">
                {entry.patientName}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default JournalEntryCard;
