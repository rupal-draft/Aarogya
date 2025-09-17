import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Pill,
  Clock,
  User,
  Calendar,
  AlertCircle,
  Eye,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import type { Medication } from "../../../types/patient";
import { DetailModal } from "../../../common/Modals/DetailModal";

interface MedicationsCardProps {
  medications: Medication[];
  index: number;
  maxItems?: number;
}

export const MedicationsCard: React.FC<MedicationsCardProps> = ({
  medications,
  index,
  maxItems = 3,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const displayedMedications = expanded
    ? medications
    : medications.slice(0, maxItems);

  const getStatusColor = (status: string, expired: boolean) => {
    if (expired) return "bg-red-100 text-red-800 border-red-200";

    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRouteIcon = (route: string) => {
    switch (route.toLowerCase()) {
      case "oral":
        return "💊";
      case "inhalation":
        return "🫁";
      case "injection":
        return "💉";
      case "topical":
        return "🧴";
      default:
        return "💊";
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
          <h3 className="text-xl font-bold text-gray-900">Medications</h3>
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              {medications.filter((m) => m.active && !m.expired).length} Active
            </span>
          </div>
        </div>

        <div className="space-y-4 flex-grow">
          {displayedMedications.map((medication, medicationIndex) => (
            <motion.div
              key={medication.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1 + medicationIndex * 0.05,
              }}
              className={`rounded-xl p-4 border-l-4 ${
                medication.expired
                  ? "bg-red-50 border-red-500"
                  : "bg-blue-50 border-blue-500"
              } cursor-pointer group`}
              onClick={() => setSelectedMedication(medication)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {getRouteIcon(medication.route)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                      {medication.medicationName}
                      {medication.expired && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {medication.dosage}mg - {medication.frequency}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    medication.status,
                    medication.expired
                  )}`}
                >
                  {medication.expired ? "Expired" : medication.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Prescribed by: {medication.prescribedBy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Duration: {medication.durationText}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Route: {medication.route}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span>For: {medication.reason}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {medication.instructions && (
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      Instructions:
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {medication.instructions}
                    </p>
                  </div>
                )}

                {medication.sideEffects && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-800 mb-1">
                      Side Effects:
                    </p>
                    <p className="text-sm text-yellow-700 line-clamp-2">
                      {medication.sideEffects}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end mt-2">
                <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        {medications.length > maxItems && (
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
                  View All ({medications.length} medications)
                </>
              )}
            </button>
          </div>
        )}

        {medications.length === 0 && (
          <div className="text-center py-8 flex-grow flex items-center justify-center">
            <Pill className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No medications recorded</p>
          </div>
        )}
      </motion.div>

      <DetailModal
        isOpen={!!selectedMedication}
        onClose={() => setSelectedMedication(null)}
        title={selectedMedication?.medicationName || "Medication Details"}
      >
        {selectedMedication && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Dosage</p>
                <p className="font-medium">{selectedMedication.dosage}mg</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Frequency</p>
                <p className="font-medium">{selectedMedication.frequency}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Route</p>
                <p className="font-medium">{selectedMedication.route}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">
                  {selectedMedication.expired
                    ? "Expired"
                    : selectedMedication.status}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Prescribed By</p>
                <p className="font-medium">{selectedMedication.prescribedBy}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">{selectedMedication.durationText}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">Reason</p>
              <p className="text-gray-700">{selectedMedication.reason}</p>
            </div>

            {selectedMedication.instructions && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Instructions
                </p>
                <p className="text-gray-700">
                  {selectedMedication.instructions}
                </p>
              </div>
            )}

            {selectedMedication.sideEffects && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  Side Effects
                </p>
                <p className="text-yellow-700">
                  {selectedMedication.sideEffects}
                </p>
              </div>
            )}
          </div>
        )}
      </DetailModal>
    </>
  );
};
