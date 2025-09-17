import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Activity,
  Shield,
  Pill,
  Target,
  Users,
  Calendar,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import type { Statistics } from "../../../types/patient";
import { CounterAnimation } from "../../../common/Counter/CounterAnimation";

interface StatisticsCardProps {
  statistics: Statistics;
  index: number;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  statistics,
  index,
}) => {
  const statsData = [
    {
      label: "Total Diseases",
      value: statistics.totalDiseases,
      icon: Activity,
      color: "from-red-500 to-red-600",
      description: `${statistics.activeDiseases} Active, ${statistics.chronicDiseases} Chronic`,
    },
    {
      label: "Total Allergies",
      value: statistics.totalAllergies,
      icon: Shield,
      color: "from-orange-500 to-orange-600",
      description: `${statistics.criticalAllergies} Critical`,
    },
    {
      label: "Total Medications",
      value: statistics.totalMedications,
      icon: Pill,
      color: "from-blue-500 to-blue-600",
      description: `${statistics.activeMedications} Active`,
    },
    {
      label: "Health Goals",
      value: statistics.activeGoals + statistics.completedGoals,
      icon: Target,
      color: "from-green-500 to-green-600",
      description: `${statistics.activeGoals} Active, ${statistics.completedGoals} Completed`,
    },
    {
      label: "Vitals Records",
      value: statistics.totalVitalsRecords,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      description: "Total recorded vitals",
    },
    {
      label: "Symptom Records",
      value: statistics.totalSymptomRecords,
      icon: Activity,
      color: "from-pink-500 to-pink-600",
      description: "Total recorded symptoms",
    },
    {
      label: "Emergency Contacts",
      value: statistics.emergencyContacts,
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
      description: "Available contacts",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Health Statistics</h3>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">
            Complete Overview
          </span>
        </div>
      </div>

      {/* Profile Completeness */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Profile Completeness</p>
            <p className="text-2xl font-bold">
              {statistics.profileCompleteness}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm opacity-75">
                Last Updated:{" "}
                {new Date(statistics.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </div>
          <CheckCircle className="w-12 h-12 opacity-20" />
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsData.map((stat, statIndex) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1 + statIndex * 0.05,
              }}
              className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl text-white`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-6 h-6" />
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    <CounterAnimation value={stat.value} />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm opacity-90 mb-1">{stat.label}</p>
                <p className="text-xs opacity-75">{stat.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Information */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-blue-900">Summary</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-blue-700">
              <span className="font-medium">Active Health Issues:</span>{" "}
              {statistics.activeDiseases} diseases,{" "}
              {statistics.criticalAllergies} critical allergies
            </p>
            <p className="text-blue-700">
              <span className="font-medium">Current Treatment:</span>{" "}
              {statistics.activeMedications} active medications
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-blue-700">
              <span className="font-medium">Health Monitoring:</span>{" "}
              {statistics.totalVitalsRecords} vitals,{" "}
              {statistics.totalSymptomRecords} symptoms
            </p>
            <p className="text-blue-700">
              <span className="font-medium">Support System:</span>{" "}
              {statistics.emergencyContacts} emergency contacts
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
