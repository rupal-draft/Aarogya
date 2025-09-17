import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Shield,
  Zap,
  Calendar,
  ChevronUp,
  ChevronDown,
  Eye,
} from "lucide-react";
import type { Allergy } from "../../../types/patient";
import { DetailModal } from "../../../common/Modals/DetailModal";

interface AllergiesCardProps {
  allergies: Allergy[];
  index: number;
}

export const AllergiesCard: React.FC<AllergiesCardProps> = ({
  allergies,
  index,
  maxItems = 3,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedAllergy, setSelectedAllergy] = useState<Allergy | null>(null);
  const displayedAllergies = expanded
    ? allergies
    : allergies.slice(0, maxItems);

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: AlertTriangle,
          bgColor: "bg-red-50",
        };
      case "SEVERE":
        return {
          color: "bg-orange-100 text-orange-800 border-orange-200",
          icon: Zap,
          bgColor: "bg-orange-50",
        };
      case "MODERATE":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: Shield,
          bgColor: "bg-yellow-50",
        };
      case "MILD":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: Shield,
          bgColor: "bg-green-50",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: Shield,
          bgColor: "bg-gray-50",
        };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "food":
        return "bg-purple-100 text-purple-800";
      case "drug":
        return "bg-blue-100 text-blue-800";
      case "environmental":
        return "bg-green-100 text-green-800";
      case "insect":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <h3 className="text-xl font-bold text-gray-900">Allergies</h3>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-600">
              {allergies.filter((a) => a.critical).length} Critical
            </span>
          </div>
        </div>

        <div className="space-y-4 flex-grow">
          {displayedAllergies.map((allergy, allergyIndex) => {
            const severityConfig = getSeverityConfig(allergy.severity);
            const SeverityIcon = severityConfig.icon;

            return (
              <motion.div
                key={allergy.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1 + allergyIndex * 0.05,
                }}
                className={`${
                  severityConfig.bgColor
                } rounded-xl p-4 border-l-4 ${
                  allergy.critical ? "border-red-500" : "border-orange-500"
                } cursor-pointer group`}
                onClick={() => setSelectedAllergy(allergy)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <SeverityIcon
                      className={`w-5 h-5 ${
                        allergy.critical ? "text-red-500" : "text-orange-500"
                      } flex-shrink-0`}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {allergy.allergen}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            allergy.allergyType
                          )}`}
                        >
                          {allergy.allergyType}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${severityConfig.color}`}
                        >
                          {allergy.severity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(allergy.diagnosedDate).getFullYear()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      Symptoms:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {allergy.symptoms
                        .slice(0, 3)
                        .map((symptom, symptomIndex) => (
                          <span
                            key={symptomIndex}
                            className="px-2 py-1 bg-white rounded-md text-xs text-gray-700 border"
                          >
                            {symptom}
                          </span>
                        ))}
                      {allergy.symptoms.length > 3 && (
                        <span className="px-2 py-1 bg-white rounded-md text-xs text-gray-500 border">
                          +{allergy.symptoms.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {allergy.emergencyAction && (
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-800 mb-1">
                        Emergency Action:
                      </p>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {allergy.emergencyAction}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-end">
                    <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {allergies.length > maxItems && (
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
                  View All ({allergies.length} allergies)
                </>
              )}
            </button>
          </div>
        )}

        {allergies.length === 0 && (
          <div className="text-center py-8 flex-grow flex items-center justify-center">
            <div>
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No allergies recorded</p>
            </div>
          </div>
        )}
      </motion.div>

      <DetailModal
        isOpen={!!selectedAllergy}
        onClose={() => setSelectedAllergy(null)}
        title={selectedAllergy?.allergen || "Allergy Details"}
      >
        {selectedAllergy && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium">{selectedAllergy.allergyType}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Severity</p>
                <p className="font-medium">{selectedAllergy.severity}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Critical</p>
                <p className="font-medium">
                  {selectedAllergy.critical ? "Yes" : "No"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Diagnosed</p>
                <p className="font-medium">
                  {new Date(selectedAllergy.diagnosedDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {selectedAllergy.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>

            {selectedAllergy.emergencyAction && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Emergency Action
                </p>
                <p className="text-gray-700">
                  {selectedAllergy.emergencyAction}
                </p>
              </div>
            )}

            {selectedAllergy.notes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-2">Notes</p>
                <p className="text-gray-700">{selectedAllergy.notes}</p>
              </div>
            )}
          </div>
        )}
      </DetailModal>
    </>
  );
};
