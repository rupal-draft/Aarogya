import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Thermometer,
  Activity,
  Weight,
  Ruler,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import type { LatestVitals } from "../../../types/patient";

interface VitalsCardProps {
  vitals: LatestVitals;
  index: number;
}

export const VitalsCard: React.FC<VitalsCardProps> = ({ vitals, index }) => {
  const vitalsData = [
    {
      label: "Blood Pressure",
      value: vitals.bloodPressureDisplay,
      icon: Heart,
      color: "from-red-500 to-red-600",
      status: vitals.abnormal ? "abnormal" : "normal",
    },
    {
      label: "Heart Rate",
      value: `${vitals.heartRate} bpm`,
      icon: Activity,
      color: "from-pink-500 to-pink-600",
      status: "normal",
    },
    {
      label: "Temperature",
      value: vitals.temperatureDisplay,
      icon: Thermometer,
      color: "from-orange-500 to-orange-600",
      status: "normal",
    },
    {
      label: "Weight",
      value: vitals.weightDisplay,
      icon: Weight,
      color: "from-green-500 to-green-600",
      status: "normal",
    },
    {
      label: "BMI",
      value: vitals.bmiDisplay,
      icon: Ruler,
      color: "from-blue-500 to-blue-600",
      status:
        vitals.bmiCategory.toLowerCase() === "normal" ? "normal" : "abnormal",
    },
  ];

  const getTrendIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <Minus className="w-4 h-4 text-green-500" />;
      case "high":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "low":
        return <TrendingDown className="w-4 h-4 text-blue-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Latest Vitals</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Status:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              vitals.abnormal
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {vitals.healthStatus}
          </span>
        </div>
      </div>

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
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-6 h-6" />
                {getTrendIcon(vital.status)}
              </div>
              <div>
                <p className="text-sm opacity-90">{vital.label}</p>
                <p className="text-xl font-bold">{vital.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-blue-50 p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">
              Clinical Notes
            </p>
            <p className="text-sm text-blue-800">{vitals.notes}</p>
            <p className="text-xs text-blue-600 mt-2">
              Recorded:{" "}
              {new Date(vitals.recordedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
