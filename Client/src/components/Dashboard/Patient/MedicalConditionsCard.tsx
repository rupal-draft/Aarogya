import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  Calendar,
  Activity,
  ChevronUp,
  ChevronDown,
  Eye,
} from "lucide-react";
import type { MedicalCondition } from "../../../types/patient";
import { DetailModal } from "../../../common/Modals/DetailModal";

interface MedicalConditionsCardProps {
  conditions: MedicalCondition[];
  index: number;
  maxItems: number;
}

export const MedicalConditionsCard: React.FC<MedicalConditionsCardProps> = ({
  conditions,
  index,
  maxItems = 4,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedCondition, setSelectedCondition] =
    useState<MedicalCondition | null>(null);
  const displayedConditions = expanded
    ? conditions
    : conditions.slice(0, maxItems);

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
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Medical Conditions
          </h3>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              {conditions.filter((c) => c.active).length} Active
            </span>
          </div>
        </div>

        <div className="space-y-4 flex-grow">
          {displayedConditions.map((condition, conditionIndex) => (
            <motion.div
              key={condition.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1 + conditionIndex * 0.05,
              }}
              className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer group"
              onClick={() => setSelectedCondition(condition)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {condition.critical && (
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {condition.conditionName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {condition.category}
                    </p>
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
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {condition.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end mt-2">
                <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        {conditions.length > maxItems && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  View All ({conditions.length} conditions)
                </>
              )}
            </button>
          </div>
        )}

        {conditions.length === 0 && (
          <div className="text-center py-8 flex-grow flex items-center justify-center">
            <div>
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No medical conditions recorded</p>
            </div>
          </div>
        )}
      </motion.div>

      <DetailModal
        isOpen={!!selectedCondition}
        onClose={() => setSelectedCondition(null)}
        title={selectedCondition?.conditionName || "Condition Details"}
      >
        {selectedCondition && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">{selectedCondition.category}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">{selectedCondition.status}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Severity</p>
                <p className="font-medium">{selectedCondition.severity}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Critical</p>
                <p className="font-medium">
                  {selectedCondition.critical ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Diagnosis Date</p>
                <p className="font-medium">
                  {selectedCondition.formattedDiagnosisDate}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Time Since Diagnosis</p>
                <p className="font-medium">{selectedCondition.timeAgo}</p>
              </div>
            </div>

            {selectedCondition.notes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-2">Notes</p>
                <p className="text-gray-700">{selectedCondition.notes}</p>
              </div>
            )}
          </div>
        )}
      </DetailModal>
    </>
  );
};
