import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Bookmark,
  Pin,
  Calendar,
  User,
  Tag,
  FileText,
  AlertTriangle,
  Shield,
  Key,
  Copy,
  Share2,
  Download,
  Printer,
  Heart,
  MessageCircle,
  Clock,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import type { JournalEntryResponse } from "../../types/journal";
import { journalService } from "../../Services/journalService";

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entryId: string;
  onEntryUpdate?: () => void;
}

export const JournalEntryModal: React.FC<JournalEntryModalProps> = ({
  isOpen,
  onClose,
  entryId,
  onEntryUpdate,
}) => {
  const [entry, setEntry] = useState<JournalEntryResponse | null>(null);
  const [encryptionKey, setEncryptionKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(false);

  useEffect(() => {
    if (isOpen && entryId) {
      setEntry(null);
      setEncryptionKey("");
      setError("");
      setIsDecrypted(false);
    }
  }, [isOpen, entryId]);

  const handleDecrypt = async () => {
    if (!encryptionKey.trim()) {
      setError("Please enter encryption key");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const entryData = await journalService.getEntry(entryId, encryptionKey);
      setEntry(entryData);
      setIsDecrypted(true);
    } catch (err: any) {
      setError("Invalid encryption key or unable to decrypt entry");
      console.error("Error decrypting entry:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!entry) return;

    try {
      await journalService.bookmarkEntry({
        entryId: entry.id,
        isBookmarked: !entry.isBookmarked,
      });
      if (onEntryUpdate) onEntryUpdate();
      setEntry((prev) =>
        prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null
      );
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  const handlePin = async () => {
    if (!entry) return;

    try {
      await journalService.pinEntry({
        entryId: entry.id,
        isPinned: !entry.isPinned,
      });
      if (onEntryUpdate) onEntryUpdate();
      setEntry((prev) => (prev ? { ...prev, isPinned: !prev.isPinned } : null));
    } catch (error) {
      console.error("Error updating pin:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: "bg-green-100 text-green-800 border-green-200",
      MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
      HIGH: "bg-orange-100 text-orange-800 border-orange-200",
      URGENT: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[priority as keyof typeof colors] || colors.MEDIUM;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      NOTE: FileText,
      CLINICAL_OBSERVATION: Eye,
      TREATMENT_PLAN: Heart,
      RESEARCH_IDEA: Sparkles,
      PATIENT_FOLLOWUP: User,
      MEETING_NOTES: MessageCircle,
      EDUCATIONAL: Bookmark,
      PERSONAL_REFLECTION: Clock,
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed text-gray-700">
        {paragraph}
      </p>
    ));
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const contentVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 50 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: { scale: 0.8, opacity: 0, y: 50 },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={contentVariants}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden border border-blue-100"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"
                >
                  <Lock className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {isDecrypted ? "Journal Entry" : "Secure Entry"}
                  </h2>
                  <p className="text-blue-100">
                    {isDecrypted
                      ? "Viewing your encrypted journal entry"
                      : "Enter encryption key to view this entry"}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white transition-colors relative z-10"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
            <AnimatePresence mode="wait">
              {!isDecrypted ? (
                // Encryption Key Input
                <motion.div
                  key="encryption-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  >
                    <Shield className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    🔒 Encrypted Entry
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    This journal entry is protected with encryption. Please
                    enter your encryption key to view the contents.
                  </p>

                  <div className="max-w-md mx-auto space-y-4">
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showKey ? "text" : "password"}
                        value={encryptionKey}
                        onChange={(e) => setEncryptionKey(e.target.value)}
                        placeholder="Enter your encryption key..."
                        className="w-full pl-12 pr-12 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                        onKeyPress={(e) => e.key === "Enter" && handleDecrypt()}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showKey ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                      >
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDecrypt}
                      disabled={loading || !encryptionKey.trim()}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <span className="relative flex items-center justify-center gap-3">
                        {loading ? (
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
                            Decrypting...
                          </>
                        ) : (
                          <>
                            <Unlock className="w-5 h-5" />
                            Decrypt Entry
                          </>
                        )}
                      </span>
                    </motion.button>

                    <div className="flex items-center justify-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <AlertTriangle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <p className="text-sm text-blue-700">
                        Your encryption key is never stored on our servers
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                // Entry Details
                <motion.div
                  key="entry-details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Entry Header */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <motion.h1
                          className="text-3xl font-bold text-gray-900 mb-3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {entry?.title}
                        </motion.h1>

                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getPriorityColor(
                              entry?.priority || "MEDIUM"
                            )}`}
                          >
                            <div className="w-2 h-2 rounded-full bg-current opacity-70"></div>
                            {entry?.priority}
                          </motion.span>

                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-200"
                          >
                            {entry &&
                              React.createElement(getTypeIcon(entry.type), {
                                className: "w-3 h-3",
                              })}
                            {entry?.type.replace(/_/g, " ")}
                          </motion.span>

                          {entry?.patientName && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 }}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full border border-green-200"
                            >
                              <User className="w-3 h-3" />
                              {entry.patientName}
                            </motion.span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleBookmark}
                          className={`p-3 rounded-xl transition-all ${
                            entry?.isBookmarked
                              ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <Bookmark
                            className="w-5 h-5"
                            fill={entry?.isBookmarked ? "currentColor" : "none"}
                          />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handlePin}
                          className={`p-3 rounded-xl transition-all ${
                            entry?.isPinned
                              ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          <Pin
                            className="w-5 h-5"
                            fill={entry?.isPinned ? "currentColor" : "none"}
                          />
                        </motion.button>
                      </div>
                    </div>

                    {/* Tags */}
                    {entry?.tags && entry.tags.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap gap-2"
                      >
                        {entry.tags.map((tag, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                  >
                    <div className="prose prose-lg max-w-none">
                      {entry?.content && formatContent(entry.content)}
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Created:{" "}
                            {entry &&
                              new Date(entry.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4" />
                          <span>
                            Updated:{" "}
                            {entry &&
                              new Date(entry.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{entry?.wordCount} words</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Security Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center justify-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl"
                  >
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium">
                      🔐 This entry is securely encrypted and protected
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JournalEntryModal;
