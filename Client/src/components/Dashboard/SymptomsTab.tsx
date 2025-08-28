"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./../../common/Ui/Card2";
import { Badge } from "./../../common/Ui/Badge2";
import Button from "./../../common/Ui/Button";
import { Input } from "./../../common/Ui/input";
import { Label } from "./../../common/Ui/label";
import { Textarea } from "./../../common/Ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./../../common/Ui/Select";
import {
  Brain,
  Activity,
  AlertTriangle,
  Clock,
  Calendar,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  X,
  Zap,
  Heart,
} from "lucide-react";

interface Symptom {
  id: string;
  patientId: string;
  symptomName: string;
  category: string;
  severityLevel: number;
  description: string;
  triggers: string[];
  duration: string;
  frequency: string;
  associatedSymptoms: string[];
  notes: string;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  formattedRecordedAt: string;
  severityText: string;
  severityBadgeColor: string;
  categoryBadgeColor: string;
  timeAgo: string;
  recent: boolean;
  severe: boolean;
}

interface SymptomSummary {
  avgSeverity: number;
  symptomName: string;
  count: number;
}

interface SymptomsData {
  symptomSummaries: SymptomSummary[];
  recentSymptoms: Symptom[];
  totalSymptoms: number;
  generatedAt: string;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "neurological":
      return Brain;
    case "respiratory":
      return Activity;
    case "gastrointestinal":
      return Heart;
    case "general":
      return Zap;
    default:
      return AlertTriangle;
  }
};

const getSeverityColor = (severity: number) => {
  if (severity >= 8) return "from-red-500 to-red-700";
  if (severity >= 6) return "from-orange-500 to-orange-700";
  if (severity >= 4) return "from-yellow-500 to-yellow-700";
  return "from-green-500 to-green-700";
};

const getSeverityBadgeColor = (severity: number) => {
  if (severity >= 8) return "bg-red-500/20 text-red-300 border-red-500/30";
  if (severity >= 6)
    return "bg-orange-500/20 text-orange-300 border-orange-500/30";
  if (severity >= 4)
    return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  return "bg-green-500/20 text-green-300 border-green-500/30";
};

const getCategoryBadgeColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "neurological":
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    case "respiratory":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "gastrointestinal":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "general":
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
};

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-30"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

