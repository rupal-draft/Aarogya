import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Activity,
  Pill,
  Target,
  AlertTriangle,
  Lightbulb,
  Heart,
} from "lucide-react";
import type { Analytics } from "../../../types/patient";
import { CounterAnimation } from "../../../common/Counter/CounterAnimation";

interface AnalyticsCardProps {
  analytics: Analytics;
  index: number;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  analytics,
  index,
}) => {
  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-green-600";
    if (score >= 60) return "from-blue-500 to-blue-600";
    if (score >= 40) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  const getTrendColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case "improving":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      case "stable":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
        <h3 className="text-xl font-bold text-gray-900">Health Analytics</h3>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">
            {analytics.analysisPeriodDays} Days Analysis
          </span>
        </div>
      </div>

      {/* Health Score */}
      <div
        className={`bg-gradient-to-r ${getHealthScoreColor(
          analytics.overallHealthScore
        )} rounded-xl p-6 text-white mb-6`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-2">Overall Health Score</p>
            <div className="text-4xl font-bold">
              <CounterAnimation
                value={analytics.overallHealthScore}
                suffix="/100"
                duration={2}
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp
                className={`w-4 h-4 ${getTrendColor(analytics.healthTrend)}`}
              />
              <span className="text-sm opacity-75">
                Trend: {analytics.healthTrend} • {analytics.healthScoreText}
              </span>
            </div>
          </div>
          <Heart className="w-16 h-16 opacity-20" />
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">
            <CounterAnimation
              value={analytics.vitalsAnalytics.totalVitalsRecords}
            />
          </div>
          <p className="text-sm text-blue-600">Vitals Records</p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl text-center">
          <Pill className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">
            <CounterAnimation
              value={analytics.medicationAnalytics.adherenceRate}
              suffix="%"
            />
          </div>
          <p className="text-sm text-green-600">Adherence Rate</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-xl text-center">
          <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">
            <CounterAnimation
              value={Math.round(analytics.goalAnalytics.averageProgress)}
              suffix="%"
            />
          </div>
          <p className="text-sm text-purple-600">Avg Goal Progress</p>
        </div>

        <div className="bg-orange-50 p-4 rounded-xl text-center">
          <AlertTriangle className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">
            <CounterAnimation
              value={analytics.symptomAnalytics.totalSymptoms}
            />
          </div>
          <p className="text-sm text-orange-600">Total Symptoms</p>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Vitals Analytics */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Vitals Analytics
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Systolic:</span>
              <span className="font-medium">
                {analytics.vitalsAnalytics.averageVitals.systolic} mmHg
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Diastolic:</span>
              <span className="font-medium">
                {analytics.vitalsAnalytics.averageVitals.diastolic} mmHg
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Heart Rate:</span>
              <span className="font-medium">
                {analytics.vitalsAnalytics.averageVitals.heartRate} bpm
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Temperature:</span>
              <span className="font-medium">
                {analytics.vitalsAnalytics.averageVitals.temperature}°C
              </span>
            </div>
          </div>
        </div>

        {/* Medication Analytics */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Pill className="w-5 h-5 text-green-600" />
            Medication Analytics
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Medications:</span>
              <span className="font-medium">
                {analytics.medicationAnalytics.totalMedications}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Medications:</span>
              <span className="font-medium">
                {analytics.medicationAnalytics.activeMedications}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Missed Doses:</span>
              <span className="font-medium text-red-600">
                {analytics.medicationAnalytics.missedDoses}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Adherence Rate:</span>
              <span className="font-medium text-green-600">
                {analytics.medicationAnalytics.adherenceRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Symptom Analytics */}
      <div className="bg-gray-50 p-4 rounded-xl mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Symptom Analytics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Most Common Symptoms:</p>
            <div className="flex flex-wrap gap-1">
              {analytics.symptomAnalytics.mostCommonSymptoms
                .slice(0, 5)
                .map((symptom, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs"
                  >
                    {symptom}
                  </span>
                ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Symptom Trend:</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getTrendColor(
                analytics.symptomAnalytics.symptomTrend
              )}`}
            >
              {analytics.symptomAnalytics.symptomTrend}
            </span>
          </div>
        </div>
      </div>

      {/* Health Alerts */}
      {analytics.healthAlerts.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Health Alerts
          </h4>
          <div className="space-y-2">
            {analytics.healthAlerts.slice(0, 3).map((alert, alertIndex) => (
              <motion.div
                key={alert.id}
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
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-red-900">
                        {alert.title}
                      </p>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                          alert.severity
                        )}`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-red-700 mb-1">{alert.message}</p>
                    <p className="text-xs text-red-600 font-medium">
                      Action: {alert.actionRequired}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analytics.recommendations.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Recommendations
          </h4>
          <div className="space-y-2">
            {analytics.recommendations.map((recommendation, recIndex) => (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1 + recIndex * 0.1,
                }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-3"
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-blue-900">
                        {recommendation.title}
                      </p>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {recommendation.priority}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700">
                      {recommendation.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
