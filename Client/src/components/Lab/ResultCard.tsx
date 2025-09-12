import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  Stethoscope,
  UserCheck,
  Bell,
} from "lucide-react";
import type { LabResultResponse } from "../../types/labV2";
import { StatusBadge } from "./StatusBadge";

interface ResultCardProps {
  result: LabResultResponse;
  index: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, index }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <FileText className="text-blue-600" size={24} />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {result.testName}
            </h3>
            <p className="text-sm text-gray-600">Code: {result.testCode}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {result.critical && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <AlertTriangle className="text-red-500" size={20} />
            </motion.div>
          )}
          {result.verified && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              <CheckCircle2 className="text-green-500" size={20} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-blue-600 mb-1">Order Number</p>
          <p className="font-semibold text-blue-900">{result.orderNumber}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-xs text-green-600 mb-1">Overall Result</p>
          <p className="font-semibold text-green-900">{result.overallResult}</p>
        </div>
      </div>

      {/* Parameters */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Eye size={16} />
          Test Parameters
        </h4>
        <div className="space-y-3">
          {result.parameters.map((param, paramIndex) => (
            <motion.div
              key={paramIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + paramIndex * 0.1 + 0.5 }}
              className="bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">
                  {param.parameterName}
                </span>
                <StatusBadge status={param.status} />
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Value</p>
                  <p className="font-semibold">
                    {param.value} {param.unit}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Normal Range</p>
                  <p className="font-semibold">{param.normalRange}</p>
                </div>
                <div>
                  <p className="text-gray-600">Notes</p>
                  <p className="text-xs text-gray-700">{param.notes}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interpretation */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">
          Clinical Interpretation
        </h4>
        <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
          {result.interpretation}
        </p>
      </div>

      {/* Technical Notes */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">
          Technical Notes
        </h4>
        <p className="text-sm text-gray-700">{result.technicalNotes}</p>
      </div>

      {/* Personnel Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <UserCheck size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-600">Lab Technician</p>
            <p className="text-sm font-medium">{result.labTechnicianId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Stethoscope size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-600">Pathologist</p>
            <p className="text-sm font-medium">{result.pathologistId}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3 mb-6">
        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Clock size={16} />
          Timeline
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
            <Calendar size={14} className="text-blue-500" />
            <div>
              <p className="text-xs text-gray-600">Sample Collected</p>
              <p className="font-medium">
                {formatDate(result.sampleCollectedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
            <Calendar size={14} className="text-green-500" />
            <div>
              <p className="text-xs text-gray-600">Result Generated</p>
              <p className="font-medium">
                {formatDate(result.resultGeneratedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
            <Calendar size={14} className="text-purple-500" />
            <div>
              <p className="text-xs text-gray-600">Created</p>
              <p className="font-medium">{formatDate(result.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Bell
            size={16}
            className={
              result.patientNotified ? "text-green-500" : "text-gray-400"
            }
          />
          <span
            className={`text-sm ${
              result.patientNotified ? "text-green-700" : "text-gray-600"
            }`}
          >
            Patient {result.patientNotified ? "Notified" : "Pending"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Bell
            size={16}
            className={
              result.doctorNotified ? "text-green-500" : "text-gray-400"
            }
          />
          <span
            className={`text-sm ${
              result.doctorNotified ? "text-green-700" : "text-gray-600"
            }`}
          >
            Doctor {result.doctorNotified ? "Notified" : "Pending"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.open(result.reportUrl, "_blank")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={16} />
          Download Report
        </motion.button>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={16} />
          <span>Dr. {result.doctorName}</span>
        </div>
      </div>
    </motion.div>
  );
};
