import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  User,
  CheckCircle,
  Clock,
  Stethoscope,
  Activity,
  Eye,
  ChevronUp,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import type { DiseaseHistory } from "../../../types/patient";
import { DetailModal } from "../../../common/Modals/DetailModal";

interface DiseaseHistoryCardProps {
  diseases: DiseaseHistory[];
  index: number;
  maxItems?: number;
}

export const DiseaseHistoryCard: React.FC<DiseaseHistoryCardProps> = ({
  diseases,
  index,
  maxItems = 4,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseHistory | null>(
    null
  );
  const displayedDiseases = expanded ? diseases : diseases.slice(0, maxItems);

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "recovered":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
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
          <h3 className="text-xl font-bold text-gray-900">Disease History</h3>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              {diseases.filter((d) => d.active).length} Active /{" "}
              {diseases.length} Total
            </span>
          </div>
        </div>

        <div className="space-y-4 flex-grow">
          {displayedDiseases.map((disease, diseaseIndex) => (
            <motion.div
              key={disease.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1 + diseaseIndex * 0.05,
              }}
              className={`rounded-xl p-4 border-l-4 ${
                disease.critical
                  ? "bg-red-50 border-red-500"
                  : disease.chronic
                  ? "bg-orange-50 border-orange-500"
                  : "bg-blue-50 border-blue-500"
              } cursor-pointer group`}
              onClick={() => setSelectedDisease(disease)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(disease.status)}
                  <div>
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                      {disease.diseaseName}
                      {disease.critical && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      {disease.chronic && (
                        <Clock className="w-4 h-4 text-orange-500" />
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Code: {disease.diseaseCode}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      disease.status
                    )}`}
                  >
                    {disease.status}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(
                      disease.severity
                    )}`}
                  >
                    {disease.severity}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Diagnosed: {disease.formattedDiagnosisDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>By: {disease.diagnosedBy}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{disease.daysSinceDiagnosis} days ago</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Stethoscope className="w-4 h-4" />
                  <span>Treatment: {disease.treatment}</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
                <p className="text-sm font-medium text-gray-800 mb-1">
                  Description:
                </p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {disease.description}
                </p>
              </div>

              {disease.notes && (
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    Notes:
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {disease.notes}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end mt-2">
                <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        {diseases.length > maxItems && (
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
                  View All ({diseases.length} diseases)
                </>
              )}
            </button>
          </div>
        )}

        {diseases.length === 0 && (
          <div className="text-center py-8 flex-grow flex items-center justify-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No disease history recorded</p>
          </div>
        )}
      </motion.div>

      <DetailModal
        isOpen={!!selectedDisease}
        onClose={() => setSelectedDisease(null)}
        title={selectedDisease?.diseaseName || "Disease Details"}
      >
        {selectedDisease && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Disease Code</p>
                <p className="font-medium">{selectedDisease.diseaseCode}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">{selectedDisease.status}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Severity</p>
                <p className="font-medium">{selectedDisease.severity}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Critical</p>
                <p className="font-medium">
                  {selectedDisease.critical ? "Yes" : "No"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Chronic</p>
                <p className="font-medium">
                  {selectedDisease.chronic ? "Yes" : "No"}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Active</p>
                <p className="font-medium">
                  {selectedDisease.active ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Description
              </p>
              <p className="text-gray-700">{selectedDisease.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Diagnosed By</p>
                <p className="font-medium">{selectedDisease.diagnosedBy}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Diagnosis Date</p>
                <p className="font-medium">
                  {selectedDisease.formattedDiagnosisDate}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Days Since Diagnosis</p>
                <p className="font-medium">
                  {selectedDisease.daysSinceDiagnosis}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Treatment</p>
                <p className="font-medium">{selectedDisease.treatment}</p>
              </div>
            </div>

            {selectedDisease.notes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600 mb-2">Notes</p>
                <p className="text-gray-700">{selectedDisease.notes}</p>
              </div>
            )}
          </div>
        )}
      </DetailModal>
    </>
  );
};
