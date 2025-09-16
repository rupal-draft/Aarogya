import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Activity,
  Shield,
} from "lucide-react";
import type { HealthOverview } from "../../../types/patient";
import { CounterAnimation } from "../../../common/Counter/CounterAnimation";

interface HealthOverviewCardProps {
  healthOverview: HealthOverview;
  index: number;
}

export const HealthOverviewCard: React.FC<HealthOverviewCardProps> = ({
  healthOverview,
  index,
}) => {
  const getHealthStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "excellent":
        return "from-green-500 to-green-600";
      case "good":
        return "from-blue-500 to-blue-600";
      case "fair":
        return "from-yellow-500 to-yellow-600";
      case "poor":
        return "from-orange-500 to-orange-600";
      case "critical":
        return "from-red-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case "improving":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "declining":
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      case "stable":
        return <Minus className="w-5 h-5 text-blue-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAdherenceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Health Overview</h3>
        <div className="flex items-center gap-2">
          {getTrendIcon(healthOverview.healthTrend)}
          <span className="text-sm font-medium text-gray-600">
            {healthOverview.healthTrend}
          </span>
        </div>
      </div>

      {/* Health Score */}
      <div
        className={`bg-gradient-to-r ${getHealthStatusColor(
          healthOverview.overallHealthStatus
        )} rounded-xl p-6 text-white mb-6`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-2">Overall Health Score</p>
            <div className="text-4xl font-bold">
              <CounterAnimation
                value={healthOverview.healthScore}
                suffix="/10"
                duration={2}
              />
            </div>
            <p className="text-sm opacity-75 mt-1">
              {healthOverview.overallHealthStatus}
            </p>
          </div>
          <Heart className="w-16 h-16 opacity-20" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">
            <CounterAnimation value={healthOverview.activeMedications} />
          </div>
          <p className="text-xs text-blue-600">Active Medications</p>
        </div>

        <div className="bg-red-50 p-4 rounded-xl text-center">
          <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-900">
            <CounterAnimation value={healthOverview.criticalAllergies} />
          </div>
          <p className="text-xs text-red-600">Critical Allergies</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-xl text-center">
          <Shield className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">
            <CounterAnimation value={healthOverview.activeConditions} />
          </div>
          <p className="text-xs text-orange-600">Active Conditions</p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl text-center">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div
            className={`text-2xl font-bold ${getAdherenceColor(
              healthOverview.medicationSummary.adherenceRate
            )}`}
          >
            <CounterAnimation
              value={healthOverview.medicationSummary.adherenceRate}
              suffix="%"
            />
          </div>
          <p className="text-xs text-green-600">Adherence Rate</p>
        </div>
      </div>

      {/* Health Alerts */}
      {healthOverview.healthAlerts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Health Alerts
          </h4>
          <div className="space-y-2">
            {healthOverview.healthAlerts
              .slice(0, 3)
              .map((alert, alertIndex) => (
                <motion.div
                  key={alertIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1 + alertIndex * 0.1,
                  }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-900">
                        {alert.title}
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        {alert.message}
                      </p>
                      <p className="text-xs text-red-600 mt-1 font-medium">
                        Action: {alert.actionRequired}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Medication Summary */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-3">
          Medication Summary
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-700">
              Total: {healthOverview.medicationSummary.totalMedications}
            </p>
            <p className="text-blue-700">
              Active: {healthOverview.medicationSummary.activeMedications}
            </p>
          </div>
          <div>
            <p className="text-blue-700">
              Missed Doses: {healthOverview.medicationSummary.missedDoses}
            </p>
            <p className="text-blue-700">
              Status: {healthOverview.medicationSummary.adherenceStatus}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
