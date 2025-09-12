import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Pill,
  AlertTriangle,
  FileText,
  Activity,
  CheckCircle,
} from "lucide-react";
import type { Prescription } from "../../types/prescription";
import { prescriptionService } from "../../Services/prescription";
import CreatePrescriptionModal from "../../components/Prescription/CreatePrescriptionModal";
import MedicineSearchModal from "../../components/Prescription/MedicineSearchModal";
import PrescriptionCard from "../../components/Prescription/PrescriptionCard";
import InteractionCheckModal from "../../components/Prescription/InteractionCheckModal";

const PrescriptionDashboard: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<
    Prescription[]
  >([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  const [showInteractionCheck, setShowInteractionCheck] = useState(false);
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    totalMedicines: 0,
  });

  useEffect(() => {
    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId]);

  useEffect(() => {
    const filtered = prescriptions.filter(
      (prescription) =>
        prescription.diagnosis
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        prescription.medicines.some((med) =>
          med.medicineName.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    setFilteredPrescriptions(filtered);
  }, [prescriptions, searchQuery]);

  const fetchPrescriptions = async () => {
    if (!patientId) return;

    try {
      setLoading(true);
      const response = await prescriptionService.getPatientPrescriptions(
        patientId
      );
      setPrescriptions(response.data);

      // Calculate stats
      const total = response.data.length;
      const active = response.data.filter((p) => p.status === "ACTIVE").length;
      const completed = response.data.filter(
        (p) => p.status === "COMPLETED"
      ).length;
      const totalMedicines = response.data.reduce(
        (sum, p) => sum + p.medicines.length,
        0
      );

      setStats({ total, active, completed, totalMedicines });
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrescription = async (prescriptionData: any) => {
    try {
      await prescriptionService.createPrescription(prescriptionData);
      await fetchPrescriptions();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating prescription:", error);
    }
  };

  const handleDeletePrescription = async (prescriptionId: string) => {
    try {
      await prescriptionService.deletePrescription(prescriptionId);
      await fetchPrescriptions();
    } catch (error) {
      console.error("Error deleting prescription:", error);
    }
  };

  const handleUpdatePrescription = async (
    prescriptionId: string,
    updates: any
  ) => {
    try {
      await prescriptionService.updatePrescription(prescriptionId, updates);
      await fetchPrescriptions();
    } catch (error) {
      console.error("Error updating prescription:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const statVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, type: "spring", stiffness: 200 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-blue-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Prescription Dashboard
              </h1>
              <p className="text-gray-600">
                Manage prescriptions for Patient ID: {patientId}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMedicineSearch(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Search className="w-4 h-4" />
                Search Medicines
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInteractionCheck(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                Check Interactions
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                New Prescription
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: FileText,
              label: "Total Prescriptions",
              value: stats.total,
              color: "blue",
            },
            {
              icon: Activity,
              label: "Active",
              value: stats.active,
              color: "green",
            },
            {
              icon: CheckCircle,
              label: "Completed",
              value: stats.completed,
              color: "purple",
            },
            {
              icon: Pill,
              label: "Total Medicines",
              value: stats.totalMedicines,
              color: "orange",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={statVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-${stat.color}-100 hover:shadow-xl transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.label}
                  </p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`text-3xl font-bold text-${stat.color}-600`}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search Bar */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search prescriptions or medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </motion.div>

        {/* Prescriptions Grid */}
        <AnimatePresence mode="wait">
          {filteredPrescriptions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Prescriptions Found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Start by creating a new prescription for this patient"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                Create First Prescription
              </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPrescriptions.map((prescription, index) => (
                <motion.div
                  key={prescription.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PrescriptionCard
                    prescription={prescription}
                    onEdit={() => setSelectedPrescription(prescription)}
                    onDelete={() => handleDeletePrescription(prescription.id)}
                    onUpdate={handleUpdatePrescription}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreatePrescriptionModal
            patientId={patientId!}
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreatePrescription}
          />
        )}
        {showMedicineSearch && (
          <MedicineSearchModal
            isOpen={showMedicineSearch}
            onClose={() => setShowMedicineSearch(false)}
          />
        )}
        {showInteractionCheck && (
          <InteractionCheckModal
            isOpen={showInteractionCheck}
            onClose={() => setShowInteractionCheck(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PrescriptionDashboard;
