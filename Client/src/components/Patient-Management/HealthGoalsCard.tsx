// components/Patient-Management/HealthGoalsCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { Target, Calendar, AlertCircle, Eye } from "lucide-react";
import type { HealthGoal } from "../../types/patientManagement";

interface HealthGoalsCardProps {
  goals: HealthGoal[];
  onViewAll?: () => void;
  totalCount?: number;
}

export const HealthGoalsCard: React.FC<HealthGoalsCardProps> = ({
  goals,
  onViewAll,
  totalCount = 0,
}) => {
  const showViewAll = totalCount > 3;

  const safeValue = (val: any, fallback: string = "N/A") =>
    val !== undefined && val !== null ? val : fallback;

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-500" />
          Health Goals
          <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full ml-2">
            {totalCount}
          </span>
        </h2>
        {showViewAll && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewAll}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            View All
          </motion.button>
        )}
      </div>

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No health goals found
          </div>
        ) : (
          goals.map((goal, index) => {
            const progress =
              goal.targetValue > 0
                ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
                : 0;
            const daysLeft = goal.targetDate
              ? Math.ceil(
                  (new Date(goal.targetDate).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : 0;

            return (
              <motion.div
                key={goal.id}
                className={`rounded-xl p-4 border-2 ${getPriorityColor(
                  goal.priority
                )}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {safeValue(goal.title)}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {safeValue(goal.description)}
                    </p>
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {safeValue(goal.goalType)}
                    </span>
                  </div>
                  {goal.priority === "High" && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    </motion.div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>
                      Progress: {safeValue(goal.currentValue)} /{" "}
                      {safeValue(goal.targetValue)} {safeValue(goal.unit)}
                    </span>
                    <span className="font-semibold">
                      {progress.toFixed(1)}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className={`h-full ${getProgressColor(
                        progress
                      )} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Target:{" "}
                    {goal.targetDate
                      ? new Date(goal.targetDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                  <span
                    className={`font-medium ${
                      daysLeft > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {daysLeft > 0
                      ? `${daysLeft} days left`
                      : goal.targetDate
                      ? "Overdue"
                      : "No target date"}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};
