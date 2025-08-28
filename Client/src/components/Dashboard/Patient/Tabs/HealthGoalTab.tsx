import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Trophy,
  Activity,
  Heart,
  Apple,
  Moon,
  Brain,
  Droplets,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  Sparkles,
  Zap,
  Flame,
  Star,
} from "lucide-react";

// Type definitions
interface GoalStats {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  overdueGoals: number;
  completionRate: number;
}

interface GoalData {
  id: string;
  patientId: string;
  goalType: string;
  title: string;
  description: string;
  targetValue: string;
  currentValue: string;
  unit: string;
  targetDate: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  formattedTargetDate: string;
  statusBadgeColor: string;
  priorityBadgeColor: string;
  progressPercentage: number;
  daysRemaining: number;
  progressText: string;
  completed: boolean;
  overdue: boolean;
}

interface HealthGoalTabProps {
  goalStats: GoalStats;
  goalsData: GoalData[];
}

// Helper function to get icon based on goal type
const getGoalIcon = (goalType: string) => {
  switch (goalType) {
    case "Weight Management":
      return <Activity className="h-6 w-6" />;
    case "Fitness":
      return <TrendingUp className="h-6 w-6" />;
    case "Blood Pressure Control":
      return <Heart className="h-6 w-6" />;
    case "Cholesterol Management":
      return <BarChart3 className="h-6 w-6" />;
    case "Diet":
      return <Apple className="h-6 w-6" />;
    case "Sleep":
      return <Moon className="h-6 w-6" />;
    case "Stress Management":
      return <Brain className="h-6 w-6" />;
    case "Hydration":
      return <Droplets className="h-6 w-6" />;
    default:
      return <Target className="h-6 w-6" />;
  }
};

// Helper function to get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-gradient-to-r from-red-500 to-orange-500 text-white";
    case "Medium":
      return "bg-gradient-to-r from-yellow-500 to-amber-500 text-white";
    case "Low":
      return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    default:
      return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
  }
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
    case "COMPLETED":
      return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    case "OVERDUE":
      return "bg-gradient-to-r from-red-500 to-rose-500 text-white";
    default:
      return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
  }
};

// Helper function to format progress text color
const getProgressColor = (percentage: number) => {
  if (percentage >= 100) return "from-green-400 to-emerald-600";
  if (percentage >= 70) return "from-blue-400 to-cyan-600";
  if (percentage >= 40) return "from-yellow-400 to-amber-600";
  return "from-red-400 to-rose-600";
};

// Helper function to get goal type gradient
const getGoalTypeGradient = (goalType: string) => {
  switch (goalType) {
    case "Weight Management":
      return "from-purple-500 to-indigo-600";
    case "Fitness":
      return "from-amber-500 to-orange-600";
    case "Blood Pressure Control":
      return "from-rose-500 to-red-600";
    case "Cholesterol Management":
      return "from-emerald-500 to-green-600";
    case "Diet":
      return "from-lime-500 to-green-500";
    case "Sleep":
      return "from-blue-500 to-indigo-600";
    case "Stress Management":
      return "from-violet-500 to-purple-600";
    case "Hydration":
      return "from-cyan-500 to-blue-600";
    default:
      return "from-gray-500 to-slate-600";
  }
};

