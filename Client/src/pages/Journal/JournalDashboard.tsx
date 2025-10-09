import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  FileText,
  Bell,
  Layout,
  ChevronDown,
  Grid,
  List,
  Eye,
} from "lucide-react";
import type {
  JournalEntrySummaryResponse,
  JournalStatsResponse,
  JournalFilterRequest,
} from "../../types/journal";
import { journalService } from "../../Services/journalService";
import StatsOverview from "../../components/Journal/StatsOverview";
import JournalEntryCard from "../../components/Journal/JournalEntryCard";
import FilterSidebar from "../../components/Journal/FilterSidebar";
import ReminderPanel from "../../components/Journal/ReminderPanel";
import TemplateModal from "../../components/Journal/TemplateModal";
import CreateEntryModal from "../../components/Journal/CreateEntryModal";
import JournalEntryModal from "../../components/Journal/JournalEntryModal";

const JournalDashboard: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntrySummaryResponse[]>([]);
  const [stats, setStats] = useState<JournalStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [showReminderPanel, setShowReminderPanel] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<JournalFilterRequest>({});

  useEffect(() => {
    fetchEntries();
    fetchStats();
  }, [filters, sortBy, sortOrder, currentPage]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await journalService.getEntries(
        { ...filters, searchQuery },
        currentPage,
        20,
        sortBy,
        sortOrder
      );
      setEntries(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await journalService.getJournalStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
    fetchEntries();
  };

  const handleFilterChange = (newFilters: JournalFilterRequest) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handleEntryUpdate = () => {
    fetchEntries();
    fetchStats();
  };

  const handleViewEntry = (entryId: string) => {
    setSelectedEntryId(entryId);
    setShowEntryModal(true);
  };

  const handleEntryModalClose = () => {
    setShowEntryModal(false);
    setSelectedEntryId(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-blue-100 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Medical Journal
                  </h1>
                  <p className="text-sm text-gray-600">
                    Document your medical insights
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick View Stats */}
              {stats && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hidden md:flex items-center gap-4 text-sm text-gray-600"
                >
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>{stats.totalEntries} entries</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-green-500" />
                    <span>{stats.entriesThisWeek} this week</span>
                  </div>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReminderPanel(true)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {stats && stats.entriesThisWeek > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTemplateModal(true)}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Layout className="w-4 h-4" />
                Templates
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 20px -5px rgba(59, 130, 246, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg relative overflow-hidden group"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Plus className="w-4 h-4 relative z-10" />
                <span className="relative z-10">New Entry</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        {stats && (
          <motion.div variants={itemVariants} className="mb-8">
            <StatsOverview stats={stats} />
          </motion.div>
        )}

        {/* Search and Controls */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search entries by title, content, or tags..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilterSidebar(true)}
                className="flex items-center gap-2 px-3 py-2 bg-white/80 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                {Object.keys(filters).length > 0 && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                )}
              </motion.button>

              <div className="flex items-center bg-white/80 border border-blue-200 rounded-lg overflow-hidden">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition-colors`}
                >
                  <Grid className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition-colors`}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("-");
                    setSortBy(field);
                    setSortOrder(order as "ASC" | "DESC");
                  }}
                  className="appearance-none bg-white/80 border border-blue-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="updatedAt-DESC">Latest First</option>
                  <option value="updatedAt-ASC">Oldest First</option>
                  <option value="title-ASC">Title A-Z</option>
                  <option value="title-DESC">Title Z-A</option>
                  <option value="wordCount-DESC">Most Words</option>
                  <option value="wordCount-ASC">Least Words</option>
                  <option value="priority-DESC">Priority (High to Low)</option>
                  <option value="priority-ASC">Priority (Low to High)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Entries Grid/List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full"
                />
                <p className="text-gray-600">Loading your journal entries...</p>
              </motion.div>
            </motion.div>
          ) : entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Entries Found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || Object.keys(filters).length > 0
                  ? "Try adjusting your search or filters"
                  : "Start documenting your medical insights"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                Create Your First Entry
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <JournalEntryCard
                    entry={entry}
                    viewMode={viewMode}
                    onUpdate={handleEntryUpdate}
                    onViewEntry={handleViewEntry}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-2 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-white border border-blue-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
              Previous
            </motion.button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + Math.max(0, currentPage - 2);
                if (pageNum >= totalPages) return null;

                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-all ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white border border-blue-200 text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {pageNum + 1}
                  </motion.button>
                );
              })}
            </div>

            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
              }
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-white border border-blue-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              Next
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Modals and Sidebars */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateEntryModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleEntryUpdate}
          />
        )}

        {showTemplateModal && (
          <TemplateModal
            isOpen={showTemplateModal}
            onClose={() => setShowTemplateModal(false)}
            onSuccess={handleEntryUpdate}
          />
        )}

        {showFilterSidebar && (
          <FilterSidebar
            isOpen={showFilterSidebar}
            onClose={() => setShowFilterSidebar(false)}
            filters={filters}
            onFiltersChange={handleFilterChange}
          />
        )}

        {showReminderPanel && (
          <ReminderPanel
            isOpen={showReminderPanel}
            onClose={() => setShowReminderPanel(false)}
          />
        )}

        {showEntryModal && selectedEntryId && (
          <JournalEntryModal
            isOpen={showEntryModal}
            onClose={handleEntryModalClose}
            entryId={selectedEntryId}
            onEntryUpdate={handleEntryUpdate}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JournalDashboard;
