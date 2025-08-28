import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Brain,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  Zap,
  Flame,
  Star,
  Sparkles,
  Stethoscope,
  Thermometer,
  AlertTriangle,
  HeartPulse,
  Bandage,
  Biohazard,
} from "lucide-react";

// Type definitions
interface ConditionData {
  id: string;
  conditionName: string;
  diagnosisDate: string;
  status: string;
  notes: string;
  severity: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  formattedDiagnosisDate: string;
  statusBadgeColor: string;
  severityBadgeColor: string;
  categoryBadgeColor: string;
  daysSinceDiagnosis: number;
  timeAgo: string;
  active: boolean;
  critical: boolean;
}

interface MedicalHistoryTabProps {
  conditionsData: ConditionData[];
}

// Helper function to get icon based on condition category
const getConditionIcon = (category: string) => {
  switch (category) {
    case "Chronic":
      return <Activity className="h-6 w-6" />;
    case "Respiratory":
      return <Thermometer className="h-6 w-6" />; // Using Thermometer as substitute for Lung
    case "Infectious Disease":
      return <Biohazard className="h-6 w-6" />;
    case "Neurological":
      return <Brain className="h-6 w-6" />;
    case "Viral":
      return <Biohazard className="h-6 w-6" />;
    case "Allergy":
      return <AlertTriangle className="h-6 w-6" />; // Using AlertTriangle as substitute for Allergy
    case "Blood Disorder":
      return <HeartPulse className="h-6 w-6" />; // Using HeartPulse as substitute for Blood
    case "Renal":
      return <Bandage className="h-6 w-6" />; // Using Bandage as substitute for Kidney
    default:
      return <Stethoscope className="h-6 w-6" />;
  }
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-gradient-to-r from-red-500 to-rose-600 text-white";
    case "Recovered":
      return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
    default:
      return "bg-gradient-to-r from-gray-500 to-slate-600 text-white";
  }
};

// Helper function to get severity color
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "Severe":
      return "bg-gradient-to-r from-red-600 to-orange-600 text-white";
    case "Moderate":
      return "bg-gradient-to-r from-yellow-500 to-amber-600 text-white";
    case "Mild":
      return "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
    default:
      return "bg-gradient-to-r from-gray-500 to-slate-600 text-white";
  }
};

// Helper function to get category color
const getCategoryColor = (category: string) => {
  switch (category) {
    case "Chronic":
      return "from-purple-500 to-indigo-600";
    case "Respiratory":
      return "from-cyan-500 to-blue-600";
    case "Infectious Disease":
      return "from-rose-500 to-red-600";
    case "Neurological":
      return "from-violet-500 to-purple-600";
    case "Viral":
      return "from-pink-500 to-rose-600";
    case "Allergy":
      return "from-amber-500 to-orange-600";
    case "Blood Disorder":
      return "from-red-500 to-pink-600";
    case "Renal":
      return "from-blue-500 to-cyan-600";
    default:
      return "from-gray-500 to-slate-600";
  }
};

