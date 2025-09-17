import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Clock,
  AlertTriangle,
  Calendar,
  Zap,
  TrendingUp,
} from "lucide-react";
import type { RecentSymptom } from "../../../types/patient";

interface SymptomsCardProps {
  symptoms: RecentSymptom[];
  index: number;
}

export const SymptomsCard: React.FC<SymptomsCardProps> = ({
  symptoms = [],
  index,
}) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "neurological":
        return "bg-purple-100 text-purple-800";
      case "respiratory":
        return "bg-blue-100 text-blue-800";
      case "gastrointestinal":
        return "bg-green-100 text-green-800";
      case "cardiovascular":
        return "bg-red-100 text-red-800";
      case "general":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-orange-100 text-orange-800";
    }
  };

  const getSeverityIcon = (severityLevel: number) => {
    if (severityLevel >= 8)
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (severityLevel >= 5) return <Zap className="w-4 h-4 text-orange-500" />;
    if (severityLevel >= 3)
      return <TrendingUp className="w-4 h-4 text-yellow-500" />;
    return <Activity className="w-4 h-4 text-green-500" />;
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "neurological":
        return "🧠";
      case "respiratory":
        return "🫁";
      case "gastrointestinal":
        return "🍽️";
      case "cardiovascular":
        return "❤️";
      case "general":
        return "🏥";
      default:
        return "⚕️";
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
        <h3 className="text-xl font-bold text-gray-900">Recent Symptoms</h3>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">
            {symptoms.filter((s) => s.severe).length} Severe / {symptoms.length}{" "}
            Total
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {symptoms.map((symptom, symptomIndex) => (
          <motion.div
            key={symptom.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1 + symptomIndex * 0.05,
            }}
            className={`rounded-xl p-4 border-l-4 ${
              symptom.severe
                ? "bg-red-50 border-red-500"
                : symptom.recent
                ? "bg-blue-50 border-blue-500"
                : "bg-gray-50 border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {getCategoryIcon(symptom.category)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    {symptom.symptomName}
                    {getSeverityIcon(symptom.severityLevel)}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        symptom.category
                      )}`}
                    >
                      {symptom.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        symptom.severityBadgeColor === "gray"
                          ? "bg-gray-100 text-gray-800 border-gray-200"
                          : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {symptom.severityText}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>{symptom.timeAgo}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{symptom.duration}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
              <p className="text-sm font-medium text-gray-800 mb-1">
                Description:
              </p>
              <p className="text-sm text-gray-700">{symptom.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm font-medium text-gray-800 mb-1">
                  Frequency:
                </p>
                <p className="text-sm text-gray-700">{symptom.frequency}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 mb-1">
                  Duration:
                </p>
                <p className="text-sm text-gray-700">{symptom.duration}</p>
              </div>
            </div>

            {symptom.triggers.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  Triggers:
                </p>
                <div className="flex flex-wrap gap-1">
                  {symptom.triggers.map((trigger, triggerIndex) => (
                    <span
                      key={triggerIndex}
                      className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs border border-yellow-200"
                    >
                      {trigger}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {symptom.associatedSymptoms.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-800 mb-2">
                  Associated Symptoms:
                </p>
                <div className="flex flex-wrap gap-1">
                  {symptom.associatedSymptoms.map(
                    (assocSymptom, assocIndex) => (
                      <span
                        key={assocIndex}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs border border-blue-200"
                      >
                        {assocSymptom}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {symptom.notes && (
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-800 mb-1">Notes:</p>
                <p className="text-sm text-gray-700">{symptom.notes}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {symptoms.length === 0 && (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No recent symptoms recorded</p>
        </div>
      )}
    </motion.div>
  );
};
