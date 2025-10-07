// components/Patient-Management/MedicalHistoryCard.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Calendar,
  AlertCircle,
  Eye,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Loader2,
  Activity,
} from "lucide-react";
import type { MedicalHistory } from "../../types/patientManagement";
import type { CreateMedicalHistoryRequest } from "../../types/patientDashboard";
import { medicalHistoryService } from "../../Services/Patient/medicalHistoryService";

interface MedicalHistoryCardProps {
  history: MedicalHistory[];
  onViewAll?: () => void;
  totalCount?: number;
  onDataUpdate?: () => void;
  patientId: string;
}

export const MedicalHistoryCard: React.FC<MedicalHistoryCardProps> = ({
  history,
  onViewAll,
  totalCount = 0,
  onDataUpdate,
  patientId,
}) => {
  const [editingHistory, setEditingHistory] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<
    Partial<CreateMedicalHistoryRequest>
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
        return "bg-red-100 text-red-800";
      case "recovered":
        return "bg-green-100 text-green-800";
      case "in remission":
        return "bg-blue-100 text-blue-800";
      case "chronic":
        return "bg-purple-100 text-purple-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "severe":
        return "border-red-300 bg-red-50";
      case "moderate":
        return "border-yellow-300 bg-yellow-50";
      case "mild":
        return "border-green-300 bg-green-50";
      case "critical":
        return "border-red-400 bg-red-100";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      chronic: "🔄",
      "infectious disease": "🦠",
      allergy: "⚠️",
      neurological: "🧠",
      respiratory: "🫁",
      "blood disorder": "🩸",
      renal: "🫧",
      viral: "🦠",
      cardiac: "❤️",
      gastrointestinal: "🍽️",
      musculoskeletal: "💪",
      dermatological: "🧴",
      endocrine: "⚖️",
      genetic: "🧬",
      autoimmune: "🛡️",
    };
    return iconMap[category?.toLowerCase()] || "📋";
  };

  // Calculate days since diagnosis
  const getDaysSinceDiagnosis = (diagnosisDate: string) => {
    const diffTime = Math.abs(
      new Date().getTime() - new Date(diagnosisDate).getTime()
    );
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Start editing a medical history entry
  const startEdit = (condition: MedicalHistory, index: number) => {
    setEditingHistory(condition.id);
    setFormData({
      conditionName: condition.conditionName,
      diagnosisDate: condition.diagnosisDate,
      status: condition.status,
      severity: condition.severity,
      notes: condition.notes,
      category: condition.category,
      isActive: condition.status?.toLowerCase() === "active",
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingHistory(null);
    setFormData({});
  };

  // Start adding new medical history
  const startAdd = () => {
    setIsAdding(true);
    setFormData({
      conditionName: "",
      diagnosisDate: new Date().toISOString().split("T")[0],
      status: "active",
      severity: "mild",
      notes: "",
      category: "general",
      isActive: true,
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

  // Save medical history (create or update)
  const saveMedicalHistory = async () => {
    if (!formData.conditionName || !formData.diagnosisDate) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(editingHistory || "new");

    try {
      const requestData: CreateMedicalHistoryRequest = {
        conditionName: formData.conditionName!,
        diagnosisDate: formData.diagnosisDate!,
        status: formData.status,
        severity: formData.severity,
        notes: formData.notes,
        category: formData.category,
        isActive: formData.isActive,
      };

      if (editingHistory) {
        await medicalHistoryService.updateMedicalHistory(
          editingHistory,
          requestData
        );
      } else {
        // Create new medical history
        await medicalHistoryService.addMedicalHistory(requestData);
      }

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      // Reset form
      setEditingHistory(null);
      setIsAdding(false);
      setFormData({});
    } catch (error) {
      console.error("Error saving medical history:", error);
      alert("Error saving medical history. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Delete medical history
  const deleteMedicalHistory = async (condition: MedicalHistory) => {
    const historyId = condition.id;
    setLoading(historyId);

    try {
      await medicalHistoryService.deleteMedicalHistory(historyId);

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting medical history:", error);
      alert("Error deleting medical history. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <History className="w-6 h-6 text-blue-500" />
          Medical History
          <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full ml-2">
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
            Add Condition
          </motion.button>
        </div>
      </div>

      {/* Add New Medical History Form */}
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
                Add Medical Condition
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
                  Condition Name *
                </label>
                <input
                  type="text"
                  value={formData.conditionName || ""}
                  onChange={(e) =>
                    handleInputChange("conditionName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Diabetes, Hypertension"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category || ""}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">General</option>
                  <option value="chronic">Chronic</option>
                  <option value="infectious disease">Infectious Disease</option>
                  <option value="allergy">Allergy</option>
                  <option value="neurological">Neurological</option>
                  <option value="respiratory">Respiratory</option>
                  <option value="cardiac">Cardiac</option>
                  <option value="gastrointestinal">Gastrointestinal</option>
                  <option value="musculoskeletal">Musculoskeletal</option>
                  <option value="dermatological">Dermatological</option>
                  <option value="endocrine">Endocrine</option>
                  <option value="genetic">Genetic</option>
                  <option value="autoimmune">Autoimmune</option>
                </select>
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
                  Status
                </label>
                <select
                  value={formData.status || ""}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                  <option value="in remission">In Remission</option>
                  <option value="chronic">Chronic</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes & Details
              </label>
              <textarea
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional notes, symptoms, or details about the condition..."
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive || false}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Currently Active</span>
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
                  onClick={saveMedicalHistory}
                  disabled={loading === "new"}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {loading === "new" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Add Condition
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {history.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-gray-500">
            No medical history found. Click "Add Condition" to create one.
          </div>
        ) : (
          history.map((condition, index) => (
            <motion.div
              key={index}
              className={`rounded-xl p-4 border-2 ${getSeverityColor(
                condition.severity
              )}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              {editingHistory === editingHistory ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-900">
                      Edit Condition
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
                        Condition Name *
                      </label>
                      <input
                        type="text"
                        value={formData.conditionName || ""}
                        onChange={(e) =>
                          handleInputChange("conditionName", e.target.value)
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
                        <option value="active">Active</option>
                        <option value="resolved">Resolved</option>
                        <option value="in remission">In Remission</option>
                        <option value="chronic">Chronic</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      disabled={loading === condition.id}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveMedicalHistory}
                      disabled={loading === condition.id}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                      {loading === condition.id ? (
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
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">
                        {getCategoryIcon(condition.category)}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {safeValue(condition.conditionName)}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {safeValue(condition.category)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            condition.status
                          )}`}
                        >
                          {safeValue(condition.status)}
                        </span>
                        {condition.severity?.toLowerCase() === "severe" && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          </motion.div>
                        )}
                      </div>

                      <div className="flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEdit(condition, index)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Condition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowDeleteConfirm(condition.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Condition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-70 rounded-lg p-3 mb-3">
                    <p className="text-gray-700 text-sm">
                      <strong>Notes:</strong> {safeValue(condition.notes)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Diagnosed:{" "}
                        {condition.diagnosisDate
                          ? new Date(
                              condition.diagnosisDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                      {condition.diagnosisDate && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <Activity className="w-4 h-4" />
                          {getDaysSinceDiagnosis(condition.diagnosisDate)} days
                          ago
                        </span>
                      )}
                    </div>
                    <span className="font-medium capitalize">
                      Severity: {safeValue(condition.severity)}
                    </span>
                  </div>
                </>
              )}

              {/* Delete Confirmation Modal */}
              <AnimatePresence>
                {showDeleteConfirm === condition.id && (
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
                        Delete Medical Condition
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Are you sure you want to delete{" "}
                        <strong>{condition.conditionName}</strong> from medical
                        history? This action cannot be undone.
                      </p>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          disabled={loading === condition.id}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => deleteMedicalHistory(condition)}
                          disabled={loading === condition.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                          {loading === condition.id ? (
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
