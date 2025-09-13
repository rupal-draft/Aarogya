import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Filter,
  Tag,
  User,
  Star,
  Pin,
  Bell,
  Search,
  RefreshCw,
} from "lucide-react";
import type {
  JournalFilterRequest,
  SearchSuggestionResponse,
} from "../../types/journal";
import { journalService } from "../../Services/journalService";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: JournalFilterRequest;
  onFiltersChange: (filters: JournalFilterRequest) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}) => {
  const [localFilters, setLocalFilters] =
    useState<JournalFilterRequest>(filters);
  const [suggestions, setSuggestions] =
    useState<SearchSuggestionResponse | null>(null);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchSuggestions();
    }
  }, [isOpen]);

  const fetchSuggestions = async () => {
    try {
      const data = await journalService.getSearchSuggestions();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleFilterChange = (
    field: keyof JournalFilterRequest,
    value: any
  ) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = (tag: string) => {
    if (!localFilters.tags?.includes(tag)) {
      setLocalFilters((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const addType = (type: string) => {
    if (!localFilters.types?.includes(type)) {
      setLocalFilters((prev) => ({
        ...prev,
        types: [...(prev.types || []), type],
      }));
    }
  };

  const removeType = (typeToRemove: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      types: prev.types?.filter((type) => type !== typeToRemove) || [],
    }));
  };

  const addPriority = (priority: string) => {
    if (!localFilters.priorities?.includes(priority)) {
      setLocalFilters((prev) => ({
        ...prev,
        priorities: [...(prev.priorities || []), priority],
      }));
    }
  };

  const removePriority = (priorityToRemove: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      priorities:
        prev.priorities?.filter((priority) => priority !== priorityToRemove) ||
        [],
    }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters: JournalFilterRequest = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const sidebarVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: { x: "100%" },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Filter className="w-6 h-6" />
                <h2 className="text-xl font-bold">Filters</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Search Query */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Query
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={localFilters.searchQuery || ""}
                  onChange={(e) =>
                    handleFilterChange("searchQuery", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search in entries..."
                />
              </div>
            </div>

            {/* Patient ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={localFilters.patientId || ""}
                  onChange={(e) =>
                    handleFilterChange("patientId", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Filter by patient..."
                />
              </div>
              {suggestions?.patientSuggestions &&
                suggestions.patientSuggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">Suggestions:</p>
                    <div className="flex flex-wrap gap-1">
                      {suggestions.patientSuggestions
                        .slice(0, 5)
                        .map((patient, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleFilterChange("patientId", patient)
                            }
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
                          >
                            {patient}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {localFilters.tags?.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => removeTag(tag)}
                      className="p-0.5 hover:bg-blue-200 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </motion.span>
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag(newTag))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Add tag..."
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addTag(newTag)}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                </motion.button>
              </div>
              {suggestions?.tagSuggestions &&
                suggestions.tagSuggestions.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Popular tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {suggestions.tagSuggestions
                        .slice(0, 8)
                        .map((tag, index) => (
                          <button
                            key={index}
                            onClick={() => addTag(tag)}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Entry Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entry Types
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {localFilters.types?.map((type, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {type.replace("_", " ")}
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => removeType(type)}
                      className="p-0.5 hover:bg-green-200 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </motion.span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "PERSONAL_NOTE",
                  "PATIENT_NOTE",
                  "RESEARCH",
                  "CASE_STUDY",
                  "OBSERVATION",
                ].map((type) => (
                  <button
                    key={type}
                    onClick={() => addType(type)}
                    disabled={localFilters.types?.includes(type)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {type.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Priorities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorities
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {localFilters.priorities?.map((priority, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  >
                    {priority}
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => removePriority(priority)}
                      className="p-0.5 hover:bg-orange-200 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  </motion.span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["LOW", "MEDIUM", "HIGH", "URGENT"].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => addPriority(priority)}
                    disabled={localFilters.priorities?.includes(priority)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={
                      localFilters.startDate
                        ? localFilters.startDate.split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleFilterChange(
                        "startDate",
                        e.target.value ? `${e.target.value}T00:00:00` : ""
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={
                      localFilters.endDate
                        ? localFilters.endDate.split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleFilterChange(
                        "endDate",
                        e.target.value ? `${e.target.value}T23:59:59` : ""
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Filters
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={localFilters.bookmarked || false}
                    onChange={(e) =>
                      handleFilterChange(
                        "bookmarked",
                        e.target.checked || undefined
                      )
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700">Bookmarked only</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={localFilters.pinned || false}
                    onChange={(e) =>
                      handleFilterChange(
                        "pinned",
                        e.target.checked || undefined
                      )
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Pin className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700">Pinned only</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={localFilters.hasReminder || false}
                    onChange={(e) =>
                      handleFilterChange(
                        "hasReminder",
                        e.target.checked || undefined
                      )
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Bell className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-700">Has reminders</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={localFilters.includeInactive || false}
                    onChange={(e) =>
                      handleFilterChange(
                        "includeInactive",
                        e.target.checked || undefined
                      )
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Include inactive entries
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Clear
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={applyFilters}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Apply
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilterSidebar;
