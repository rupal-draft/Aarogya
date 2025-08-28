import { motion } from "framer-motion";
import { Target } from "lucide-react";
import GlassCard from "../../../../common/Cards/GlassCard";

const GoalCard = ({ goal }: { goal: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <GlassCard className="p-6 bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 shadow-lg rounded-2xl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="p-2 bg-sky-100 rounded-lg shadow-sm"
          >
            <Target className="w-5 h-5 text-sky-600" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-gray-900 tracking-tight">
              {goal.goalType}
            </h3>
            <p className="text-sm text-gray-700">
              {goal.currentValue} / {goal.targetValue} {goal.unit}
            </p>
          </div>
        </div>

        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm ${
            goal.status === "On Track"
              ? "bg-green-100 text-green-800"
              : goal.status === "Behind"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {goal.status}
        </motion.span>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700">Progress</span>
          <span className="font-medium text-gray-900">
            {goal.progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-sky-200 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goal.progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 h-2 rounded-full"
          />
        </div>
      </div>

      {/* Target date */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-xs text-gray-600"
      >
        🎯 Target Date:{" "}
        <span className="font-medium text-gray-800">
          {new Date(goal.targetDate).toLocaleDateString()}
        </span>
      </motion.div>
    </GlassCard>
  </motion.div>
);

export default GoalCard;