export default function SymptomsTab({ data }: SymptomsData) {
  const [symptomsData] = useState<SymptomsData>(data);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null);

  const handleAddSymptom = () => {
    setShowAddForm(true);
  };

  const handleEditSymptom = (symptom: Symptom) => {
    setEditingSymptom(symptom);
    setShowAddForm(true);
  };

  const handleDeleteSymptom = (symptomId: string) => {
    // Implementation for delete
    console.log("Delete symptom:", symptomId);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingSymptom(null);
  };

  return (
    <div className="space-y-8 p-6 relative">
      <FloatingParticles />

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30"
            >
              <Brain className="w-8 h-8 text-emerald-400" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Symptoms Tracker
              </h2>
              <p className="text-gray-400 mt-1">
                Monitor and manage your symptoms
              </p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleAddSymptom}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Symptom
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {symptomsData.symptomSummaries.map((summary, index) => {
          const IconComponent = getCategoryIcon(summary.symptomName);
          return (
            <motion.div
              key={summary.symptomName}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                z: 50,
              }}
              className="relative group"
            >
              <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Animated border glow */}
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  animate={{
                    boxShadow: [
                      "0 0 0 1px rgba(16, 185, 129, 0)",
                      "0 0 0 1px rgba(16, 185, 129, 0.3)",
                      "0 0 0 1px rgba(16, 185, 129, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />

                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.2,
                      }}
                      className={`p-3 rounded-xl bg-gradient-to-br ${getSeverityColor(
                        summary.avgSeverity
                      )}/20 backdrop-blur-sm`}
                    >
                      <IconComponent
                        className={`w-6 h-6 text-gradient-to-r ${getSeverityColor(
                          summary.avgSeverity
                        )
                          .replace("from-", "from-")
                          .replace("to-", "to-")
                          .replace("-500", "-400")
                          .replace("-700", "-400")}`}
                      />
                    </motion.div>
                    <Badge
                      className={`${getSeverityBadgeColor(
                        summary.avgSeverity
                      )} border`}
                    >
                      {summary.avgSeverity}/10
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                    {summary.symptomName}
                  </h3>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Occurrences</span>
                    <motion.span
                      className="font-bold text-emerald-400"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.3,
                      }}
                    >
                      {summary.count}
                    </motion.span>
                  </div>

                  {/* Severity bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${getSeverityColor(
                          summary.avgSeverity
                        )} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(summary.avgSeverity / 10) * 100}%`,
                        }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Symptoms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl border border-gray-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5" />

          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Activity className="w-7 h-7 text-emerald-400" />
              </motion.div>
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Recent Symptoms
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="space-y-4">
              {symptomsData.recentSymptoms.map((symptom, index) => {
                const IconComponent = getCategoryIcon(symptom.category);
                return (
                  <motion.div
                    key={symptom.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.02,
                      x: 10,
                      transition: { duration: 0.2 },
                    }}
                    className="group relative"
                  >
                    <Card className="bg-gradient-to-r from-gray-800/30 to-gray-700/30 backdrop-blur-sm border border-gray-600/30 hover:border-emerald-500/50 transition-all duration-300 relative overflow-hidden">
                      {/* Animated background glow */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />

                      <CardContent className="p-6 relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <motion.div
                              whileHover={{ rotate: 15, scale: 1.1 }}
                              className={`p-3 rounded-xl bg-gradient-to-br ${getSeverityColor(
                                symptom.severityLevel
                              )}/20 backdrop-blur-sm flex-shrink-0`}
                            >
                              <IconComponent className="w-6 h-6 text-emerald-400" />
                            </motion.div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-white text-lg group-hover:text-emerald-400 transition-colors duration-300">
                                  {symptom.symptomName}
                                </h3>
                                <Badge
                                  className={`${getCategoryBadgeColor(
                                    symptom.category
                                  )} border text-xs`}
                                >
                                  {symptom.category}
                                </Badge>
                                <Badge
                                  className={`${getSeverityBadgeColor(
                                    symptom.severityLevel
                                  )} border text-xs`}
                                >
                                  {symptom.severityLevel}/10
                                </Badge>
                              </div>

                              <p className="text-gray-300 mb-3 leading-relaxed">
                                {symptom.description}
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-emerald-400" />
                                  <span className="text-sm text-gray-400">
                                    Duration:
                                  </span>
                                  <span className="text-sm text-white">
                                    {symptom.duration}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                                  <span className="text-sm text-gray-400">
                                    Frequency:
                                  </span>
                                  <span className="text-sm text-white">
                                    {symptom.frequency}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-4 h-4 text-emerald-400" />
                                  <span className="text-sm text-gray-400">
                                    Recorded:
                                  </span>
                                  <span className="text-sm text-white">
                                    {symptom.timeAgo}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <AlertTriangle className="w-4 h-4 text-emerald-400" />
                                  <span className="text-sm text-gray-400">
                                    Triggers:
                                  </span>
                                  <span className="text-sm text-white">
                                    {symptom.triggers.join(", ")}
                                  </span>
                                </div>
                              </div>

                              {symptom.associatedSymptoms.length > 0 && (
                                <div className="mb-3">
                                  <span className="text-sm text-gray-400 mb-2 block">
                                    Associated Symptoms:
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {symptom.associatedSymptoms.map(
                                      (assocSymptom, idx) => (
                                        <Badge
                                          key={idx}
                                          className="bg-gray-700/50 text-gray-300 border-gray-600/50 text-xs"
                                        >
                                          {assocSymptom}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {symptom.notes && (
                                <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                                  <span className="text-sm text-gray-400 block mb-1">
                                    Notes:
                                  </span>
                                  <p className="text-sm text-gray-300">
                                    {symptom.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEditSymptom(symptom)}
                              className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteSymptom(symptom.id)}
                              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add/Edit Symptom Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-2xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    {editingSymptom ? "Edit Symptom" : "Add New Symptom"}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCloseForm}
                    className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="symptomName"
                        className="text-white mb-2 block"
                      >
                        Symptom Name
                      </Label>
                      <Input
                        id="symptomName"
                        placeholder="Enter symptom name"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                        defaultValue={editingSymptom?.symptomName || ""}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="category"
                        className="text-white mb-2 block"
                      >
                        Category
                      </Label>
                      <Select defaultValue={editingSymptom?.category || ""}>
                        <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="neurological">
                            Neurological
                          </SelectItem>
                          <SelectItem value="respiratory">
                            Respiratory
                          </SelectItem>
                          <SelectItem value="gastrointestinal">
                            Gastrointestinal
                          </SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="description"
                      className="text-white mb-2 block"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the symptom in detail"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500 min-h-[100px]"
                      defaultValue={editingSymptom?.description || ""}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label
                        htmlFor="severity"
                        className="text-white mb-2 block"
                      >
                        Severity (1-10)
                      </Label>
                      <Input
                        id="severity"
                        type="number"
                        min="1"
                        max="10"
                        placeholder="1-10"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                        defaultValue={editingSymptom?.severityLevel || ""}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="duration"
                        className="text-white mb-2 block"
                      >
                        Duration
                      </Label>
                      <Input
                        id="duration"
                        placeholder="e.g., 2 hours"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                        defaultValue={editingSymptom?.duration || ""}
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="frequency"
                        className="text-white mb-2 block"
                      >
                        Frequency
                      </Label>
                      <Input
                        id="frequency"
                        placeholder="e.g., Daily"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                        defaultValue={editingSymptom?.frequency || ""}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="triggers" className="text-white mb-2 block">
                      Triggers (comma-separated)
                    </Label>
                    <Input
                      id="triggers"
                      placeholder="e.g., Stress, Cold weather"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                      defaultValue={editingSymptom?.triggers.join(", ") || ""}
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="associatedSymptoms"
                      className="text-white mb-2 block"
                    >
                      Associated Symptoms (comma-separated)
                    </Label>
                    <Input
                      id="associatedSymptoms"
                      placeholder="e.g., Nausea, Dizziness"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                      defaultValue={
                        editingSymptom?.associatedSymptoms.join(", ") || ""
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-white mb-2 block">
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional observations or notes"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
                      defaultValue={editingSymptom?.notes || ""}
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseForm}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      Cancel
                    </Button>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-emerald-500/25"
                      >
                        {editingSymptom ? "Update Symptom" : "Add Symptom"}
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
