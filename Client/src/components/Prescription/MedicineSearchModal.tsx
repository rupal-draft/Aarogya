import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Filter, Pill, Info, AlertTriangle } from "lucide-react";
import type {
  MedicineDto,
  MedicineSearchRequest,
} from "../../types/prescription";
import { prescriptionService } from "../../Services/prescription";

interface MedicineSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MedicineSearchModal: React.FC<MedicineSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<MedicineSearchRequest>({
    name: "",
    chemicalClass: "",
    therapeuticClass: "",
    actionClass: "",
    page: 0,
    size: 20,
  });
  const [results, setResults] = useState<MedicineDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineDto | null>(
    null
  );
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const searchRequest = {
        ...filters,
        name: searchQuery || filters.name,
      };
      const response = await prescriptionService.searchMedicines(searchRequest);
      setResults(response.content);
      setTotalResults(response.totalElements);
    } catch (error) {
      console.error("Error searching medicines:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterChange = (
    field: keyof MedicineSearchRequest,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      chemicalClass: "",
      therapeuticClass: "",
      actionClass: "",
      page: 0,
      size: 20,
    });
    setSearchQuery("");
    setResults([]);
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Medicine Database</h2>
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

        <div className="flex h-[calc(90vh-120px)]">
          {/* Search Panel */}
          <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors mb-4"
            >
              <Filter className="w-4 h-4" />
              <span>Advanced Filters</span>
            </motion.button>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 mb-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chemical Class
                    </label>
                    <input
                      type="text"
                      value={filters.chemicalClass}
                      onChange={(e) =>
                        handleFilterChange("chemicalClass", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Therapeutic Class
                    </label>
                    <input
                      type="text"
                      value={filters.therapeuticClass}
                      onChange={(e) =>
                        handleFilterChange("therapeuticClass", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action Class
                    </label>
                    <input
                      type="text"
                      value={filters.actionClass}
                      onChange={(e) =>
                        handleFilterChange("actionClass", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </motion.button>
            </div>

            {/* Results Count */}
            {totalResults > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                Found {totalResults} medicine{totalResults !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="flex-1 overflow-y-auto">
            {results?.length === 0 && !isSearching ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Search Medicines
                  </h3>
                  <p className="text-gray-600">
                    Use the search box or filters to find medicines in the
                    database
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                {selectedMedicine ? (
                  // Medicine Details View
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedMedicine.name}
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMedicine(null)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Back to Results
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Classification
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">
                              Chemical Class:
                            </span>
                            <span className="ml-2 font-medium">
                              {selectedMedicine.chemicalClass}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Therapeutic Class:
                            </span>
                            <span className="ml-2 font-medium">
                              {selectedMedicine.therapeuticClass}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Action Class:</span>
                            <span className="ml-2 font-medium">
                              {selectedMedicine.actionClass}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Safety Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            {selectedMedicine.habitForming ? (
                              <>
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                <span className="text-orange-700">
                                  Habit Forming
                                </span>
                              </>
                            ) : (
                              <>
                                <Info className="w-4 h-4 text-green-500" />
                                <span className="text-green-700">
                                  Non-Habit Forming
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedMedicine.uses &&
                      selectedMedicine.uses.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">
                            Uses
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedMedicine.uses.map((use, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                              >
                                {use}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {selectedMedicine.sideEffects &&
                      selectedMedicine.sideEffects.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">
                            Side Effects
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedMedicine.sideEffects.map(
                              (effect, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full"
                                >
                                  {effect}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {selectedMedicine.substitutes &&
                      selectedMedicine.substitutes.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">
                            Substitutes
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedMedicine.substitutes.map(
                              (substitute, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                                >
                                  {substitute}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </motion.div>
                ) : (
                  // Results List View
                  <div className="space-y-3">
                    {results?.map((medicine, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedMedicine(medicine)}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {medicine.name}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">
                                  Therapeutic:
                                </span>
                                <br />
                                {medicine.therapeuticClass}
                              </div>
                              <div>
                                <span className="font-medium">Chemical:</span>
                                <br />
                                {medicine.chemicalClass}
                              </div>
                              <div className="flex items-center gap-2">
                                {medicine.habitForming ? (
                                  <>
                                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                                    <span className="text-orange-700">
                                      Habit Forming
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Info className="w-4 h-4 text-green-500" />
                                    <span className="text-green-700">Safe</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 ml-4" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MedicineSearchModal;
