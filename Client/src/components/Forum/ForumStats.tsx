import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  MessageSquare,
  TrendingUp,
  Activity,
  Tag,
  Star,
} from "lucide-react";
import type { ForumStatsResponse } from "../../types/forum";
import { AnimatedCounter } from "../../common/Counter/AnimatedCounter";

interface ForumStatsProps {
  stats: ForumStatsResponse;
}

export const ForumStats: React.FC<ForumStatsProps> = ({ stats }) => {
  const statsData = [
    {
      label: "Total Threads",
      value: stats.totalThreads,
      icon: MessageSquare,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      label: "Total Replies",
      value: stats.totalReplies,
      icon: MessageSquare,
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      label: "My Threads",
      value: stats.myTotalThreads,
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      label: "Active This Week",
      value: stats.activeThisWeek,
      icon: Activity,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        Forum Statistics
      </h2>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className={`${stat.bgColor} rounded-lg p-4 border ${stat.borderColor} hover:shadow-sm transition-all duration-200`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                <AnimatedCounter value={stat.value} duration={1} />
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Popular Tags */}
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-blue-500" />
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {stats.popularTags.map((tag, index) => (
            <motion.span
              key={tag.id}
              className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 border border-blue-200 hover:bg-blue-100 transition-colors"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              #{tag.name}
              <span className="bg-blue-200 text-blue-900 px-1.5 rounded text-xs font-bold">
                {tag.threadCount}
              </span>
            </motion.span>
          ))}
        </div>
      </div>

      {/* Trending Threads */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          Trending Threads
        </h3>
        <div className="space-y-3">
          {stats.trendingThreads.slice(0, 3).map((thread, index) => (
            <motion.div
              key={thread.id}
              className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 2 }}
            >
              <h4 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2 leading-relaxed">
                {thread.title}
              </h4>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                  {thread.upvoteCount} votes
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                  {thread.replyCount} replies
                </span>
                <span className="text-gray-500">by {thread.authorName}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
