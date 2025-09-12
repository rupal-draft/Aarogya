import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Pill,
  FileText,
  AlertTriangle,
  ChevronDown,
  Activity,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { Prescription } from "../../types/prescription";

interface PrescriptionCardProps {
  prescription: Prescription;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: (id: string, updates: any) => Promise<void>;
}

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onEdit,
  onDelete,
  onUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "COMPLETED":
        return "blue";
      case "CANCELLED":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return Activity;
      case "COMPLETED":
        return CheckCircle;
      case "CANCELLED":
        return XCircle;
      default:
        return Clock;
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onUpdate(prescription.id, { status: newStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const contentVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const StatusIcon = getStatusIcon(prescription.status);
  const statusColor = getStatusColor(prescription.status);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all border border-blue-100 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-blue-50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 bg-${statusColor}-100 rounded-lg`}>
                <StatusIcon className={`w-4 h-4 text-${statusColor}-600`} />
              </div>
              <div>
                <span
                  className={`px-3 py-1 text-xs font-medium bg-${statusColor}-100 text-${statusColor}-700 rounded-full`}
                >
                  {prescription.status}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {prescription.diagnosis}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(prescription.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Pill className="w-4 h-4" />
                <span>{prescription.medicines.length} medicines</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Status Update Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Status:</span>
          <select
            value={prescription.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className={`px-3 py-1 text-xs font-medium bg-${statusColor}-100 text-${statusColor}-700 border border-${statusColor}-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-${statusColor}-500 disabled:opacity-50`}
          >
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          {isUpdating && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          )}
        </div>
      </div>

      {/* Notes */}
      {prescription.notes && (
        <div className="px-6 py-3 bg-blue-50/50">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">{prescription.notes}</p>
          </div>
        </div>
      )}

      {/* Expand Button */}
      <motion.button
        whileHover={{ backgroundColor: "#f8fafc" }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-3 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors border-t border-blue-50"
      >
        <span>{isExpanded ? "Hide" : "Show"} Medicines</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Medicines List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={contentVariants}
            className="overflow-hidden"
          >
            <div className="px-6 py-4 space-y-4 bg-gradient-to-b from-blue-50/30 to-transparent">
              {prescription.medicines.map((medicine, index) => (
                <motion.div
                  key={medicine.medicineId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">
                      {medicine.medicineName}
                    </h4>
                    {medicine.isSubstitute && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                        Substitute
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Dosage:</span>
                      <span className="ml-2 font-medium">
                        {medicine.dosage}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Frequency:</span>
                      <span className="ml-2 font-medium">
                        {medicine.frequency}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium">
                        {medicine.duration} days
                      </span>
                    </div>
                    {medicine.instructions && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Instructions:</span>
                        <span className="ml-2 text-blue-700">
                          {medicine.instructions}
                        </span>
                      </div>
                    )}
                  </div>
                  {medicine.potentialInteractions && (
                    <div className="mt-3 p-2 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-orange-800 font-medium">
                          Potential Interactions
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PrescriptionCard;
