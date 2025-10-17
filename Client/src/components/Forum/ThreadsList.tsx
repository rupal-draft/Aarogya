import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  SortDesc,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Clock,
  Star,
  ChevronDown,
} from "lucide-react";
import type {
  ThreadSummaryResponse,
  ThreadFilterRequest,
  PageResponse,
} from "../../types/forum";
import { ThreadCard } from "./ThreadCard";
import { AnimatedCounter } from "../../common/Counter/AnimatedCounter2";

interface ThreadsListProps {
  threads: PageResponse<ThreadSummaryResponse>;
  filter: ThreadFilterRequest;
  onFilterChange: (filter: Partial<ThreadFilterRequest>) => void;
  onThreadClick: (threadId: string) => void;
  onVote: (
    threadId: string,
    voteType: "UPVOTE" | "DOWNVOTE" | "NEUTRAL"
  ) => void;
  onBookmark: (threadId: string) => void;
  onCreateThread: () => void;
}

export const ThreadsList: React.FC<ThreadsListProps> = ({
  threads,
  filter,
  onFilterChange,
  onThreadClick,
  onVote,
  onBookmark,
  onCreateThread,
}) => {
  const [searchQuery, setSearchQuery] = useState(filter.searchQuery || "");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ searchQuery, page: 0 });
  };

  const sortOptions = [
    { value: "createdAt", label: "Latest", icon: Clock },
    { value: "upvoteCount", label: "Most Voted", icon: TrendingUp },
    { value: "replyCount", label: "Most Replied", icon: MessageSquare },
    { value: "viewCount", label: "Most Viewed", icon: Star },
  ];

  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "QUESTION", label: "Questions" },
    { value: "DISCUSSION", label: "Discussions" },
    { value: "CASE_STUDY", label: "Case Studies" },
    { value: "ANNOUNCEMENT", label: "Announcements" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Medical Forum
            </h1>
            <p className="text-sm text-gray-600">
              Connect, discuss, and share knowledge with fellow doctors
            </p>
          </div>

          <motion.button
            onClick={onCreateThread}
            className="bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            New Thread
          </motion.button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <motion.button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Search
            </motion.button>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              whileHover={{ scale: 1.02 }}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </motion.button>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <SortDesc className="w-4 h-4 text-gray-500" />
              <select
                value={filter.sortBy || "createdAt"}
                onChange={(e) =>
                  onFilterChange({ sortBy: e.target.value, page: 0 })
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <select
              value={filter.type || ""}
              onChange={(e) =>
                onFilterChange({ type: e.target.value || undefined, page: 0 })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Quick Filters */}
            <motion.button
              onClick={() =>
                onFilterChange({ bookmarked: !filter.bookmarked, page: 0 })
              }
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter.bookmarked
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              whileHover={{ scale: 1.02 }}
            >
              Bookmarked
            </motion.button>

            <motion.button
              onClick={() =>
                onFilterChange({ participated: !filter.participated, page: 0 })
              }
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter.participated
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              whileHover={{ scale: 1.02 }}
            >
              My Threads
            </motion.button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
          <span>
            Showing <AnimatedCounter value={threads.numberOfElements} /> of{" "}
            <AnimatedCounter value={threads.totalElements} /> threads
          </span>
          <span>
            Page {threads.number + 1} of {threads.totalPages}
          </span>
        </div>
      </motion.div>

      {/* Threads List */}
      <div className="space-y-4">
        {threads.content.map((thread, index) => (
          <ThreadCard
            key={thread.id}
            thread={thread}
            index={index}
            onThreadClick={onThreadClick}
            onVote={onVote}
            onBookmark={onBookmark}
          />
        ))}
      </div>

      {/* Pagination */}
      {threads.totalPages > 1 && (
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() =>
              onFilterChange({ page: Math.max(0, threads.number - 1) })
            }
            disabled={threads.first}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            whileHover={{ scale: threads.first ? 1 : 1.02 }}
          >
            Previous
          </motion.button>

          <span className="px-4 py-2 text-gray-600 text-sm">
            Page {threads.number + 1} of {threads.totalPages}
          </span>

          <motion.button
            onClick={() =>
              onFilterChange({
                page: Math.min(threads.totalPages - 1, threads.number + 1),
              })
            }
            disabled={threads.last}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            whileHover={{ scale: threads.last ? 1 : 1.02 }}
          >
            Next
          </motion.button>
        </motion.div>
      )}

      {threads.content.length === 0 && (
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No threads found
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {filter.searchQuery
              ? `No threads match your search for "${filter.searchQuery}"`
              : "Be the first to start a discussion!"}
          </p>
          <motion.button
            onClick={onCreateThread}
            className="bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create First Thread
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
