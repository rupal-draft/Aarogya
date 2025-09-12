import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertTriangle,
  Search,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import type {
  MedicineDto,
  MedicineInteractionCheck,
} from "../../types/prescription";
import { prescriptionService } from "../../Services/prescription";

interface InteractionCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InteractionCheckModal: React.FC<InteractionCheckModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MedicineDto[]>([]);
  const [interactions, setInteractions] = useState<MedicineInteractionCheck[]>(
    []
  );
  const [isSearching, setIsSearching] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

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

  const addMedicine = (medicineId: string) => {
    if (!selectedMedicines.includes(medicineId)) {
      setSelectedMedicines((prev) => [...prev, medicineId]);
    }
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeMedicine = (medicineId: string) => {
    setSelectedMedicines((prev) => prev.filter((id) => id !== medicineId));
    setInteractions([]);
  };

  const checkInteractions = async () => {
    if (selectedMedicines.length < 2) return;

    setIsChecking(true);
    try {
      const result = await prescriptionService.checkInteractions(
        selectedMedicines
      );
      setInteractions(result);
    } catch (error) {
      console.error("Error checking interactions:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "low":
        return "green";
      case "moderate":
        return "yellow";
      case "high":
        return "orange";
      case "severe":
        return "red";
      default:
        return "gray";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "low":
        return CheckCircle;
      case "moderate":
        return AlertCircle;
      case "high":
      case "severe":
        return XCircle;
      default:
        return AlertTriangle;
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
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-2xl font-bold">
                Medicine Interaction Checker
              </h2>
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Medicine Search */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Medicines to Check
            </h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search medicines to add..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleMedicineSearch(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-50 rounded-lg p-4 mb-4"
                >
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {searchResults.map((medicine, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addMedicine(medicine.id || "")}
                        disabled={selectedMedicines.includes(medicine.id || "")}
                        className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">
                              {medicine.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {medicine.therapeuticClass}
                            </div>
                          </div>
                          {selectedMedicines.includes(medicine.id || "") && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isSearching && (
              <div className="text-center py-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"
                />
              </div>
            )}
          </div>

          {/* Selected Medicines */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Selected Medicines ({selectedMedicines.length})
            </h3>
            {selectedMedicines.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>
                  No medicines selected. Search and add medicines to check for
                  interactions.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {selectedMedicines.map((medicineId, index) => (
                  <motion.div
                    key={medicineId}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-between bg-orange-50 rounded-lg p-3 border border-orange-200"
                  >
                    <span className="font-medium text-gray-900">
                      Medicine {index + 1}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeMedicine(medicineId)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Check Button */}
            {selectedMedicines.length >= 2 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={checkInteractions}
                disabled={isChecking}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isChecking ? (
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
                    Checking Interactions...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    Check for Interactions
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Interaction Results */}
          {interactions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Interaction Results
              </h3>
              <div className="space-y-4">
                {interactions.map((interaction, index) => {
                  const SeverityIcon = getSeverityIcon(interaction.severity);
                  const severityColor = getSeverityColor(interaction.severity);

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-${severityColor}-50 border border-${severityColor}-200 rounded-lg p-4`}
                    >
                      <div className="flex items-start gap-3">
                        <SeverityIcon
                          className={`w-5 h-5 text-${severityColor}-600 mt-0.5 flex-shrink-0`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-3 py-1 bg-${severityColor}-200 text-${severityColor}-800 text-xs font-medium rounded-full uppercase`}
                            >
                              {interaction.severity}
                            </span>
                            <span className="text-sm text-gray-600">
                              Medicine{" "}
                              {selectedMedicines.indexOf(
                                interaction.medicineId1
                              ) + 1}{" "}
                              ↔ Medicine{" "}
                              {selectedMedicines.indexOf(
                                interaction.medicineId2
                              ) + 1}
                            </span>
                          </div>
                          <p className="text-gray-700">
                            {interaction.interactionDescription}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* No Interactions Message */}
          {selectedMedicines.length >= 2 &&
            interactions.length === 0 &&
            !isChecking && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Interactions Found
                </h3>
                <p className="text-gray-600">
                  The selected medicines appear to be safe when used together.
                </p>
              </motion.div>
            )}

          {/* Warning Message */}
          {selectedMedicines.length < 2 && selectedMedicines.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">
                  Add at least 2 medicines to check for interactions
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InteractionCheckModal;
