// components/Patient-Management/SymptomsTimelineCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { Activity, Clock, TrendingUp, Eye } from "lucide-react";
import type { RecentSymptom } from "../../types/patientManagement";

interface SymptomsTimelineCardProps {
  symptoms: RecentSymptom[];
  onViewAll?: () => void;
  totalCount?: number;
}

export const SymptomsTimelineCard: React.FC<SymptomsTimelineCardProps> = ({
  symptoms,
  onViewAll,
  totalCount = 0,
}) => {
  const showViewAll = totalCount > 3;

  const safeValue = (val: any, fallback: string = "N/A") =>
    val !== undefined && val !== null ? val : fallback;

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return "text-red-600 bg-red-100";
    if (severity >= 6) return "text-orange-600 bg-orange-100";
    if (severity >= 4) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getSeverityWidth = (severity: number) => `${(severity / 10) * 100}%`;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-500" />
          Recent Symptoms
          <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full ml-2">
            {totalCount}
          </span>
        </h2>
        {showViewAll && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewAll}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            View All
          </motion.button>
        )}
      </div>

      <div className="space-y-4">
        {symptoms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No symptoms found
          </div>
        ) : (
          symptoms.map((symptom, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {safeValue(symptom.symptomName)}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {safeValue(symptom.description)}
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-bold ${getSeverityColor(
                      symptom.severity
                    )}`}
                  >
                    {safeValue(symptom.severity)}/10
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Severity Level</span>
                  <span className="font-medium">
                    {safeValue(symptom.severity)}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      getSeverityColor(symptom.severity).split(" ")[1]
                    } opacity-70 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: getSeverityWidth(symptom.severity) }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  Duration: {safeValue(symptom.duration)}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  Frequency: {safeValue(symptom.frequency)}
                </div>
                <div className="text-gray-600">
                  Recorded:{" "}
                  {symptom.recordedAt
                    ? new Date(symptom.recordedAt).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};
