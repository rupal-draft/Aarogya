import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Zap, Shield } from "lucide-react";
import type { Allergy } from "../../types/patientManagement";

interface AllergiesCardProps {
  allergies: Allergy[];
}

export const AllergiesCard: React.FC<AllergiesCardProps> = ({ allergies }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "severe":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "mild":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "food":
        return "🍎";
      case "drug":
        return "💊";
      case "environmental":
        return "🌿";
      case "insect":
        return "🐝";
      default:
        return "⚠️";
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        Known Allergies
        <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full ml-2">
          {allergies.length}
        </span>
      </h2>

      <div className="space-y-4">
        {allergies.map((allergy, index) => (
          <motion.div
            key={allergy.id}
            className="bg-red-50 rounded-xl p-4 border-2 border-red-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {getTypeIcon(allergy.allergyType)}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {allergy.allergen}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {allergy.allergyType} Allergy
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(
                    allergy.severity
                  )}`}
                >
                  {allergy.severity}
                </span>
                {allergy.severity.toLowerCase() === "critical" && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Zap className="w-5 h-5 text-red-600" />
                  </motion.div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-white bg-opacity-70 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Reaction
                </h4>
                <p className="text-gray-700 text-sm">{allergy.reaction}</p>
              </div>

              <div className="bg-white bg-opacity-70 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  Emergency Action
                </h4>
                <p className="text-gray-700 text-sm font-medium">
                  {allergy.emergencyAction}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
              <span>
                Diagnosed:{" "}
                {new Date(allergy.diagnosedDate).toLocaleDateString()}
              </span>
              <span
                className={`font-medium ${
                  allergy.isActive ? "text-red-600" : "text-gray-500"
                }`}
              >
                {allergy.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
