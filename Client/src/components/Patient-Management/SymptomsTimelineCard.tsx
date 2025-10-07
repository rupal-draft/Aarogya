// components/Patient-Management/SymptomsTimelineCard.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Clock,
  TrendingUp,
  Eye,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Loader2,
  Calendar,
  AlertTriangle,
  Zap,
} from "lucide-react";
import type { RecentSymptom } from "../../types/patientManagement";
import type {
  CreateSymptomTrackerRequest,
  UpdateSymptomTrackerRequest,
} from "../../types/patientDashboard";
import { symptomsService } from "../../Services/Patient/symptomsService";

interface SymptomsTimelineCardProps {
  symptoms: RecentSymptom[];
  onViewAll?: () => void;
  totalCount?: number;
  onDataUpdate?: () => void;
  patientId?: string;
}

export const SymptomsTimelineCard: React.FC<SymptomsTimelineCardProps> = ({
  symptoms,
  onViewAll,
  totalCount = 0,
  onDataUpdate,
  patientId,
}) => {
  const [editingSymptom, setEditingSymptom] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<
    Partial<CreateSymptomTrackerRequest>
  >({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const showViewAll = totalCount > 3;

  const safeValue = (val: any, fallback: string = "N/A") =>
    val !== undefined && val !== null ? val : fallback;

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return "text-red-600 bg-red-100";
    if (severity >= 6) return "text-orange-600 bg-orange-100";
    if (severity >= 4) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getSeverityWidth = (severity: number) => `${(severity / 10) * 100}%`;

  const getSeverityIcon = (severity: number) => {
    if (severity >= 8) return <Zap className="w-4 h-4 text-red-500" />;
    if (severity >= 6)
      return <AlertTriangle className="w-4 h-4 text-orange-500" />;
    if (severity >= 4) return <Activity className="w-4 h-4 text-yellow-500" />;
    return <Activity className="w-4 h-4 text-green-500" />;
  };

  // Start editing a symptom
  const startEdit = (symptom: RecentSymptom, index: number) => {
    setEditingSymptom(symptom.id);
    setFormData({
      symptomName: symptom.symptomName,
      severity: symptom.severity,
      description: symptom.description,
      duration: symptom.duration,
      frequency: symptom.frequency,
      recordedAt: symptom.recordedAt,
      category: "",
      triggers: [],
      associatedSymptoms: [],
      notes: "",
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingSymptom(null);
    setFormData({});
  };

  // Start adding new symptom
  const startAdd = () => {
    setIsAdding(true);
    setFormData({
      symptomName: "",
      severity: 3,
      description: "",
      duration: "",
      frequency: "",
      recordedAt: new Date().toISOString(),
      category: "general",
      triggers: [],
      associatedSymptoms: [],
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

  // Handle array fields (triggers, associatedSymptoms)
  const handleArrayFieldChange = (field: string, value: string) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({
      ...prev,
      [field]: items,
    }));
  };

  // Save symptom (create or update)
  const saveSymptom = async () => {
    if (!formData.symptomName || formData.severity === undefined) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(editingSymptom || "new");

    try {
      const requestData: CreateSymptomTrackerRequest = {
        symptomName: formData.symptomName!,
        severity: formData.severity!,
        description: formData.description,
        duration: formData.duration,
        frequency: formData.frequency,
        recordedAt: formData.recordedAt,
        category: formData.category,
        triggers: formData.triggers,
        associatedSymptoms: formData.associatedSymptoms,
        notes: formData.notes,
      };

      if (editingSymptom) {
        const updateRequest: UpdateSymptomTrackerRequest = {
          symptomName: formData.symptomName,
          severity: formData.severity,
          description: formData.description,
          duration: formData.duration,
          frequency: formData.frequency,
          recordedAt: formData.recordedAt,
          category: formData.category,
          triggers: formData.triggers,
          associatedSymptoms: formData.associatedSymptoms,
          notes: formData.notes,
        };

        await symptomsService.updateSymptom(editingSymptom, updateRequest);
      } else {
        // Create new symptom
        await symptomsService.recordSymptom(requestData);
      }

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      // Reset form
      setEditingSymptom(null);
      setIsAdding(false);
      setFormData({});
    } catch (error) {
      console.error("Error saving symptom:", error);
      alert("Error saving symptom. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Delete symptom
  const deleteSymptom = async (symptom: RecentSymptom, index: number) => {
    const symptomId = symptom.id;
    setLoading(symptomId);

    try {
      await symptomsService.deleteSymptom(symptomId);

      if (onDataUpdate) {
        onDataUpdate();
      }

      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting symptom:", error);
      alert("Error deleting symptom. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Update severity only
  const updateSeverity = async (
    symptom: RecentSymptom,
    index: number,
    severity: number
  ) => {
    const symptomId = symptom.id;
    setLoading(`${symptomId}-severity`);

    try {
      const updateRequest: UpdateSymptomTrackerRequest = {
        severity: severity,
      };

      await symptomsService.partialUpdateSymptom(symptom.id, updateRequest);

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

  // Common symptom categories
  const symptomCategories = [
    "Pain",
    "Respiratory",
    "Gastrointestinal",
    "Neurological",
    "Cardiac",
    "Musculoskeletal",
    "Dermatological",
    "Psychological",
    "General",
    "Other",
  ];

  // Common durations
  const durations = [
    "Few minutes",
    "Less than 1 hour",
    "1-4 hours",
    "4-12 hours",
    "12-24 hours",
    "1-3 days",
    "3-7 days",
    "1-2 weeks",
    "2-4 weeks",
    "Over 1 month",
    "Chronic",
  ];

  // Common frequencies
  const frequencies = [
    "Rarely",
    "Occasionally",
    "Weekly",
    "Daily",
    "Multiple times daily",
    "Constant",
    "Intermittent",
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-500" />
          Recent Symptoms
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
              View
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startAdd}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Record
          </motion.button>
        </div>
      </div>

      {/* Add New Symptom Form */}
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
                Record New Symptom
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
                  Symptom Name *
                </label>
                <input
                  type="text"
                  value={formData.symptomName || ""}
                  onChange={(e) =>
                    handleInputChange("symptomName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Headache, Nausea, Chest Pain"
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
                  {symptomCategories.map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity Level *
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.severity || 3}
                    onChange={(e) =>
                      handleInputChange("severity", parseInt(e.target.value))
                    }
                    className="flex-1"
                  />
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${getSeverityColor(
                      formData.severity || 3
                    )} min-w-12 text-center`}
                  >
                    {formData.severity || 3}/10
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recorded Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="datetime-local"
                    value={formData.recordedAt || ""}
                    onChange={(e) =>
                      handleInputChange("recordedAt", e.target.value)
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <select
                  value={formData.duration || ""}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select duration</option>
                  {durations.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={formData.frequency || ""}
                  onChange={(e) =>
                    handleInputChange("frequency", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select frequency</option>
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Triggers
                </label>
                <input
                  type="text"
                  placeholder="e.g., stress, certain foods, activity"
                  onChange={(e) =>
                    handleArrayFieldChange("triggers", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple triggers with commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Associated Symptoms
                </label>
                <input
                  type="text"
                  placeholder="e.g., fever, dizziness, fatigue"
                  onChange={(e) =>
                    handleArrayFieldChange("associatedSymptoms", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple symptoms with commas
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description & Notes
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the symptom in detail, including location, quality, and any relieving/aggravating factors..."
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelAdd}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading === "new"}
              >
                Cancel
              </button>
              <button
                onClick={saveSymptom}
                disabled={loading === "new"}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading === "new" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Record Symptom
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {symptoms.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-gray-500">
            No symptoms recorded. Click "Record Symptom" to add one.
          </div>
        ) : (
          symptoms.map((symptom, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              {editingSymptom === symptom.id ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-900">
                      Edit Symptom
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
                        Symptom Name *
                      </label>
                      <input
                        type="text"
                        value={formData.symptomName || ""}
                        onChange={(e) =>
                          handleInputChange("symptomName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Severity Level
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={formData.severity || 3}
                          onChange={(e) =>
                            handleInputChange(
                              "severity",
                              parseInt(e.target.value)
                            )
                          }
                          className="flex-1"
                        />
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${getSeverityColor(
                            formData.severity || 3
                          )} min-w-12 text-center`}
                        >
                          {formData.severity || 3}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      disabled={loading === symptom.id}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveSymptom}
                      disabled={loading === symptom.id}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                      {loading === symptom.id ? (
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        {safeValue(symptom.symptomName)}
                        {getSeverityIcon(symptom.severity)}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {safeValue(symptom.description)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-bold ${getSeverityColor(
                            symptom.severity
                          )}`}
                        >
                          {safeValue(symptom.severity)}/10
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEdit(symptom, index)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Symptom"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowDeleteConfirm(symptom.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Symptom"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Severity Level</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {safeValue(symptom.severity)}/10
                        </span>
                        {/* Quick Severity Update */}
                        <select
                          value={symptom.severity}
                          onChange={(e) =>
                            updateSeverity(
                              symptom,
                              index,
                              parseInt(e.target.value)
                            )
                          }
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading === `${symptom.id}-severity`}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          getSeverityColor(symptom.severity).split(" ")[1]
                        } opacity-70 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: getSeverityWidth(symptom.severity) }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      Duration: {safeValue(symptom.duration)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      Frequency: {safeValue(symptom.frequency)}
                    </div>
                    <div className="text-gray-600">
                      Recorded:{" "}
                      {symptom.recordedAt
                        ? new Date(symptom.recordedAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </>
              )}

              {/* Delete Confirmation Modal */}
              <AnimatePresence>
                {showDeleteConfirm === symptom.id && (
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
                        Delete Symptom
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Are you sure you want to delete the symptom record for{" "}
                        <strong>"{symptom.symptomName}"</strong>? This action
                        cannot be undone.
                      </p>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          disabled={loading === symptom.id}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => deleteSymptom(symptom, index)}
                          disabled={loading === symptom.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                          {loading === symptom.id ? (
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
