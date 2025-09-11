import React from "react";
import { motion } from "framer-motion";
import { Pill, Clock, User, AlertCircle } from "lucide-react";
import type { ActiveMedication } from "../../types/patientManagement";

interface MedicationsCardProps {
  medications: ActiveMedication[];
}

export const MedicationsCard: React.FC<MedicationsCardProps> = ({
  medications,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Pill className="w-6 h-6 text-blue-500" />
        Active Medications
        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full ml-2">
          {medications.length}
        </span>
      </h2>

      <div className="space-y-4">
        {medications.map((medication, index) => (
          <motion.div
            key={medication.id}
            className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  {medication.medicationName}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      medication.status
                    )}`}
                  >
                    {medication.status}
                  </span>
                </h3>
                <p className="text-blue-600 font-medium">
                  {medication.dosage} {medication.dosageUnit} -{" "}
                  {medication.frequency}
                </p>
              </div>
              {medication.reminderEnabled && (
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                Route: {medication.route}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                {medication.prescribedBy}
              </div>
              <div className="text-gray-600">
                Started: {new Date(medication.startDate).toLocaleDateString()}
              </div>
            </div>

            {medication.instructions && (
              <motion.div
                className="mt-3 p-3 bg-blue-50 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-sm text-blue-800">
                  <strong>Instructions:</strong> {medication.instructions}
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