const MedicalHistoryTab: React.FC<MedicalHistoryTabProps> = ({
  conditionsData,
}) => {
  const [filter, setFilter] = useState<
    "all" | "active" | "recovered" | "critical"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "severity" | "name">("date");

  // Calculate stats
  const stats = {
    totalConditions: conditionsData.length,
    activeConditions: conditionsData.filter((c) => c.status === "Active")
      .length,
    recoveredConditions: conditionsData.filter((c) => c.status === "Recovered")
      .length,
    criticalConditions: conditionsData.filter((c) => c.critical).length,
  };

  // Filter conditions based on selected filter
  const filteredConditions = conditionsData.filter((condition) => {
    if (filter === "all") return true;
    if (filter === "active") return condition.status === "Active";
    if (filter === "recovered") return condition.status === "Recovered";
    if (filter === "critical") return condition.critical;
    return true;
  });

  // Sort conditions based on selected sort option
  const sortedConditions = [...filteredConditions].sort((a, b) => {
    if (sortBy === "date") {
      return (
        new Date(b.diagnosisDate).getTime() -
        new Date(a.diagnosisDate).getTime()
      );
    } else if (sortBy === "severity") {
      const severityOrder = { Severe: 1, Moderate: 2, Mild: 3 };
      return (
        severityOrder[a.severity as keyof typeof severityOrder] -
        severityOrder[b.severity as keyof typeof severityOrder]
      );
    } else if (sortBy === "name") {
      return a.conditionName.localeCompare(b.conditionName);
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

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 min-h-screen">
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
          className="bg-gradient-to-r from-blue-300 to-cyan-300 opacity-20 rounded-full w-96 h-96 blur-xl"
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
          className="bg-gradient-to-r from-indigo-300 to-purple-300 opacity-20 rounded-full w-80 h-80 blur-xl"
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full shadow-lg mb-4">
          <Sparkles className="h-5 w-5" />
          <h1 className="text-3xl font-bold">Medical History</h1>
          <Sparkles className="h-5 w-5" />
        </div>
        <p className="text-blue-700 font-medium">
          Comprehensive overview of patient medical conditions
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Total Conditions",
            value: stats.totalConditions,
            icon: <Stethoscope className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-indigo-500 to-purple-500",
            custom: 0,
          },
          {
            title: "Active Conditions",
            value: stats.activeConditions,
            icon: <Activity className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-red-500 to-rose-500",
            custom: 1,
          },
          {
            title: "Recovered",
            value: stats.recoveredConditions,
            icon: <CheckCircle2 className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-green-500 to-emerald-500",
            custom: 2,
          },
          {
            title: "Critical",
            value: stats.criticalConditions,
            icon: <AlertCircle className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-orange-500 to-amber-500",
            custom: 3,
          },
        ].map((stat, i) => (
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
              label: "All Conditions",
              color: "bg-gradient-to-r from-gray-600 to-slate-600",
            },
            {
              key: "active",
              label: "Active",
              color: "bg-gradient-to-r from-red-500 to-rose-500",
            },
            {
              key: "recovered",
              label: "Recovered",
              color: "bg-gradient-to-r from-green-500 to-emerald-500",
            },
            {
              key: "critical",
              label: "Critical",
              color: "bg-gradient-to-r from-orange-500 to-amber-500",
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
              setSortBy(e.target.value as "date" | "severity" | "name")
            }
          >
            <option value="date">Diagnosis Date</option>
            <option value="severity">Severity</option>
            <option value="name">Condition Name</option>
          </select>
        </div>
      </motion.div>

      {/* Conditions List */}
      <motion.div
        className="grid grid-cols-1 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {sortedConditions.map((condition) => (
            <motion.div
              key={condition.id}
              variants={itemVariants}
              layout
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-0 relative"
            >
              {/* Condition category accent bar */}
              <div
                className={`h-2 bg-gradient-to-r ${getCategoryColor(
                  condition.category
                )}`}
              />

              {/* Critical condition indicator */}
              {condition.critical && (
                <motion.div
                  className="absolute top-4 right-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Critical
                  </div>
                </motion.div>
              )}

              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${getCategoryColor(
                        condition.category
                      )} text-white shadow-md`}
                    >
                      {getConditionIcon(condition.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          {condition.conditionName}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            condition.status
                          )} shadow-sm`}
                        >
                          {condition.status}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">{condition.notes}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                            condition.severity
                          )} shadow-sm`}
                        >
                          {condition.severity} Severity
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {condition.category}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Calendar className="h-3 w-3 mr-1" />
                          Diagnosed: {condition.formattedDiagnosisDate}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Clock className="h-3 w-3 mr-1" />
                          {condition.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center text-sm">
                      {condition.status === "Active" ? (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Activity className="h-5 w-5 text-red-500 mr-1" />
                          </motion.div>
                          <span className="text-red-600 font-medium">
                            Ongoing condition - Regular monitoring needed
                          </span>
                        </>
                      ) : (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-1" />
                          </motion.div>
                          <span className="text-green-600 font-medium">
                            Successfully recovered
                          </span>
                        </>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl text-sm font-medium transition-all shadow-md flex items-center gap-2"
                    >
                      <Flame className="h-4 w-4" />
                      View Details
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Animated recovered sparkle */}
              {condition.status === "Recovered" && (
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

      {sortedConditions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border-0 mt-6"
        >
          <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No conditions found
          </h3>
          <p className="text-gray-500">Try changing your filters</p>
        </motion.div>
      )}
    </div>
  );
};

export default MedicalHistoryTab;
