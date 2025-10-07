// components/Patient-Management/StatisticsCard.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Activity,
  Calendar,
  BarChart3,
  Heart,
  Pill,
} from "lucide-react";

interface StatisticsCardProps {
  data: {
    totalMedications: number;
    totalAllergies: number;
    totalSymptoms: number;
    totalGoals: number;
    totalNotes: number;
    totalConditions: number;
  };
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ data }) => {
  const stats = [
    {
      label: "Active Medications",
      value: data.totalMedications,
      icon: Pill,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      label: "Known Allergies",
      value: data.totalAllergies,
      icon: Activity,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      label: "Recent Symptoms",
      value: data.totalSymptoms,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
    {
      label: "Health Goals",
      value: data.totalGoals,
      icon: BarChart3,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      label: "Doctor Notes",
      value: data.totalNotes,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      label: "Medical Conditions",
      value: data.totalConditions,
      icon: Heart,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
  ];

  const AnimatedNumber = ({ value }: { value: number }) => {
    return (
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 1.5,
        }}
        className="font-bold"
      >
        {value}
      </motion.span>
    );
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-blue-500" />
        Health Statistics
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, repeatDelay: 2 }}
          className="ml-2"
        >
          📊
        </motion.div>
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className={`rounded-xl p-4 border-2 ${stat.borderColor} ${stat.bgColor} hover:shadow-md transition-all duration-300`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 },
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor} bg-opacity-50`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: index * 0.2,
                  }}
                />
              </div>

              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                <AnimatedNumber value={stat.value} />
              </div>

              <div className="text-xs text-gray-600 font-medium">
                {stat.label}
              </div>

              {/* Progress bar indicator */}
              <motion.div
                className="w-full bg-white bg-opacity-50 rounded-full h-1 mt-2 overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
              >
                <motion.div
                  className={`h-full ${stat.color.replace(
                    "text-",
                    "bg-"
                  )} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((stat.value / 10) * 100, 100)}%`,
                  }}
                  transition={{
                    delay: index * 0.1 + 0.8,
                    duration: 1.2,
                    type: "spring",
                    stiffness: 50,
                  }}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Section */}
      <motion.div
        className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Total Records
            </h3>
            <motion.p
              className="text-2xl font-bold text-blue-600"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4, type: "spring" }}
            >
              {Object.values(data).reduce((a, b) => a + b, 0)}
            </motion.p>
          </div>
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              repeatDelay: 3,
            }}
          >
            <div className="text-2xl">🏥</div>
          </motion.div>
        </div>
        <motion.p
          className="text-xs text-gray-600 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          Comprehensive health overview with all patient data
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
