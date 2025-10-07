// components/Patient-Management/HealthGoalsCard.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Calendar,
  AlertCircle,
  Eye,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Loader2,
  TrendingUp,
} from "lucide-react";
import type { HealthGoal } from "../../types/patientManagement";
import type {
  CreateHealthGoalRequest,
  UpdateHealthGoalRequest,
} from "../../types/patientDashboard";
import { healthGoalsService } from "../../Services/Patient/healthGoalsService";

interface HealthGoalsCardProps {
  goals: HealthGoal[];
  onViewAll?: () => void;
  totalCount?: number;
  onDataUpdate?: () => void;
  patientId?: string;
}

export const HealthGoalsCard: React.FC<HealthGoalsCardProps> = ({
  goals,
  onViewAll,
  totalCount = 0,
  onDataUpdate,
  patientId,
}) => {
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreateHealthGoalRequest>>(
    {}
  );
  const [progressUpdate, setProgressUpdate] = useState<{
    [key: string]: number;
  }>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const showViewAll = totalCount > 3;

  const safeValue = (val: any, fallback: string = "N/A") =>
    val !== undefined && val !== null ? val : fallback;

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "not started":
        return "bg-gray-100 text-gray-800";
      case "on hold":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate progress and days remaining
  const calculateGoalMetrics = (goal: HealthGoal) => {
    const progress =
      goal.targetValue > 0
        ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
        : 0;

    const daysLeft = goal.targetDate
      ? Math.ceil(
          (new Date(goal.targetDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    return { progress, daysLeft };
  };

  // Start editing a goal
  const startEdit = (goal: HealthGoal) => {
    setEditingGoal(goal.id);
    setFormData({
      goalType: goal.goalType,
      title: goal.title,
      description: goal.description,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      unit: goal.unit,
      targetDate: goal.targetDate,
      priority: goal.priority as "HIGH" | "MEDIUM" | "LOW",
      notes: "",
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingGoal(null);
    setFormData({});
  };

  // Start adding new goal
  const startAdd = () => {
    setIsAdding(true);
    setFormData({
      goalType: "fitness",
      title: "",
      description: "",
      targetValue: 0,
      currentValue: 0,
      unit: "",
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 days from now
      priority: "MEDIUM",
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

  // Handle progress update input
  const handleProgressChange = (goalId: string, value: number) => {
    setProgressUpdate((prev) => ({
      ...prev,
      [goalId]: value,
    }));
  };

  // Save goal (create or update)
  const saveGoal = async () => {
    if (!formData.goalType || !formData.description || !formData.targetDate) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(editingGoal || "new");

    try {
      if (editingGoal) {
        // Update existing goal
        const updateRequest: UpdateHealthGoalRequest = {
          goalType: formData.goalType,
          title: formData.title,
          description: formData.description,
          targetValue: formData.targetValue,
          currentValue: formData.currentValue,
          unit: formData.unit,
          targetDate: formData.targetDate,
          priority: formData.priority,
          notes: formData.notes,
        };

        await healthGoalsService.updateHealthGoal(editingGoal, updateRequest);
      } else {
        // Create new goal
        const createRequest: CreateHealthGoalRequest = {
          goalType: formData.goalType!,
          title: formData.title,
          description: formData.description!,
          targetValue: formData.targetValue!,
          currentValue: formData.currentValue,
          unit: formData.unit,
          targetDate: formData.targetDate!,
          priority: formData.priority,
          notes: formData.notes,
        };

        await healthGoalsService.createHealthGoal(createRequest);
      }

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      // Reset form
      setEditingGoal(null);
      setIsAdding(false);
      setFormData({});
    } catch (error) {
      console.error("Error saving health goal:", error);
      alert("Error saving health goal. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Delete goal
  const deleteGoal = async (goalId: string) => {
    setLoading(goalId);

    try {
      await healthGoalsService.deleteHealthGoal(goalId);

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting health goal:", error);
      alert("Error deleting health goal. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Update progress
  const updateProgress = async (goalId: string, currentValue: number) => {
    setLoading(`${goalId}-progress`);

    try {
      await healthGoalsService.updateProgress(goalId, currentValue);

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      setProgressUpdate((prev) => ({ ...prev, [goalId]: undefined }));
    } catch (error) {
      console.error("Error updating progress:", error);
      alert("Error updating progress. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Add to progress
  const addToProgress = async (goalId: string, increment: number) => {
    setLoading(`${goalId}-add`);

    try {
      await healthGoalsService.addToProgress(goalId, increment);

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error("Error adding to progress:", error);
      alert("Error adding to progress. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Update status
  const updateStatus = async (goalId: string, status: string) => {
    setLoading(`${goalId}-status`);

    try {
      await healthGoalsService.updateStatus(goalId, status);

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Quick progress actions
  const quickProgressActions = [
    { label: "+10%", value: 0.1 },
    { label: "+25%", value: 0.25 },
    { label: "+50%", value: 0.5 },
    { label: "Complete", value: 1 },
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-500" />
          Health Goals
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
            Add Goal
          </motion.button>
        </div>
      </div>

      {/* Add New Goal Form */}
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
                Add New Health Goal
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
                  Goal Type *
                </label>
                <select
                  value={formData.goalType || ""}
                  onChange={(e) =>
                    handleInputChange("goalType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="fitness">Fitness</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="weight">Weight Management</option>
                  <option value="mental">Mental Health</option>
                  <option value="medication">Medication Adherence</option>
                  <option value="screening">Health Screening</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority || ""}
                  onChange={(e) =>
                    handleInputChange("priority", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Goal title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={formData.targetDate || ""}
                    onChange={(e) =>
                      handleInputChange("targetDate", e.target.value)
                    }
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Value
                </label>
                <input
                  type="number"
                  value={formData.targetValue || 0}
                  onChange={(e) =>
                    handleInputChange("targetValue", parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Target value"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.unit || ""}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., kg, steps, minutes"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your health goal..."
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Progress
                  </label>
                  <input
                    type="number"
                    value={formData.currentValue || 0}
                    onChange={(e) =>
                      handleInputChange(
                        "currentValue",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>
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
                  onClick={saveGoal}
                  disabled={loading === "new"}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {loading === "new" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Add Goal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {goals.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-gray-500">
            No health goals found. Click "Add Goal" to create one.
          </div>
        ) : (
          goals.map((goal, index) => {
            const { progress, daysLeft } = calculateGoalMetrics(goal);
            const currentProgressUpdate =
              progressUpdate[goal.id] !== undefined
                ? progressUpdate[goal.id]
                : goal.currentValue;

            return (
              <motion.div
                key={goal.id}
                className={`rounded-xl p-4 border-2 ${getPriorityColor(
                  goal.priority
                )}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              >
                {editingGoal === goal.id ? (
                  // Edit Form
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-blue-900">
                        Edit Goal
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
                          Title
                        </label>
                        <input
                          type="text"
                          value={formData.title || ""}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Priority
                        </label>
                        <select
                          value={formData.priority || ""}
                          onChange={(e) =>
                            handleInputChange("priority", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={loading === goal.id}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveGoal}
                        disabled={loading === goal.id}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                      >
                        {loading === goal.id ? (
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {safeValue(goal.title) || safeValue(goal.description)}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {safeValue(goal.description)}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {safeValue(goal.goalType)}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              goal.status
                            )}`}
                          >
                            {safeValue(goal.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {goal.priority === "High" && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          </motion.div>
                        )}

                        <div className="flex gap-1">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => startEdit(goal)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit Goal"
                          >
                            <Edit3 className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowDeleteConfirm(goal.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete Goal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>
                          Progress: {safeValue(goal.currentValue)} /{" "}
                          {safeValue(goal.targetValue)} {safeValue(goal.unit)}
                        </span>
                        <span className="font-semibold">
                          {progress.toFixed(1)}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
                        <motion.div
                          className={`h-full ${getProgressColor(
                            progress
                          )} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>

                      {/* Progress Update Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="number"
                            value={currentProgressUpdate}
                            onChange={(e) =>
                              handleProgressChange(
                                goal.id,
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max={goal.targetValue}
                          />
                          <span className="text-sm text-gray-600">
                            / {goal.targetValue}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            updateProgress(goal.id, currentProgressUpdate)
                          }
                          disabled={loading === `${goal.id}-progress`}
                          className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                          {loading === `${goal.id}-progress` ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <TrendingUp className="w-3 h-3" />
                          )}
                          Update
                        </button>
                      </div>

                      {/* Quick Progress Actions */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {quickProgressActions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() =>
                              addToProgress(
                                goal.id,
                                goal.targetValue * action.value
                              )
                            }
                            disabled={loading === `${goal.id}-add`}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 disabled:opacity-50 transition-colors"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        Target:{" "}
                        {goal.targetDate
                          ? new Date(goal.targetDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            daysLeft > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {daysLeft > 0
                            ? `${daysLeft} days left`
                            : goal.targetDate
                            ? "Overdue"
                            : "No target date"}
                        </span>

                        {/* Status Quick Update */}
                        <select
                          value={goal.status}
                          onChange={(e) =>
                            updateStatus(goal.id, e.target.value)
                          }
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading === `${goal.id}-status`}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                  {showDeleteConfirm === goal.id && (
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
                          Delete Health Goal
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Are you sure you want to delete the goal{" "}
                          <strong>"{goal.title || goal.description}"</strong>?
                          This action cannot be undone.
                        </p>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={loading === goal.id}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            disabled={loading === goal.id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                          >
                            {loading === goal.id ? (
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
            );
          })
        )}
      </div>
    </motion.div>
  );
};
