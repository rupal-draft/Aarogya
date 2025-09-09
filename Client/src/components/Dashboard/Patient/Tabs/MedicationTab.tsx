"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Pill,
  Clock,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  PauseCircle,
  Sparkles,
  Zap,
  Bell,
} from "lucide-react";
import Button from "../../../../common/Ui/Button";
import { Card } from "../../../../common/Ui/Card2";
import { Badge } from "../../../../common/Ui/Badge2";

interface MedicationsTabProps {
  data: any[];
}

export default function MedicationsTab({ data }: MedicationsTabProps) {
  const [medications, setMedications] = useState(data || []);
  const [filter, setFilter] = useState<
    "all" | "active" | "completed" | "discontinued"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "date" | "status">("date");

  // Filter medications based on selected filter
  const filteredMedications = medications.filter((medication) => {
    if (filter === "all") return true;
    if (filter === "active") return medication.status === "ACTIVE";
    if (filter === "completed") return medication.status === "COMPLETED";
    if (filter === "discontinued") return medication.status === "DISCONTINUED";
    return true;
  });

  // Sort medications based on selected sort option
  const sortedMedications = [...filteredMedications].sort((a, b) => {
    if (sortBy === "name") {
      return a.medicationName.localeCompare(b.medicationName);
    } else if (sortBy === "date") {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } else if (sortBy === "status") {
      const statusOrder = {
        ACTIVE: 1,
        COMPLETED: 2,
        DISCONTINUED: 3,
        PAUSED: 4,
      };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return 0;
  });

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return <CheckCircle className="w-4 h-4" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "DISCONTINUED":
        return <AlertCircle className="w-4 h-4" />;
      case "PAUSED":
        return <PauseCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-gradient-to-r from-green-500 to-emerald-600";
      case "COMPLETED":
        return "bg-gradient-to-r from-blue-500 to-cyan-600";
      case "DISCONTINUED":
        return "bg-gradient-to-r from-red-500 to-rose-600";
      case "PAUSED":
        return "bg-gradient-to-r from-yellow-500 to-amber-600";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-600";
    }
  };

  const getRouteIcon = (route: string) => {
    switch (route?.toLowerCase()) {
      case "oral":
        return "💊";
      case "inhalation":
        return "🌬️";
      case "injection":
        return "💉";
      case "topical":
        return "🧴";
      default:
        return "💊";
    }
  };

  const getFrequencyColor = (frequency: string) => {
    if (frequency?.toLowerCase().includes("daily"))
      return "from-blue-400 to-cyan-500";
    if (frequency?.toLowerCase().includes("twice"))
      return "from-purple-400 to-indigo-500";
    if (frequency?.toLowerCase().includes("three"))
      return "from-pink-400 to-rose-500";
    if (frequency?.toLowerCase().includes("as needed"))
      return "from-amber-400 to-orange-500";
    return "from-gray-400 to-slate-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-md border border-green-200/50">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white"
          >
            <Pill className="w-8 h-8" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-800 bg-clip-text text-transparent">
              Medications Management
            </h2>
            <p className="text-green-600">
              Track and manage your medication regimen
            </p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Add Medication
          </Button>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          {
            title: "Total Meds",
            value: medications.length,
            color: "from-blue-500 to-cyan-500",
          },
          {
            title: "Active",
            value: medications.filter((m) => m.status === "ACTIVE").length,
            color: "from-green-500 to-emerald-500",
          },
          {
            title: "Completed",
            value: medications.filter((m) => m.status === "COMPLETED").length,
            color: "from-purple-500 to-indigo-500",
          },
          {
            title: "With Alerts",
            value: medications.filter((m) => m.reminderEnabled).length,
            color: "from-amber-500 to-orange-500",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-r ${stat.color} text-white p-4 rounded-xl shadow-md`}
          >
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm opacity-90">{stat.title}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Sorting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50"
      >
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All Medications" },
            { key: "active", label: "Active" },
            { key: "completed", label: "Completed" },
            { key: "discontinued", label: "Discontinued" },
          ].map((btn) => (
            <motion.button
              key={btn.key}
              onClick={() => setFilter(btn.key as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                filter === btn.key
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            className="bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "name" | "date" | "status")
            }
          >
            <option value="date">Start Date</option>
            <option value="name">Medication Name</option>
            <option value="status">Status</option>
          </select>
        </div>
      </motion.div>

      {/* Medications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {sortedMedications.map((medication, index) => (
            <motion.div
              key={medication.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="glass-card p-6 hover:shadow-xl transition-all duration-300 border-0 relative overflow-hidden">
                {/* Status accent bar */}
                <div
                  className={`h-2 bg-gradient-to-r ${getStatusColor(
                    medication.status
                  )} absolute top-0 left-0 right-0`}
                />

                {/* Medication Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl"
                    >
                      {getRouteIcon(medication.route)}
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {medication.medicationName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {medication.dosage}mg
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    className={`${getStatusColor(
                      medication.status
                    )} text-white flex items-center gap-1`}
                  >
                    {getStatusIcon(medication.status)}
                    {medication.status}
                  </Badge>
                  {medication.reminderEnabled && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Bell className="w-4 h-4 text-amber-500" />
                    </motion.div>
                  )}
                </div>

                {/* Medication Details */}
                <div className="space-y-3">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${getFrequencyColor(
                      medication.frequency
                    )}/10`}
                  >
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {medication.frequency}
                    </span>
                  </div>

                  {medication.reason && (
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-purple-500 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Purpose
                        </p>
                        <p className="text-sm text-gray-800">
                          {medication.reason}
                        </p>
                      </div>
                    </div>
                  )}

                  {medication.prescribedBy && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Prescribed by
                        </p>
                        <p className="text-sm text-gray-800">
                          {medication.prescribedBy}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Started
                      </p>
                      <p className="text-sm text-gray-800">
                        {new Date(medication.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {medication.instructions && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-blue-800 mb-1">
                        Instructions
                      </p>
                      <p className="text-sm text-blue-700">
                        {medication.instructions}
                      </p>
                    </div>
                  )}
                </div>

                {/* Floating elements */}
                {medication.status === "ACTIVE" && (
                  <motion.div
                    className="absolute top-4 right-4"
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {sortedMedications.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50"
        >
          <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No medications found
          </h3>
          <p className="text-gray-500">
            Try changing your filters or add new medications
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
