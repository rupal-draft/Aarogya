import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import type { HealthGoal } from "../../../types/patient";
import { DetailModal } from "../../../common/Modals/DetailModal";

interface HealthGoalsCardProps {
  goals: HealthGoal[];
  index: number;
  maxItems?: number;
}

export const HealthGoalsCard: React.FC<HealthGoalsCardProps> = ({
  goals,
  index,
  maxItems = 3,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<HealthGoal | null>(null);
  const displayedGoals = expanded ? goals : goals.slice(0, maxItems);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PAUSED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Health Goals</h3>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              {goals.filter((g) => g.status === "ACTIVE").length} Active
            </span>
          </div>
        </div>

        <div className="space-y-4 flex-grow">
          {displayedGoals.map((goal, goalIndex) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1 + goalIndex * 0.05,
              }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 cursor-pointer group"
              onClick={() => setSelectedGoal(goal)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {goal.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Target className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {goal.title}
                    </h4>
                    <p className="text-sm text-gray-600">{goal.goalType}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      goal.status
                    )}`}
                  >
                    {goal.status}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                      goal.priority
                    )}`}
                  >
                    {goal.priority}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                {goal.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">
                    {Math.round(goal.progressPercentage)}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(goal.progressPercentage, 100)}%`,
                    }}
                    transition={{
                      duration: 1,
                      delay: index * 0.1 + goalIndex * 0.1,
                    }}
                    className={`h-2 rounded-full ${getProgressColor(
                      goal.progressPercentage
                    )}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">
                      Current: {goal.currentValue} {goal.unit}
                    </p>
                    <p className="text-gray-600">
                      Target: {goal.targetValue} {goal.unit}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {goal.formattedTargetDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{goal.daysRemaining} days left</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-800">
                      Status
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {goal.progressText}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end mt-2">
                <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        {goals.length > maxItems && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  View All ({goals.length} goals)
                </>
              )}
            </button>
          </div>
        )}

        {goals.length === 0 && (
          <div className="text-center py-8 flex-grow flex items-center justify-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No health goals set</p>
          </div>
        )}
      </motion.div>

      <DetailModal
        isOpen={!!selectedGoal}
        onClose={() => setSelectedGoal(null)}
        title={selectedGoal?.title || "Goal Details"}
      >
        {selectedGoal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium">{selectedGoal.goalType}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">{selectedGoal.status}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Priority</p>
                <p className="font-medium">{selectedGoal.priority}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="font-medium">
                  {Math.round(selectedGoal.progressPercentage)}%
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Current Value</p>
                <p className="font-medium">
                  {selectedGoal.currentValue} {selectedGoal.unit}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Target Value</p>
                <p className="font-medium">
                  {selectedGoal.targetValue} {selectedGoal.unit}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Description
              </p>
              <p className="text-gray-700">{selectedGoal.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Progress Status
              </p>
              <p className="text-gray-700">{selectedGoal.progressText}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Target Date</p>
                <p className="font-medium">
                  {selectedGoal.formattedTargetDate}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Days Remaining</p>
                <p className="font-medium">{selectedGoal.daysRemaining}</p>
              </div>
            </div>
          </div>
        )}
      </DetailModal>
    </>
  );
};