const HealthGoalTab: React.FC<HealthGoalTabProps> = ({
  goalStats,
  goalsData,
}) => {
  const [filter, setFilter] = useState<
    "all" | "active" | "completed" | "overdue"
  >("all");
  const [sortBy, setSortBy] = useState<"priority" | "date" | "progress">(
    "priority"
  );

  // Filter goals based on selected filter
  const filteredGoals = goalsData.filter((goal) => {
    if (filter === "all") return true;
    if (filter === "active") return goal.status === "ACTIVE";
    if (filter === "completed") return goal.completed;
    if (filter === "overdue") return goal.overdue;
    return true;
  });

  // Sort goals based on selected sort option
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      return (
        priorityOrder[a.priority as keyof typeof priorityOrder] -
        priorityOrder[b.priority as keyof typeof priorityOrder]
      );
    } else if (sortBy === "date") {
      return (
        new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
      );
    } else if (sortBy === "progress") {
      return b.progressPercentage - a.progressPercentage;
    }
    return 0;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const statVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: i * 0.1,
      },
    }),
  };

  const progressBarVariants = {
    hidden: { width: 0 },
    visible: (percentage: number) => ({
      width: `${percentage}%`,
      transition: {
        type: "spring",
        stiffness: 50,
        delay: 0.3,
        duration: 1.5,
      },
    }),
  };

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-cyan-50 min-h-screen">
      {/* Animated background elements */}
      <div className="fixed top-0 right-0 -z-10">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity },
          }}
          className="bg-gradient-to-r from-purple-300 to-pink-300 opacity-20 rounded-full w-96 h-96 blur-xl"
        />
      </div>

      <div className="fixed bottom-0 left-0 -z-10">
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 7, repeat: Infinity },
          }}
          className="bg-gradient-to-r from-cyan-300 to-blue-300 opacity-20 rounded-full w-80 h-80 blur-xl"
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg mb-4">
          <Sparkles className="h-5 w-5" />
          <h1 className="text-3xl font-bold">Your Health Goals</h1>
          <Sparkles className="h-5 w-5" />
        </div>
        <p className="text-indigo-700 font-medium">
          Track and manage your health objectives with style
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Total Goals",
            value: goalStats.totalGoals,
            icon: <Target className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-indigo-500 to-purple-500",
            custom: 0,
          },
          {
            title: "Active Goals",
            value: goalStats.activeGoals,
            icon: <Zap className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
            custom: 1,
          },
          {
            title: "Completed",
            value: goalStats.completedGoals,
            icon: <Trophy className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-green-500 to-emerald-500",
            custom: 2,
          },
          {
            title: "Overdue",
            value: goalStats.overdueGoals,
            icon: <AlertCircle className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-rose-500 to-red-500",
            custom: 3,
          },
          {
            title: "Completion Rate",
            value: `${goalStats.completionRate}%`,
            icon: <CheckCircle2 className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-amber-500 to-orange-500",
            custom: 4,
          },
        ].map((stat) => (
          <motion.div
            key={stat.title}
            className={`rounded-2xl p-5 text-white shadow-lg ${stat.bg} overflow-hidden relative`}
            variants={statVariants}
            initial="hidden"
            animate="visible"
            custom={stat.custom}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            {/* Animated sparkles */}
            <motion.div
              className="absolute top-2 right-2"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{
                rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity },
              }}
            >
              <Star className="h-4 w-4 text-yellow-200" fill="currentColor" />
            </motion.div>

            <div className="flex items-center">
              <div className="p-3 bg-white/20 rounded-xl mr-4 backdrop-blur-sm">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm opacity-90">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>

            {/* Animated progress bar for completion rate */}
            {stat.title === "Completion Rate" && (
              <motion.div
                className="h-1 bg-white/30 rounded-full mt-3"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <motion.div
                  className="h-full bg-yellow-200 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${goalStats.completionRate}%` }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Sorting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md"
      >
        <div className="flex flex-wrap gap-2">
          {[
            {
              key: "all",
              label: "All Goals",
              color: "bg-gradient-to-r from-gray-600 to-slate-600",
            },
            {
              key: "active",
              label: "Active",
              color: "bg-gradient-to-r from-blue-500 to-cyan-500",
            },
            {
              key: "completed",
              label: "Completed",
              color: "bg-gradient-to-r from-green-500 to-emerald-500",
            },
            {
              key: "overdue",
              label: "Overdue",
              color: "bg-gradient-to-r from-rose-500 to-red-500",
            },
          ].map((btn) => (
            <motion.button
              key={btn.key}
              onClick={() => setFilter(btn.key as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium text-white shadow-md ${
                filter === btn.key
                  ? btn.color
                  : "bg-gradient-to-r from-gray-400 to-slate-400"
              }`}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-sm">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            className="bg-transparent py-1 text-sm focus:outline-none focus:ring-0"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "priority" | "date" | "progress")
            }
          >
            <option value="priority">Priority</option>
            <option value="date">Due Date</option>
            <option value="progress">Progress</option>
          </select>
        </div>
      </motion.div>

      {/* Goals List */}
      <motion.div
        className="grid grid-cols-1 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {sortedGoals.map((goal) => (
            <motion.div
              key={goal.id}
              variants={itemVariants}
              layout
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-0 relative"
            >
              {/* Goal type accent bar */}
              <div
                className={`h-2 bg-gradient-to-r ${getGoalTypeGradient(
                  goal.goalType
                )}`}
              />

              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${getGoalTypeGradient(
                        goal.goalType
                      )} text-white shadow-md`}
                    >
                      {getGoalIcon(goal.goalType)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {goal.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{goal.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            goal.priority
                          )} shadow-sm`}
                        >
                          {goal.priority} Priority
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            goal.status
                          )} shadow-sm`}
                        >
                          {goal.status}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {goal.formattedTargetDate}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Clock className="h-3 w-3 mr-1" />
                          {goal.daysRemaining} days left
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-2 mb-2 justify-end">
                      <span
                        className={`text-sm font-medium ${
                          goal.progressPercentage >= 100
                            ? "text-green-600"
                            : "text-gray-700"
                        }`}
                      >
                        {goal.progressText}
                      </span>
                      <span className="text-lg font-bold text-gray-800">
                        {goal.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${getProgressColor(
                          goal.progressPercentage
                        )}`}
                        variants={progressBarVariants}
                        initial="hidden"
                        animate="visible"
                        custom={goal.progressPercentage}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Progress:{" "}
                        <span className="font-semibold">
                          {goal.currentValue}
                          {goal.unit}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold">
                          {goal.targetValue}
                          {goal.unit}
                        </span>
                      </p>
                      <div className="flex items-center text-sm">
                        {goal.progressPercentage >= 100 ? (
                          <>
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0],
                              }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <CheckCircle2 className="h-5 w-5 text-green-500 mr-1" />
                            </motion.div>
                            <span className="text-green-600 font-medium">
                              Goal achieved!
                            </span>
                          </>
                        ) : goal.overdue ? (
                          <>
                            <motion.div
                              animate={{ x: [0, -3, 3, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                            >
                              <AlertCircle className="h-5 w-5 text-red-500 mr-1" />
                            </motion.div>
                            <span className="text-red-600 font-medium">
                              Overdue - Take action!
                            </span>
                          </>
                        ) : (
                          <>
                            <motion.div
                              animate={{ rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Clock className="h-5 w-5 text-blue-500 mr-1" />
                            </motion.div>
                            <span className="text-blue-600 font-medium">
                              In progress - Keep going!
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-medium transition-all shadow-md flex items-center gap-2"
                    >
                      <Flame className="h-4 w-4" />
                      Update Progress
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Animated completion sparkle */}
              {goal.progressPercentage >= 100 && (
                <motion.div
                  className="absolute top-4 right-4"
                  animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                  transition={{
                    rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity },
                  }}
                >
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {sortedGoals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border-0 mt-6"
        >
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No goals found
          </h3>
          <p className="text-gray-500">
            Try changing your filters or create new goals
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default HealthGoalTab;
