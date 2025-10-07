// components/Patient-Management/DiseasesCard.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  Eye,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Loader2,
  User,
} from "lucide-react";
import type { Disease } from "../../types/patientManagement";
import type {
  CreateDiseaseHistoryRequest,
  UpdateDiseaseHistoryRequest,
} from "../../types/patientDashboard";
import { diseaseHistoryService } from "../../Services/Patient/diseaseHistoryService";

interface DiseasesCardProps {
  diseases: Disease[];
  onViewAll?: () => void;
  totalCount?: number;
  onDataUpdate?: () => void;
  patientId?: string;
}

export const DiseasesCard: React.FC<DiseasesCardProps> = ({
  diseases,
  onViewAll,
  totalCount = 0,
  onDataUpdate,
  patientId,
}) => {
  const [editingDisease, setEditingDisease] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<
    Partial<CreateDiseaseHistoryRequest>
  >({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const showViewAll = totalCount > 3;

  const safeValue = (val: any, fallback: string = "N/A") =>
    val !== undefined && val !== null ? val : fallback;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-red-100 text-red-800 border-red-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "chronic":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "under treatment":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "border-red-300 bg-red-50";
      case "severe":
        return "border-orange-300 bg-orange-50";
      case "moderate":
        return "border-yellow-300 bg-yellow-50";
      case "mild":
        return "border-green-300 bg-green-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  // Start editing a disease
  const startEdit = (disease: Disease) => {
    setEditingDisease(disease.id || `temp-${disease.diseaseName}`);
    setFormData({
      diseaseName: disease.diseaseName,
      diseaseCode: disease.diseaseCode,
      diagnosisDate: disease.diagnosisDate,
      diagnosedBy: "",
      severity: disease.severity as "Mild" | "Moderate" | "Severe" | "Critical",
      status: disease.status as
        | "Active"
        | "Resolved"
        | "Chronic"
        | "Under Treatment",
      isChronic: disease.isChronic,
      description: "",
      treatment: "",
      notes: "",
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingDisease(null);
    setFormData({});
  };

  // Start adding new disease
  const startAdd = () => {
    setIsAdding(true);
    setFormData({
      diseaseName: "",
      diseaseCode: "",
      diagnosisDate: new Date().toISOString().split("T")[0],
      diagnosedBy: "",
      severity: "Mild",
      status: "Active",
      isChronic: false,
      description: "",
      treatment: "",
      notes: "",
    });
  };

  // Cancel adding
  const cancelAdd = () => {
    setIsAdding(false);
    setFormData({});
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save disease (create or update)
  const saveDisease = async () => {
    if (!patientId) {
      console.error("Patient ID is missing — cannot update allergy.");
      return;
    }

    if (
      !formData.diseaseName ||
      !formData.diagnosisDate ||
      !formData.diagnosedBy
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(editingDisease || "new");

    try {
      if (editingDisease && !editingDisease.startsWith("temp-")) {
        // Update existing disease
        const updateRequest: UpdateDiseaseHistoryRequest = {
          diseaseName: formData.diseaseName,
          diseaseCode: formData.diseaseCode,
          diagnosisDate: formData.diagnosisDate,
          diagnosedBy: formData.diagnosedBy,
          severity: formData.severity,
          status: formData.status,
          isChronic: formData.isChronic,
          description: formData.description,
          treatment: formData.treatment,
          notes: formData.notes,
        };

        await diseaseHistoryService.updateDiseaseHistory(
          patientId,
          editingDisease,
          updateRequest
        );
      } else {
        // Create new disease
        const createRequest: CreateDiseaseHistoryRequest = {
          diseaseName: formData.diseaseName!,
          diseaseCode: formData.diseaseCode,
          diagnosisDate: formData.diagnosisDate!,
          diagnosedBy: formData.diagnosedBy!,
          severity: formData.severity!,
          status: formData.status!,
          isChronic: formData.isChronic,
          description: formData.description,
          treatment: formData.treatment,
          notes: formData.notes,
        };

        await diseaseHistoryService.createDiseaseHistory(
          patientId,
          createRequest
        );
      }

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      // Reset form
      setEditingDisease(null);
      setIsAdding(false);
      setFormData({});
    } catch (error) {
      console.error("Error saving disease:", error);
      alert("Error saving disease. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Delete disease
  const deleteDisease = async (diseaseId: string) => {
    setLoading(diseaseId);
    if (!patientId) {
      console.error("Patient ID is missing — cannot update allergy.");
      return;
    }
    try {
      await diseaseHistoryService.deleteDiseaseHistory(patientId, diseaseId);

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting disease:", error);
      alert("Error deleting disease. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          Disease History
          <span className="bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full ml-2">
            {totalCount}
          </span>
        </h2>

        <div className="flex items-center gap-2">
          {showViewAll && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewAll}
              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              View All
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startAdd}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Disease
          </motion.button>
        </div>
      </div>

      {/* Add New Disease Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 bg-blue-50 rounded-xl p-4 border-2 border-blue-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">
                Add New Disease
              </h3>
              <button
                onClick={cancelAdd}
                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-blue-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disease Name *
                </label>
                <input
                  type="text"
                  value={formData.diseaseName || ""}
                  onChange={(e) =>
                    handleInputChange("diseaseName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Diabetes, Hypertension"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disease Code
                </label>
                <input
                  type="text"
                  value={formData.diseaseCode || ""}
                  onChange={(e) =>
                    handleInputChange("diseaseCode", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., E11.9, I10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosis Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={formData.diagnosisDate || ""}
                    onChange={(e) =>
                      handleInputChange("diagnosisDate", e.target.value)
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosed By *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.diagnosedBy || ""}
                    onChange={(e) =>
                      handleInputChange("diagnosedBy", e.target.value)
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Doctor's name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  value={formData.severity || ""}
                  onChange={(e) =>
                    handleInputChange("severity", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status || ""}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Chronic">Chronic</option>
                  <option value="Under Treatment">Under Treatment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the disease and symptoms..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment
                </label>
                <textarea
                  value={formData.treatment || ""}
                  onChange={(e) =>
                    handleInputChange("treatment", e.target.value)
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Current treatment plan..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isChronic || false}
                  onChange={(e) =>
                    handleInputChange("isChronic", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Chronic Condition</span>
              </label>

              <div className="flex gap-2">
                <button
                  onClick={cancelAdd}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={loading === "new"}
                >
                  Cancel
                </button>
                <button
                  onClick={saveDisease}
                  disabled={loading === "new"}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {loading === "new" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Add Disease
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {diseases.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-gray-500">
            No disease history found. Click "Add Disease" to create one.
          </div>
        ) : (
          diseases.map((disease, index) => (
            <motion.div
              key={disease.id || index}
              className={`rounded-xl p-4 border-2 ${getSeverityColor(
                disease.severity
              )}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              {editingDisease ===
              (disease.id || `temp-${disease.diseaseName}`) ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-900">
                      Edit Disease
                    </h3>
                    <button
                      onClick={cancelEdit}
                      className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Disease Name *
                      </label>
                      <input
                        type="text"
                        value={formData.diseaseName || ""}
                        onChange={(e) =>
                          handleInputChange("diseaseName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status || ""}
                        onChange={(e) =>
                          handleInputChange("status", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Chronic">Chronic</option>
                        <option value="Under Treatment">Under Treatment</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      disabled={loading === editingDisease}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveDisease}
                      disabled={loading === editingDisease}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                      {loading === editingDisease ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {safeValue(disease.diseaseName)}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Code: {safeValue(disease.diseaseCode)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          disease.status
                        )}`}
                      >
                        {safeValue(disease.status)}
                      </span>

                      <div className="flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEdit(disease)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Disease"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            setShowDeleteConfirm(
                              disease.id || `temp-${disease.diseaseName}`
                            )
                          }
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Disease"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Diagnosed:{" "}
                      {disease.diagnosisDate
                        ? new Date(disease.diagnosisDate).toLocaleDateString()
                        : "N/A"}
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Severity: {safeValue(disease.severity)}</span>
                      <span
                        className={
                          disease.isChronic
                            ? "text-purple-600 font-medium"
                            : "text-gray-600"
                        }
                      >
                        {disease.isChronic ? "Chronic" : "Acute"}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Delete Confirmation Modal */}
              <AnimatePresence>
                {showDeleteConfirm ===
                  (disease.id || `temp-${disease.diseaseName}`) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="bg-white rounded-xl p-6 m-4 max-w-sm w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Delete Disease
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Are you sure you want to delete{" "}
                        <strong>{disease.diseaseName}</strong> from disease
                        history? This action cannot be undone.
                      </p>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          disabled={loading === disease.id}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => deleteDisease(disease.id!)}
                          disabled={loading === disease.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                          {loading === disease.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};
