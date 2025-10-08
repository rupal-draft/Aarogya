import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Search, Pill, Edit } from "lucide-react";
import type {
  MedicineDto,
  PrescribedMedicineDto,
  Prescription,
  PrescriptionRequest,
} from "../../types/prescription";
import { prescriptionService } from "../../Services/prescription";

interface UpdatePrescriptionModalProps {
  prescription: Prescription;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    prescriptionId: string,
    prescriptionData: PrescriptionRequest
  ) => Promise<void>;
}

const UpdatePrescriptionModal: React.FC<UpdatePrescriptionModalProps> = ({
  prescription,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    appointmentId: "",
    diagnosis: "",
    notes: "",
    medicines: [] as PrescribedMedicineDto[],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MedicineDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);

  // Initialize form data when prescription changes
  useEffect(() => {
    if (prescription) {
      setFormData({
        appointmentId: prescription.appointmentId,
        diagnosis: prescription.diagnosis,
        notes: prescription.notes,
        medicines: prescription.medicines.map((med) => ({
          medicineId: med.medicineId,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructions,
          isSubstitute: med.isSubstitute,
          originalMedicineId: med.originalMedicineId || undefined,
        })),
      });
    }
  }, [prescription]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMedicineSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await prescriptionService.searchMedicines({
        name: query,
        page: 0,
        size: 10,
      });
      setSearchResults(response.content);
    } catch (error) {
      console.error("Error searching medicines:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const addMedicine = (medicine: MedicineDto) => {
    const newMedicine: PrescribedMedicineDto = {
      medicineId: medicine.id || "",
      dosage: "",
      frequency: "",
      duration: 1,
      instructions: "",
      isSubstitute: false,
    };
    setFormData((prev) => ({
      ...prev,
      medicines: [...prev.medicines, newMedicine],
    }));
    setShowMedicineSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const updateMedicine = (
    index: number,
    field: keyof PrescribedMedicineDto,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }));
  };

  const removeMedicine = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(prescription.id, {
        ...formData,
        patientId: prescription.patientId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const contentVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, type: "spring", stiffness: 300 },
    },
    exit: { scale: 0.8, opacity: 0 },
  };

  if (!isOpen) return null;

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        variants={contentVariants}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Update Prescription</h2>
              <p className="text-green-100 mt-1">
                Prescription ID: {prescription.id}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
        >
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment ID *
                </label>
                <input
                  type="text"
                  value={formData.appointmentId}
                  onChange={(e) =>
                    handleInputChange("appointmentId", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient ID
                </label>
                <input
                  type="text"
                  value={prescription.patientId}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosis *
              </label>
              <input
                type="text"
                value={formData.diagnosis}
                onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                required
                minLength={5}
                maxLength={500}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
                maxLength={1000}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    prescription.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : prescription.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {prescription.status}
                </span>
                <span className="text-sm text-gray-500">
                  Created:{" "}
                  {new Date(prescription.createdAt).toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-500">
                  Updated:{" "}
                  {new Date(prescription.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Medicines Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Medicines ({formData.medicines.length})
                </h3>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMedicineSearch(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Medicine
                </motion.button>
              </div>

              {/* Medicine Search */}
              <AnimatePresence>
                {showMedicineSearch && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-green-50 rounded-lg p-4 mb-4"
                  >
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search medicines..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          handleMedicineSearch(e.target.value);
                        }}
                        className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    {isSearching && (
                      <div className="text-center py-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mx-auto"
                        />
                      </div>
                    )}
                    {searchResults.length > 0 && (
                      <div className="space-y-2">
                        {searchResults.map((medicine, index) => (
                          <motion.button
                            key={index}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => addMedicine(medicine)}
                            className="w-full text-left p-3 bg-white rounded-lg border border-green-200 hover:bg-green-50 transition-colors"
                          >
                            <div className="font-medium text-gray-900">
                              {medicine.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {medicine.therapeuticClass}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selected Medicines */}
              <div className="space-y-4">
                <AnimatePresence>
                  {formData.medicines.map((medicine, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Medicine {index + 1}
                          </h4>
                          {medicine.isSubstitute && (
                            <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full mt-1">
                              Substitute
                            </span>
                          )}
                        </div>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeMedicine(index)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dosage *
                          </label>
                          <input
                            type="text"
                            value={medicine.dosage}
                            onChange={(e) =>
                              updateMedicine(index, "dosage", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Frequency *
                          </label>
                          <select
                            value={medicine.frequency}
                            onChange={(e) =>
                              updateMedicine(index, "frequency", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          >
                            <option value="">Select frequency</option>
                            <option value="Once a day">Once a day</option>
                            <option value="Twice a day">Twice a day</option>
                            <option value="Thrice a day">Thrice a day</option>
                            <option value="Four times a day">
                              Four times a day
                            </option>
                            <option value="As needed">As needed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (days) *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={medicine.duration}
                            onChange={(e) =>
                              updateMedicine(
                                index,
                                "duration",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Instructions
                          </label>
                          <input
                            type="text"
                            value={medicine.instructions || ""}
                            onChange={(e) =>
                              updateMedicine(
                                index,
                                "instructions",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Take after food"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {formData.medicines.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Pill className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>
                    No medicines added yet. Click "Add Medicine" to get started.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 mt-8">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={
                isSubmitting ||
                !formData.appointmentId ||
                !formData.diagnosis ||
                formData.medicines.length === 0
              }
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Update Prescription
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UpdatePrescriptionModal;
