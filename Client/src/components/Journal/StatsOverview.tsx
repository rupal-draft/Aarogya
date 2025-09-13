import React from "react";
import { motion } from "framer-motion";
import { FileText, Star, Pin, Calendar, Users, BarChart3 } from "lucide-react";
import type { JournalStatsResponse } from "../../types/journal";

interface StatsOverviewProps {
  stats: JournalStatsResponse;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const statCards = [
    {
      icon: FileText,
      label: "Total Entries",
      value: stats.totalEntries,
      color: "blue",
      change: `+${stats.entriesThisWeek} this week`,
    },
    {
      icon: Star,
      label: "Bookmarked",
      value: stats.bookmarkedEntries,
      color: "yellow",
      change: `${Math.round(
        (stats.bookmarkedEntries / stats.totalEntries) * 100
      )}% of total`,
    },
    {
      icon: Pin,
      label: "Pinned",
      value: stats.pinnedEntries,
      color: "indigo",
      change: "Quick access",
    },
    {
      icon: Users,
      label: "Patient Notes",
      value: stats.patientNotes,
      color: "green",
      change: `${stats.personalNotes} personal`,
    },
    {
      icon: BarChart3,
      label: "Total Words",
      value: stats.totalWords.toLocaleString(),
      color: "purple",
      change: `Avg ${Math.round(
        stats.totalWords / stats.totalEntries
      )} per entry`,
    },
    {
      icon: Calendar,
      label: "This Month",
      value: stats.entriesThisMonth,
      color: "orange",
      change: stats.lastEntryDate
        ? `Last: ${new Date(stats.lastEntryDate).toLocaleDateString()}`
        : "No entries yet",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
    >
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          variants={cardVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-${stat.color}-100`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
            <div className="text-right">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
                className={`text-2xl font-bold text-${stat.color}-600`}
              >
                {stat.value}
              </motion.div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {stat.label}
            </h3>
            <p className="text-xs text-gray-500">{stat.change}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsOverview;
