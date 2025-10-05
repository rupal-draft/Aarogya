// components/Patient-Management/DiseasesCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Calendar, Eye } from "lucide-react";
import type { Disease } from "../../types/patientManagement";

interface DiseasesCardProps {
  diseases: Disease[];
  onViewAll?: () => void;
  totalCount?: number;
}

export const DiseasesCard: React.FC<DiseasesCardProps> = ({
  diseases,
  onViewAll,
  totalCount = 0,
}) => {
  const showViewAll = totalCount > 3;

  const safeValue = (val: any, fallback: string = "N/A") =>
    val !== undefined && val !== null ? val : fallback;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-red-100 text-red-800 border-red-200";
      case "recovered":
        return "bg-green-100 text-green-800 border-green-200";
      case "in remission":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          Disease History
          <span className="bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full ml-2">
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
        {diseases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No disease history found
          </div>
        ) : (
          diseases.map((disease, index) => (
            <motion.div
              key={index}
              className={`rounded-xl p-4 border-2 ${getSeverityColor(
                disease.severity
              )}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {safeValue(disease.diseaseName)}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Code: {safeValue(disease.diseaseCode)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    disease.status
                  )}`}
                >
                  {safeValue(disease.status)}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Diagnosed:{" "}
                  {disease.diagnosisDate
                    ? new Date(disease.diagnosisDate).toLocaleDateString()
                    : "N/A"}
                </div>
                {disease.recoveryDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    Recovered:{" "}
                    {new Date(disease.recoveryDate).toLocaleDateString()}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Severity: {safeValue(disease.severity)}</span>
                  <span
                    className={
                      disease.isChronic
                        ? "text-orange-600 font-medium"
                        : "text-gray-600"
                    }
                  >
                    {disease.isChronic ? "Chronic" : "Acute"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};
