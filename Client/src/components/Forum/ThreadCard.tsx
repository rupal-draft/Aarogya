import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Eye,
  Bookmark,
  BookmarkCheck,
  Clock,
  Tag,
  User,
  Lock,
  MoreHorizontal,
} from "lucide-react";
import type { ThreadSummaryResponse } from "../../types/forum";
import { AnimatedCounter } from "../../common/Counter/AnimatedCounter2";

interface ThreadCardProps {
  thread: ThreadSummaryResponse;
  index: number;
  onThreadClick: (threadId: string) => void;
  onVote: (
    threadId: string,
    voteType: "UPVOTE" | "DOWNVOTE" | "NEUTRAL"
  ) => void;
  onBookmark: (threadId: string) => void;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({
  thread,
  index,
  onThreadClick,
  onVote,
  onBookmark,
}) => {
  const getTypeColor = (type: string) => {
    const colors = {
      QUESTION: "bg-blue-100 text-blue-800 border-blue-200",
      DISCUSSION: "bg-green-100 text-green-800 border-green-200",
      CASE_STUDY: "bg-purple-100 text-purple-800 border-purple-200",
      ANNOUNCEMENT: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return (
      colors[type as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "QUESTION":
        return "❓";
      case "DISCUSSION":
        return "💬";
      case "CASE_STUDY":
        return "📋";
      case "ANNOUNCEMENT":
        return "📢";
      default:
        return "📝";
    }
  };

  const handleVote = async (voteType: "UPVOTE" | "DOWNVOTE") => {
    const currentVote = thread.userVote || 0;
    let newVote: number;
    let voteDelta = 0;

    if (voteType === "UPVOTE") {
      if (currentVote === 1) {
        newVote = 0;
        voteDelta = -1;
      } else {
        newVote = 1;
        voteDelta = currentVote === -1 ? 2 : 1;
      }
    } else {
      if (currentVote === -1) {
        newVote = 0;
        voteDelta = 1;
      } else {
        newVote = -1;
        voteDelta = currentVote === 1 ? -2 : -1;
      }
    }

    onVote(
      thread.id,
      voteType === "UPVOTE"
        ? currentVote === 1
          ? "NEUTRAL"
          : "UPVOTE"
        : currentVote === -1
        ? "NEUTRAL"
        : "DOWNVOTE"
    );
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex">
        {/* Vote Section */}
        <div className="flex flex-col items-center p-4 bg-gray-50 border-r border-gray-200 min-w-[80px]">
          <motion.button
            className={`p-2 rounded-full transition-colors ${
              thread.userVote === 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleVote("UPVOTE");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>

          <motion.div
            className="text-base font-bold text-gray-900 my-2"
            key={thread.upvoteCount}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatedCounter value={thread.upvoteCount} duration={0.5} />
          </motion.div>

          <motion.button
            className={`p-2 rounded-full transition-colors ${
              thread.userVote === -1
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-600"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleVote("DOWNVOTE");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Content Section */}
        <div
          className="flex-1 p-4 cursor-pointer"
          onClick={() => onThreadClick(thread.id)}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                  thread.type
                )}`}
              >
                {getTypeIcon(thread.type)} {thread.type.replace("_", " ")}
              </span>
              {thread.isClosed && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium border border-red-200 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Closed
                </span>
              )}
              {thread.isAnonymous && (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  Anonymous
                </span>
              )}
            </div>

            <motion.button
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              whileHover={{ scale: 1.05 }}
            >
              <MoreHorizontal className="w-4 h-4" />
            </motion.button>
          </div>

          <h3 className="text-base font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {thread.title}
          </h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {thread.contentPreview}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {thread.tags.slice(0, 4).map((tag, tagIndex) => (
              <motion.span
                key={tagIndex}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + tagIndex * 0.02 }}
                whileHover={{ scale: 1.03 }}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </motion.span>
            ))}
            {thread.tags.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                +{thread.tags.length - 4} more
              </span>
            )}
          </div>

          {/* Author and Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="font-medium">
                  {thread.isAnonymous ? "Anonymous" : thread.authorName}
                </span>
                {!thread.isAnonymous && thread.authorSpecialization && (
                  <span className="text-blue-600">
                    • {thread.authorSpecialization}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Eye className="w-3 h-3" />
                <AnimatedCounter value={thread.viewCount} duration={0.5} />
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <MessageSquare className="w-3 h-3" />
                <AnimatedCounter value={thread.replyCount} duration={0.5} />
              </div>
              <motion.button
                className={`p-1 rounded-full transition-colors ${
                  thread.isBookmarked
                    ? "text-yellow-500 hover:text-yellow-600"
                    : "text-gray-400 hover:text-yellow-500"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark(thread.id);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {thread.isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
