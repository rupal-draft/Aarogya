import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Thermometer,
  Activity,
  Weight,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import type { VitalsStats, VitalStat } from "../../../types/patient";

interface VitalsCardProps {
  vitals: VitalsStats;
  index: number;
}

export const VitalsCard: React.FC<VitalsCardProps> = ({ vitals, index }) => {
  // Helper function to format values with appropriate units
  const formatValue = (type: string, value: number) => {
    switch (type) {
      case "bloodPressure":
        return `${value} mmHg`;
      case "heartRate":
        return `${value} bpm`;
      case "temperature":
        return `${value} °F`;
      case "oxygenSaturation":
        return `${value}%`;
      case "weight":
        return `${value} lbs`;
      default:
        return value.toString();
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "NORMAL":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "HIGH":
      case "LOW":
      case "ABNORMAL":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  // Helper function to get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "UP":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "DOWN":
        return <TrendingDown className="w-4 h-4 text-blue-500" />;
      case "STABLE":
        return <Minus className="w-4 h-4 text-green-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const vitalsData = [
    {
      label: "Blood Pressure",
      key: "bloodPressure",
      icon: Heart,
      color: "from-red-500 to-red-600",
    },
    {
      label: "Heart Rate",
      key: "heartRate",
      icon: Activity,
      color: "from-pink-500 to-pink-600",
    },
    {
      label: "Temperature",
      key: "temperature",
      icon: Thermometer,
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "Oxygen Saturation",
      key: "oxygenSaturation",
      icon: Activity,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Weight",
      key: "weight",
      icon: Weight,
      color: "from-green-500 to-green-600",
    },
  ];

  // Function to render detailed vitals information
  const renderVitalDetails = (vital: VitalStat, key: string) => {
    return (
      <div className="mt-2 text-xs text-white opacity-90">
        <div className="grid grid-cols-2 gap-1">
          <div>Avg: {formatValue(key, vital.average)}</div>
          <div>Min: {formatValue(key, vital.minimum)}</div>
          <div>Change: {vital.changeFromPrevious}</div>
          <div>Max: {formatValue(key, vital.maximum)}</div>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span>Trend: {vital.trend}</span>
          <span>{vital.changePercentage}</span>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Vitals Overview</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Overall Status:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              vitals.overallHealthStatus === "GOOD"
                ? "bg-green-100 text-green-800"
                : vitals.overallHealthStatus === "POOR"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {vitals.overallHealthStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {vitalsData.map((vital, vitalIndex) => {
          const Icon = vital.icon;
          const vitalStat = vitals[vital.key as keyof VitalsStats] as VitalStat;

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
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{vital.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(vitalStat.status)}
                  {getTrendIcon(vitalStat.trend)}
                </div>
              </div>

              <div>
                <p className="text-xl font-bold">
                  {formatValue(vital.key, vitalStat.current)}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-black bg-opacity-20 px-2 py-1 rounded">
                    Status: {vitalStat.status}
                  </span>
                </div>

                {renderVitalDetails(vitalStat, vital.key)}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Analysis Summary
              </p>
              <p className="text-sm text-gray-800">
                Based on {vitals.totalRecords} records over{" "}
                {vitals.daysAnalyzed} days. Overall trend is{" "}
                <span className="font-medium">
                  {vitals.healthTrend.toLowerCase()}
                </span>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">Timeline</p>
              <p className="text-sm text-gray-800">
                Last recorded:{" "}
                {new Date(vitals.lastRecorded).toLocaleDateString("en-US", {
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
      </div>

      <div className="bg-blue-50 p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">
              Key Metrics Explained
            </p>
            <ul className="text-sm text-blue-800 list-disc pl-4 space-y-1">
              <li>Current: Latest measurement</li>
              <li>Average: Mean value over the period</li>
              <li>Min/Max: Lowest and highest recorded values</li>
              <li>Change: Difference from previous measurement</li>
              <li>Trend: Direction of changes over time</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
