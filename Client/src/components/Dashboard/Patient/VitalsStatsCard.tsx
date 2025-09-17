import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Thermometer,
  Activity,
  Weight,
  Droplets,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  BarChart3,
} from "lucide-react";
import type { VitalsStats } from "../../../types/patient";
import { CounterAnimation } from "../../../common/Counter/CounterAnimation";

interface VitalsStatsCardProps {
  vitalsStats: VitalsStats;
  index: number;
}

export const VitalsStatsCard: React.FC<VitalsStatsCardProps> = ({
  vitalsStats,
  index,
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case "improving":
      case "increasing":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "declining":
      case "decreasing":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case "stable":
        return <Minus className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "normal":
        return "text-green-600";
      case "elevated":
      case "high":
        return "text-red-600";
      case "low":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const vitalsData = [
    {
      label: "Blood Pressure",
      current: vitalsStats.bloodPressure.current,
      average: vitalsStats.bloodPressure.average,
      trend: vitalsStats.bloodPressure.trend,
      status: vitalsStats.bloodPressure.status,
      change: vitalsStats.bloodPressure.changePercentage,
      icon: Heart,
      color: "from-red-500 to-red-600",
      unit: "mmHg",
    },
    {
      label: "Heart Rate",
      current: vitalsStats.heartRate.current,
      average: vitalsStats.heartRate.average,
      trend: vitalsStats.heartRate.trend,
      status: vitalsStats.heartRate.status,
      change: vitalsStats.heartRate.changePercentage,
      icon: Activity,
      color: "from-pink-500 to-pink-600",
      unit: "bpm",
    },
    {
      label: "Temperature",
      current: vitalsStats.temperature.current,
      average: vitalsStats.temperature.average,
      trend: vitalsStats.temperature.trend,
      status: vitalsStats.temperature.status,
      change: vitalsStats.temperature.changePercentage,
      icon: Thermometer,
      color: "from-orange-500 to-orange-600",
      unit: "°C",
    },
    {
      label: "Oxygen Saturation",
      current: vitalsStats.oxygenSaturation.current,
      average: vitalsStats.oxygenSaturation.average,
      trend: vitalsStats.oxygenSaturation.trend,
      status: vitalsStats.oxygenSaturation.status,
      change: vitalsStats.oxygenSaturation.changePercentage,
      icon: Droplets,
      color: "from-blue-500 to-blue-600",
      unit: "%",
    },
    {
      label: "Weight",
      current: vitalsStats.weight.current,
      average: vitalsStats.weight.average,
      trend: vitalsStats.weight.trend,
      status: vitalsStats.weight.status,
      change: vitalsStats.weight.changePercentage,
      icon: Weight,
      color: "from-green-500 to-green-600",
      unit: "kg",
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
        <h3 className="text-xl font-bold text-gray-900">Vitals Statistics</h3>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">
            {vitalsStats.daysAnalyzed} Days Analysis
          </span>
        </div>
      </div>

      {/* Overall Health Status */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Overall Health Status</p>
            <p className="text-2xl font-bold">
              {vitalsStats.overallHealthStatus}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(vitalsStats.healthTrend)}
              <span className="text-sm opacity-75">
                Trend: {vitalsStats.healthTrend}
              </span>
            </div>
          </div>
          <Heart className="w-12 h-12 opacity-20" />
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {vitalsData.map((vital, vitalIndex) => {
          const Icon = vital.icon;
          return (
            <motion.div
              key={vital.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1 + vitalIndex * 0.05,
              }}
              className={`bg-gradient-to-br ${vital.color} p-4 rounded-xl text-white`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-6 h-6" />
                <div className="flex items-center gap-1">
                  {getTrendIcon(vital.trend)}
                  <span className="text-xs opacity-75">{vital.change}</span>
                </div>
              </div>
              <div>
                <p className="text-xs opacity-90 mb-1">{vital.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold">
                    <CounterAnimation value={vital.current} />
                  </span>
                  <span className="text-xs opacity-75">{vital.unit}</span>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs opacity-75">
                  <span>Avg: {vital.average}</span>
                  <span className={getStatusColor(vital.status)}>
                    {vital.status}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">
            <CounterAnimation value={vitalsStats.totalRecords} />
          </div>
          <p className="text-sm text-blue-600">Total Records</p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl text-center">
          <BarChart3 className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">
            <CounterAnimation value={vitalsStats.daysAnalyzed} />
          </div>
          <p className="text-sm text-green-600">Days Analyzed</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-xl text-center">
          <Activity className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-sm font-bold text-purple-900">
            {new Date(vitalsStats.lastRecorded).toLocaleDateString()}
          </div>
          <p className="text-sm text-purple-600">Last Recorded</p>
        </div>
      </div>
    </motion.div>
  );
};
