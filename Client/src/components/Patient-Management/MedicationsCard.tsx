// components/Patient-Management/MedicationsCard.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pill,
  Clock,
  User,
  AlertCircle,
  Eye,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Loader2,
  Calendar,
  Bell,
  Syringe,
} from "lucide-react";
import type { ActiveMedication } from "../../types/patientManagement";
import type {
  CreateMedicationRequest,
  UpdateMedicationRequest,
} from "../../types/patientDashboard";
import { medicationsService } from "../../Services/Patient/medicationsService";

interface MedicationsCardProps {
  medications: ActiveMedication[];
  onViewAll?: () => void;
  totalCount?: number;
  onDataUpdate?: () => void;
  patientId?: string;
}

export const MedicationsCard: React.FC<MedicationsCardProps> = ({
  medications,
  onViewAll,
  totalCount = 0,
  onDataUpdate,
  patientId,
}) => {
  const [editingMedication, setEditingMedication] = useState<string | null>(
    null
  );
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreateMedicationRequest>>(
    {}
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const showViewAll = totalCount > 3;

  const safeValue = (val: any, fallback: string = "N/A") =>
    val !== undefined && val !== null ? val : fallback;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "discontinued":
        return "bg-red-100 text-red-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Start editing a medication
  const startEdit = (medication: ActiveMedication) => {
    setEditingMedication(medication.id);
    setFormData({
      medicationName: medication.medicationName,
      dosage: medication.dosage.toString(),
      frequency: medication.frequency,
      startDate: medication.startDate,
      prescribedBy: medication.prescribedBy,
      status: medication.status,
      notes: medication.instructions,
      reminderEnabled: medication.reminderEnabled,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingMedication(null);
    setFormData({});
  };

  // Start adding new medication
  const startAdd = () => {
    setIsAdding(true);
    setFormData({
      medicationName: "",
      dosage: "",
      frequency: "Once daily",
      startDate: new Date().toISOString().split("T")[0],
      prescribedBy: "",
      status: "ACTIVE",
      notes: "",
      reminderEnabled: false,
      medicationType: "tablet",
      purpose: "",
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

  // Save medication (create or update)
  const saveMedication = async () => {
    if (
      !formData.medicationName ||
      !formData.dosage ||
      !formData.frequency ||
      !formData.startDate
    ) {
      alert("Please fill in all required fields");
      return;
    }
    if (!patientId) {
      console.error("Patient ID is missing — cannot update allergy.");
      return;
    }
    setLoading(editingMedication || "new");

    try {
      if (editingMedication) {
        // Update existing medication
        const updateRequest: UpdateMedicationRequest = {
          medicationName: formData.medicationName,
          dosage: parseFloat(formData.dosage),
          frequency: formData.frequency,
          startDate: formData.startDate,
          prescribedBy: formData.prescribedBy,
          status: formData.status as
            | "ACTIVE"
            | "COMPLETED"
            | "DISCONTINUED"
            | "PAUSED",
          instructions: formData.notes,
          reminderEnabled: formData.reminderEnabled,
        };

        await medicationsService.updateMedication(
          patientId,
          editingMedication,
          updateRequest
        );
      } else {
        // Create new medication
        const createRequest: CreateMedicationRequest = {
          medicationName: formData.medicationName!,
          dosage: formData.dosage!,
          frequency: formData.frequency!,
          startDate: formData.startDate!,
          prescribedBy: formData.prescribedBy,
          status: formData.status,
          notes: formData.notes,
          reminderEnabled: formData.reminderEnabled,
          medicationType: formData.medicationType,
          purpose: formData.purpose,
        };

        await medicationsService.addMedication(patientId, createRequest);
      }

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      // Reset form
      setEditingMedication(null);
      setIsAdding(false);
      setFormData({});
    } catch (error) {
      console.error("Error saving medication:", error);
      alert("Error saving medication. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Delete medication
  const deleteMedication = async (medicationId: string) => {
    setLoading(medicationId);
    if (!patientId) {
      console.error("Patient ID is missing — cannot update allergy.");
      return;
    }
    try {
      await medicationsService.deleteMedication(patientId, medicationId);

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting medication:", error);
      alert("Error deleting medication. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Update medication status
  const updateStatus = async (medicationId: string, status: string) => {
    setLoading(`${medicationId}-status`);
    if (!patientId) {
      console.error("Patient ID is missing — cannot update allergy.");
      return;
    }
    try {
      await medicationsService.updateMedicationStatus(
        patientId,
        medicationId,
        status
      );

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error("Error updating medication status:", error);
      alert("Error updating medication status. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Toggle reminder
  const toggleReminder = async (
    medicationId: string,
    currentStatus: boolean
  ) => {
    setLoading(`${medicationId}-reminder`);
    if (!patientId) {
      console.error("Patient ID is missing — cannot update allergy.");
      return;
    }
    try {
      await medicationsService.partialUpdateMedication(
        patientId,
        medicationId,
        {
          reminderEnabled: !currentStatus,
        }
      );

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error("Error updating reminder:", error);
      alert("Error updating reminder. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Common dosage units
  const dosageUnits = [
    "mg",
    "mcg",
    "g",
    "mL",
    "tsp",
    "tbsp",
    "units",
    "puffs",
    "drops",
  ];

  // Common frequencies
  const frequencies = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
    "Weekly",
    "Monthly",
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Pill className="w-6 h-6 text-blue-500" />
          Active Medications
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
            Add
          </motion.button>
        </div>
      </div>

      {/* Add New Medication Form */}
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
                Add New Medication
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
                  Medication Name *
                </label>
                <input
                  type="text"
                  value={formData.medicationName || ""}
                  onChange={(e) =>
                    handleInputChange("medicationName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Amoxicillin, Lisinopril"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.dosage || ""}
                    onChange={(e) =>
                      handleInputChange("dosage", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 500"
                  />
                  <select
                    value={formData.medicationType || ""}
                    onChange={(e) =>
                      handleInputChange("medicationType", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {dosageUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency *
                </label>
                <select
                  value={formData.frequency || ""}
                  onChange={(e) =>
                    handleInputChange("frequency", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={formData.startDate || ""}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prescribed By
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.prescribedBy || ""}
                    onChange={(e) =>
                      handleInputChange("prescribedBy", e.target.value)
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Doctor's name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <input
                  type="text"
                  value={formData.purpose || ""}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Blood pressure, Infection"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructions & Notes
              </label>
              <textarea
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Special instructions, side effects, or additional notes..."
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.reminderEnabled || false}
                    onChange={(e) =>
                      handleInputChange("reminderEnabled", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Bell className="w-4 h-4 text-blue-500" />
                    Enable Reminders
                  </span>
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={cancelAdd}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={loading === "new"}
                >
                  Cancel
                </button>
                <button
                  onClick={saveMedication}
                  disabled={loading === "new"}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {loading === "new" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Add Medication
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {medications.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-gray-500">
            No medications found. Click "Add Medication" to create one.
          </div>
        ) : (
          medications.map((medication, index) => (
            <motion.div
              key={medication.id}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              {editingMedication === medication.id ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-900">
                      Edit Medication
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
                        Medication Name *
                      </label>
                      <input
                        type="text"
                        value={formData.medicationName || ""}
                        onChange={(e) =>
                          handleInputChange("medicationName", e.target.value)
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
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="DISCONTINUED">Discontinued</option>
                        <option value="PAUSED">Paused</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      disabled={loading === medication.id}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveMedication}
                      disabled={loading === medication.id}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                      {loading === medication.id ? (
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
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {safeValue(medication.medicationName)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            medication.status
                          )}`}
                        >
                          {safeValue(medication.status)}
                        </span>
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {safeValue(medication.dosage)}{" "}
                        {safeValue(medication.dosageUnit)} -{" "}
                        {safeValue(medication.frequency)}
                      </p>
                      {medication.route && (
                        <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                          <Syringe className="w-4 h-4" />
                          Route: {medication.route}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {medication.reminderEnabled && (
                        <motion.div
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                        </motion.div>
                      )}

                      <div className="flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            toggleReminder(
                              medication.id,
                              medication.reminderEnabled
                            )
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            medication.reminderEnabled
                              ? "text-orange-600 bg-orange-100 hover:bg-orange-200"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                          title={
                            medication.reminderEnabled
                              ? "Disable Reminder"
                              : "Enable Reminder"
                          }
                          disabled={loading === `${medication.id}-reminder`}
                        >
                          {loading === `${medication.id}-reminder` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEdit(medication)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Medication"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowDeleteConfirm(medication.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Medication"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      Route: {safeValue(medication.route)}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      {safeValue(medication.prescribedBy)}
                    </div>
                    <div className="text-gray-600">
                      Started:{" "}
                      {medication.startDate
                        ? new Date(medication.startDate).toLocaleDateString()
                        : "N/A"}
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

                  {/* Quick Status Update */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Update Status:</span>
                      <select
                        value={medication.status}
                        onChange={(e) =>
                          updateStatus(medication.id, e.target.value)
                        }
                        className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading === `${medication.id}-status`}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="DISCONTINUED">Discontinued</option>
                        <option value="PAUSED">Paused</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Delete Confirmation Modal */}
              <AnimatePresence>
                {showDeleteConfirm === medication.id && (
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
                        Delete Medication
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Are you sure you want to delete{" "}
                        <strong>{medication.medicationName}</strong>? This
                        action cannot be undone.
                      </p>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          disabled={loading === medication.id}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => deleteMedication(medication.id)}
                          disabled={loading === medication.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                          {loading === medication.id ? (
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
