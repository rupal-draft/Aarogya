"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
  Activity,
} from "lucide-react";
import GlassCard from "../../common/Cards/GlassCard";
import axios from "axios";

interface Disease {
  id: string;
  diseaseName: string;
  diseaseCode: string;
  diagnosisDate: string;
  diagnosedBy: string;
  severity: string;
  status: string;
  description: string;
  treatment: string;
  notes: string;
  severityBadgeColor: string;
  statusBadgeColor: string;
  daysSinceDiagnosis: number;
  active: boolean;
  critical: boolean;
  chronic: boolean;
}

interface DiseaseHistoryTabProps {
  diseases: Disease[];
  onRefresh: () => void;
}

const DiseaseHistoryTab = ({ diseases, onRefresh }: DiseaseHistoryTabProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    diseaseName: "",
    diseaseCode: "",
    diagnosisDate: "",
    diagnosedBy: "",
    severity: "Mild",
    status: "Active",
    description: "",
    treatment: "",
    notes: "",
  });

  const handleCreate = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/v1/patient/diseases",
        formData,
        {
          withCredentials: true,
        }
      );
      setIsCreating(false);
      setFormData({
        diseaseName: "",
        diseaseCode: "",
        diagnosisDate: "",
        diagnosedBy: "",
        severity: "Mild",
        status: "Active",
        description: "",
        treatment: "",
        notes: "",
      });
      onRefresh();
    } catch (error) {
      console.error("Failed to create disease:", error);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/patient/diseases/${id}`,
        formData,
        {
          withCredentials: true,
        }
      );
      setEditingId(null);
      onRefresh();
    } catch (error) {
      console.error("Failed to update disease:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/patient/diseases/${id}`,
        {
          withCredentials: true,
        }
      );
      onRefresh();
    } catch (error) {
      console.error("Failed to delete disease:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "mild":
        return "from-green-500 to-emerald-600";
      case "moderate":
        return "from-yellow-500 to-orange-600";
      case "severe":
        return "from-red-500 to-rose-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "from-red-500 to-rose-600";
      case "recovered":
        return "from-green-500 to-emerald-600";
      case "inactive":
        return "from-gray-500 to-slate-600";
      default:
        return "from-blue-500 to-indigo-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 p-6"
    >
      {/* Header with Create Button */}
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Disease History
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive medical disease tracking and management
          </p>
        </div>
        <motion.button
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          Add Disease
        </motion.button>
      </motion.div>

      {/* Create Form */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <GlassCard className="p-8 backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Add New Disease
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Disease Name
                </label>
                <input
                  type="text"
                  value={formData.diseaseName}
                  onChange={(e) =>
                    setFormData({ ...formData, diseaseName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="Enter disease name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Disease Code
                </label>
                <input
                  type="text"
                  value={formData.diseaseCode}
                  onChange={(e) =>
                    setFormData({ ...formData, diseaseCode: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="ICD-10 code"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Diagnosis Date
                </label>
                <input
                  type="date"
                  value={formData.diagnosisDate}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosisDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Diagnosed By
                </label>
                <input
                  type="text"
                  value={formData.diagnosedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosedBy: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  placeholder="Doctor name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Severity
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) =>
                    setFormData({ ...formData, severity: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                >
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                >
                  <option value="Active">Active</option>
                  <option value="Recovered">Recovered</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  rows={3}
                  placeholder="Disease description"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Treatment
                </label>
                <textarea
                  value={formData.treatment}
                  onChange={(e) =>
                    setFormData({ ...formData, treatment: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  rows={3}
                  placeholder="Treatment details"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  rows={2}
                  placeholder="Additional notes"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <motion.button
                onClick={handleCreate}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Disease
              </motion.button>
              <motion.button
                onClick={() => setIsCreating(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Disease Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {diseases.map((disease, index) => (
          <motion.div
            key={disease.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="group"
          >
            <GlassCard className="p-6 backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl hover:bg-white/30 transition-all duration-500 relative overflow-hidden">
              {/* Background Animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={`p-3 bg-gradient-to-r ${getSeverityColor(
                        disease.severity
                      )} rounded-2xl shadow-lg`}
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: index * 0.2,
                      }}
                    >
                      <Activity className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {disease.diseaseName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {disease.diseaseCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => {
                        setEditingId(disease.id);
                        setFormData({
                          diseaseName: disease.diseaseName,
                          diseaseCode: disease.diseaseCode,
                          diagnosisDate: disease.diagnosisDate,
                          diagnosedBy: disease.diagnosedBy,
                          severity: disease.severity,
                          status: disease.status,
                          description: disease.description,
                          treatment: disease.treatment,
                          notes: disease.notes,
                        });
                      }}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(disease.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex gap-2 mb-4">
                  <motion.span
                    className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(
                      disease.status
                    )} text-white text-xs font-semibold rounded-full shadow-lg`}
                    animate={{
                      boxShadow: [
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    {disease.status}
                  </motion.span>
                  <span
                    className={`px-3 py-1 bg-gradient-to-r ${getSeverityColor(
                      disease.severity
                    )} text-white text-xs font-semibold rounded-full shadow-lg`}
                  >
                    {disease.severity}
                  </span>
                  {disease.critical && (
                    <motion.span
                      className="px-3 py-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <AlertCircle className="w-3 h-3" />
                      Critical
                    </motion.span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Diagnosed: {disease.diagnosisDate}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">By:</span>{" "}
                    {disease.diagnosedBy}
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Description:</span>{" "}
                    {disease.description}
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Treatment:</span>{" "}
                    {disease.treatment}
                  </div>
                  {disease.notes && (
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">Notes:</span>{" "}
                      {disease.notes}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    {disease.daysSinceDiagnosis} days since diagnosis
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default DiseaseHistoryTab;
