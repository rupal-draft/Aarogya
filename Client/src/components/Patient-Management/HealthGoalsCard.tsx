import React from "react";
import { motion } from "framer-motion";
import { Target, Calendar, AlertCircle } from "lucide-react";
import type { HealthGoal } from "../../types/patientManagement";

interface HealthGoalsCardProps {
  goals: HealthGoal[];
}

export const HealthGoalsCard: React.FC<HealthGoalsCardProps> = ({ goals }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Target className="w-6 h-6 text-blue-500" />
        Health Goals
        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full ml-2">
          {goals.length}
        </span>
      </h2>

      <div className="space-y-4">
        {goals.map((goal, index) => {
          const progress = Math.min(
            (goal.currentValue / goal.targetValue) * 100,
            100
          );
          const daysLeft = Math.ceil(
            (new Date(goal.targetDate).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24)
          );

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
                    {goal.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {goal.description}
                  </p>
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {goal.goalType}
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
                    Progress: {goal.currentValue} / {goal.targetValue}{" "}
                    {goal.unit}
                  </span>
                  <span className="font-semibold">{progress.toFixed(1)}%</span>
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
                  Target: {new Date(goal.targetDate).toLocaleDateString()}
                </span>
                <span
                  className={`font-medium ${
                    daysLeft > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
