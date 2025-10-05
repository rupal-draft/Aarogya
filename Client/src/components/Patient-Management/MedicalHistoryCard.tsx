// components/Patient-Management/MedicalHistoryCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { History, Calendar, AlertCircle, Eye } from "lucide-react";
import type { MedicalHistory } from "../../types/patientManagement";

interface MedicalHistoryCardProps {
  history: MedicalHistory[];
  onViewAll?: () => void;
  totalCount?: number;
}

export const MedicalHistoryCard: React.FC<MedicalHistoryCardProps> = ({
  history,
  onViewAll,
  totalCount = 0,
}) => {
  const showViewAll = totalCount > 3;

  const safeValue = (val: any, fallback: string = "N/A") =>
    val !== undefined && val !== null ? val : fallback;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-red-100 text-red-800";
      case "recovered":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "severe":
        return "border-red-300 bg-red-50";
      case "moderate":
        return "border-yellow-300 bg-yellow-50";
      case "mild":
        return "border-green-300 bg-green-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      chronic: "🔄",
      "infectious disease": "🦠",
      allergy: "⚠️",
      neurological: "🧠",
      respiratory: "🫁",
      "blood disorder": "🩸",
      renal: "🫧",
      viral: "🦠",
    };
    return iconMap[category?.toLowerCase()] || "📋";
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <History className="w-6 h-6 text-blue-500" />
          Medical History
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
        {history.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No medical history found
          </div>
        ) : (
          history.map((condition, index) => (
            <motion.div
              key={index}
              className={`rounded-xl p-4 border-2 ${getSeverityColor(
                condition.severity
              )}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">
                    {getCategoryIcon(condition.category)}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {safeValue(condition.conditionName)}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {safeValue(condition.category)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      condition.status
                    )}`}
                  >
                    {safeValue(condition.status)}
                  </span>
                  {condition.severity === "Severe" && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="bg-white bg-opacity-70 rounded-lg p-3 mb-3">
                <p className="text-gray-700 text-sm">
                  <strong>Notes:</strong> {safeValue(condition.notes)}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Diagnosed:{" "}
                  {condition.diagnosisDate
                    ? new Date(condition.diagnosisDate).toLocaleDateString()
                    : "N/A"}
                </span>
                <span className="font-medium capitalize">
                  Severity: {safeValue(condition.severity)}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};
