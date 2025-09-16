import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, Calendar, Activity } from "lucide-react";
import type { MedicalCondition } from "../../../types/patient";

interface MedicalConditionsCardProps {
  conditions: MedicalCondition[];
  index: number;
}

export const MedicalConditionsCard: React.FC<MedicalConditionsCardProps> = ({
  conditions,
  index,
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "mild":
        return "bg-green-100 text-green-800 border-green-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "severe":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-red-100 text-red-800 border-red-200";
      case "recovered":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
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
        <h3 className="text-xl font-bold text-gray-900">
          Active Medical Conditions
        </h3>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">
            {conditions.filter((c) => c.active).length} Active
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {conditions.map((condition, conditionIndex) => (
          <motion.div
            key={condition.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1 + conditionIndex * 0.05,
            }}
            className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {condition.critical && (
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {condition.conditionName}
                  </h4>
                  <p className="text-sm text-gray-600">{condition.category}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    condition.status
                  )}`}
                >
                  {condition.status}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                    condition.severity
                  )}`}
                >
                  {condition.severity}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Diagnosed: {condition.formattedDiagnosisDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{condition.timeAgo}</span>
              </div>
            </div>

            {condition.notes && (
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700">{condition.notes}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {conditions.length === 0 && (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No active medical conditions</p>
        </div>
      )}
    </motion.div>
  );
};
