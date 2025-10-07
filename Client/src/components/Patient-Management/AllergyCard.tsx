// components/Patient-Management/AllergiesCard.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Zap,
  Shield,
  Eye,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Loader2,
  Calendar,
} from "lucide-react";
import type { Allergy } from "../../types/patientManagement";
import type {
  CreateAllergyRequest,
  UpdateAllergyRequest,
} from "../../types/patientDashboard";
import { allergiesService } from "../../Services/Patient/allergiesService";

interface AllergiesCardProps {
  allergies: Allergy[];
  onViewAll?: () => void;
  totalCount?: number;
  onDataUpdate?: () => void;
  patientId?: string;
}

export const AllergiesCard: React.FC<AllergiesCardProps> = ({
  allergies,
  onViewAll,
  totalCount = 0,
  onDataUpdate,
  patientId,
}) => {
  const [editingAllergy, setEditingAllergy] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<
    Partial<CreateAllergyRequest & { symptoms?: string[]; notes?: string }>
  >({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const showViewAll = totalCount > 3;

  const safeValue = (val: any, fallback: string = "N/A") =>
    val !== undefined && val !== null ? val : fallback;

  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-300";
      case "SEVERE":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "MODERATE":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "MILD":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
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

  // Start editing an allergy
  const startEdit = (allergy: Allergy) => {
    setEditingAllergy(allergy.id);
    setFormData({
      allergen: allergy.allergen,
      allergyType: allergy.allergyType,
      severity: allergy.severity as "MILD" | "MODERATE" | "SEVERE" | "CRITICAL",
      reaction: allergy.reaction,
      emergencyAction: allergy.emergencyAction,
      isActive: allergy.isActive,
      diagnosedDate: allergy.diagnosedDate,
      notes: "",
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingAllergy(null);
    setFormData({});
  };

  // Start adding new allergy
  const startAdd = () => {
    setIsAdding(true);
    setFormData({
      allergen: "",
      allergyType: "drug",
      severity: "MILD",
      reaction: "",
      emergencyAction: "",
      isActive: true,
      diagnosedDate: new Date().toISOString().split("T")[0],
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

  // Save allergy (create or update)
  const saveAllergy = async () => {
    if (!patientId) {
      console.error("Patient ID is missing — cannot update allergy.");
      return;
    }

    if (!formData.allergen || !formData.severity || !formData.diagnosedDate) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(editingAllergy || "new");

    try {
      if (editingAllergy) {
        // Update existing allergy
        const updateRequest: UpdateAllergyRequest = {
          allergen: formData.allergen,
          severity: formData.severity as
            | "MILD"
            | "MODERATE"
            | "SEVERE"
            | "CRITICAL",
          reaction: formData.reaction,
          notes: formData.notes,
          allergyType: formData.allergyType,
          symptoms: formData.symptoms,
          diagnosedDate: formData.diagnosedDate,
          isActive: formData.isActive,
          emergencyAction: formData.emergencyAction,
        };

        await allergiesService.updateAllergy(
          patientId,
          editingAllergy,
          updateRequest
        );
      } else {
        // Create new allergy
        const createRequest: CreateAllergyRequest = {
          allergen: formData.allergen!,
          severity: formData.severity!,
          reaction: formData.reaction,
          diagnosedDate: formData.diagnosedDate!,
          allergyType: formData.allergyType,
          isActive: formData.isActive,
          emergencyAction: formData.emergencyAction,
        };

        await allergiesService.addAllergy(patientId, createRequest);
      }

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      // Reset form
      setEditingAllergy(null);
      setIsAdding(false);
      setFormData({});
    } catch (error) {
      console.error("Error saving allergy:", error);
      alert("Error saving allergy. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Delete allergy
  const deleteAllergy = async (allergyId: string) => {
    setLoading(allergyId);
    if (!patientId) {
      console.error("Patient ID is missing — cannot update allergy.");
      return;
    }
    try {
      await allergiesService.deleteAllergy(patientId, allergyId);

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting allergy:", error);
      alert("Error deleting allergy. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Update severity only
  const updateSeverity = async (allergyId: string, severity: string) => {
    setLoading(`${allergyId}-severity`);
    if (!patientId) {
      console.error("Patient ID is missing — cannot update allergy.");
      return;
    }
    try {
      await allergiesService.updateAllergySeverity(
        patientId,
        allergyId,
        severity
      );

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error("Error updating severity:", error);
      alert("Error updating severity. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Toggle active status
  const toggleActiveStatus = async (
    allergyId: string,
    currentStatus: boolean
  ) => {
    setLoading(`${allergyId}-status`);
    if (!patientId) {
      console.error("Patient ID is missing — cannot update allergy.");
      return;
    }
    try {
      await allergiesService.partialUpdateAllergy(patientId, allergyId, {
        isActive: !currentStatus,
      });

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating allergy status. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          Known Allergies
          <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full ml-2">
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
            Add Allergy
          </motion.button>
        </div>
      </div>

      {/* Add New Allergy Form */}
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
                Add New Allergy
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
                  Allergen *
                </label>
                <input
                  type="text"
                  value={formData.allergen || ""}
                  onChange={(e) =>
                    handleInputChange("allergen", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Penicillin, Peanuts"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergy Type
                </label>
                <select
                  value={formData.allergyType || ""}
                  onChange={(e) =>
                    handleInputChange("allergyType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="drug">Drug</option>
                  <option value="food">Food</option>
                  <option value="environmental">Environmental</option>
                  <option value="insect">Insect</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity *
                </label>
                <select
                  value={formData.severity || ""}
                  onChange={(e) =>
                    handleInputChange("severity", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="MILD">Mild</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="SEVERE">Severe</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnosed Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={formData.diagnosedDate || ""}
                    onChange={(e) =>
                      handleInputChange("diagnosedDate", e.target.value)
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reaction/Symptoms
                </label>
                <textarea
                  value={formData.reaction || ""}
                  onChange={(e) =>
                    handleInputChange("reaction", e.target.value)
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the allergic reaction and symptoms..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Action
                </label>
                <textarea
                  value={formData.emergencyAction || ""}
                  onChange={(e) =>
                    handleInputChange("emergencyAction", e.target.value)
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Emergency procedures and medications..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional notes..."
                />
              </div>
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
                <span className="text-sm text-gray-700">Active Allergy</span>
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
                  onClick={saveAllergy}
                  disabled={loading === "new"}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {loading === "new" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Add Allergy
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {allergies.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-gray-500">
            No allergies found. Click "Add Allergy" to create one.
          </div>
        ) : (
          allergies.map((allergy, index) => (
            <motion.div
              key={allergy.id}
              className="bg-red-50 rounded-xl p-4 border-2 border-red-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              {editingAllergy === allergy.id ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-900">
                      Edit Allergy
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
                        Allergen *
                      </label>
                      <input
                        type="text"
                        value={formData.allergen || ""}
                        onChange={(e) =>
                          handleInputChange("allergen", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Severity *
                      </label>
                      <select
                        value={formData.severity || ""}
                        onChange={(e) =>
                          handleInputChange("severity", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="MILD">Mild</option>
                        <option value="MODERATE">Moderate</option>
                        <option value="SEVERE">Severe</option>
                        <option value="CRITICAL">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      disabled={loading === allergy.id}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveAllergy}
                      disabled={loading === allergy.id}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                      {loading === allergy.id ? (
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
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getTypeIcon(allergy.allergyType)}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {safeValue(allergy.allergen)}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {safeValue(allergy.allergyType)} Allergy
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <select
                            value={allergy.severity}
                            onChange={(e) =>
                              updateSeverity(allergy.id, e.target.value)
                            }
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(
                              allergy.severity
                            )} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            disabled={loading === `${allergy.id}-severity`}
                          >
                            <option value="MILD">Mild</option>
                            <option value="MODERATE">Moderate</option>
                            <option value="SEVERE">Severe</option>
                            <option value="CRITICAL">Critical</option>
                          </select>
                          {loading === `${allergy.id}-severity` && (
                            <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                          )}
                        </div>
                        {allergy.severity?.toUpperCase() === "CRITICAL" && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            <Zap className="w-5 h-5 text-red-600" />
                          </motion.div>
                        )}
                      </div>

                      <div className="flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEdit(allergy)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Allergy"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowDeleteConfirm(allergy.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Allergy"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-white bg-opacity-70 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        Reaction
                      </h4>
                      <p className="text-gray-700 text-sm">
                        {safeValue(allergy.reaction)}
                      </p>
                    </div>

                    <div className="bg-white bg-opacity-70 rounded-lg p-3">
                      <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                        <Shield className="w-4 h-4 text-green-500" />
                        Emergency Action
                      </h4>
                      <p className="text-gray-700 text-sm font-medium">
                        {safeValue(allergy.emergencyAction)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Diagnosed:{" "}
                      {allergy.diagnosedDate
                        ? new Date(allergy.diagnosedDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          toggleActiveStatus(allergy.id, allergy.isActive)
                        }
                        disabled={loading === `${allergy.id}-status`}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          allergy.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        } transition-colors`}
                      >
                        {loading === `${allergy.id}-status` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : allergy.isActive ? (
                          "Active"
                        ) : (
                          "Inactive"
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Delete Confirmation Modal */}
              <AnimatePresence>
                {showDeleteConfirm === allergy.id && (
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
                        Delete Allergy
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Are you sure you want to delete allergy to{" "}
                        <strong>{allergy.allergen}</strong>? This action cannot
                        be undone.
                      </p>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          disabled={loading === allergy.id}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => deleteAllergy(allergy.id)}
                          disabled={loading === allergy.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                          {loading === allergy.id ? (
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
