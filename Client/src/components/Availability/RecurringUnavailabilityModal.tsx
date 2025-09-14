import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  RefreshCw,
  Calendar,
  Clock,
  Save,
  AlertTriangle,
} from "lucide-react";
import type {
  RecurringUnavailabilityRequest,
  RecurrencePatternRequest,
  TimeRangeRequest,
} from "../../types/availability";
import { DayOfWeek, RecurrenceType } from "../../Data/enums/availability";
import { availabilityService } from "../../Services/availabilityService";

interface RecurringUnavailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RecurringUnavailabilityModal: React.FC<
  RecurringUnavailabilityModalProps
> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<RecurringUnavailabilityRequest>({
    title: "",
    description: "",
    recurrencePattern: {
      type: RecurrenceType.WEEKLY,
      interval: 1,
      daysOfWeek: [],
      startDate: new Date().toISOString().split("T")[0],
    },
    timeRange: {
      startTime: "09:00",
      endTime: "17:00",
    },
    isAllDay: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof RecurringUnavailabilityRequest,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRecurrenceChange = (
    field: keyof RecurrencePatternRequest,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      recurrencePattern: {
        ...prev.recurrencePattern,
        [field]: value,
      },
    }));
  };

  const handleTimeRangeChange = (
    field: keyof TimeRangeRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      timeRange: {
        ...prev.timeRange,
        [field]: value,
      },
    }));
  };

  const handleDayOfWeekToggle = (day: DayOfWeek) => {
    const currentDays = formData.recurrencePattern.daysOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];

    handleRecurrenceChange("daysOfWeek", newDays);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await availabilityService.createRecurringUnavailability(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating recurring unavailability:", error);
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

  const dayNames = {
    [DayOfWeek.MONDAY]: "Monday",
    [DayOfWeek.TUESDAY]: "Tuesday",
    [DayOfWeek.WEDNESDAY]: "Wednesday",
    [DayOfWeek.THURSDAY]: "Thursday",
    [DayOfWeek.FRIDAY]: "Friday",
    [DayOfWeek.SATURDAY]: "Saturday",
    [DayOfWeek.SUNDAY]: "Sunday",
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Recurring Unavailability</h2>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g., Weekly Conference, Lunch Break"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                rows={3}
                placeholder="Optional description..."
              />
            </div>

            {/* All Day Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isAllDay"
                checked={formData.isAllDay}
                onChange={(e) =>
                  handleInputChange("isAllDay", e.target.checked)
                }
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label
                htmlFor="isAllDay"
                className="text-sm font-medium text-gray-700"
              >
                All Day
              </label>
            </div>

            {/* Time Range */}
            {!formData.isAllDay && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.timeRange.startTime}
                    onChange={(e) =>
                      handleTimeRangeChange("startTime", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.timeRange.endTime}
                    onChange={(e) =>
                      handleTimeRangeChange("endTime", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </motion.div>
            )}

            {/* Recurrence Pattern */}
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recurrence Pattern
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recurrence Type
                  </label>
                  <select
                    value={formData.recurrencePattern.type}
                    onChange={(e) =>
                      handleRecurrenceChange(
                        "type",
                        e.target.value as RecurrenceType
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value={RecurrenceType.DAILY}>Daily</option>
                    <option value={RecurrenceType.WEEKLY}>Weekly</option>
                    <option value={RecurrenceType.MONTHLY}>Monthly</option>
                    <option value={RecurrenceType.YEARLY}>Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interval
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.recurrencePattern.interval}
                    onChange={(e) =>
                      handleRecurrenceChange(
                        "interval",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Days of Week (for Weekly recurrence) */}
              {formData.recurrencePattern.type === RecurrenceType.WEEKLY && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days of Week
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {Object.entries(dayNames).map(([dayKey, dayName]) => {
                      const day = dayKey as DayOfWeek;
                      const isSelected =
                        formData.recurrencePattern.daysOfWeek?.includes(day);
                      return (
                        <motion.button
                          key={day}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDayOfWeekToggle(day)}
                          className={`p-2 text-sm font-medium rounded-lg transition-all ${
                            isSelected
                              ? "bg-purple-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {dayName.slice(0, 3)}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Day of Month (for Monthly recurrence) */}
              {formData.recurrencePattern.type === RecurrenceType.MONTHLY && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day of Month
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.recurrencePattern.dayOfMonth || 1}
                    onChange={(e) =>
                      handleRecurrenceChange(
                        "dayOfMonth",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.recurrencePattern.startDate}
                    onChange={(e) =>
                      handleRecurrenceChange("startDate", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.recurrencePattern.endDate || ""}
                    onChange={(e) =>
                      handleRecurrenceChange(
                        "endDate",
                        e.target.value || undefined
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Occurrence Count */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Occurrences (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.recurrencePattern.occurrenceCount || ""}
                  onChange={(e) =>
                    handleRecurrenceChange(
                      "occurrenceCount",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Leave empty for indefinite"
                />
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Important Note</p>
                  <p>
                    This will create recurring unavailability periods that will
                    block appointments during the specified times. Make sure the
                    pattern and timing are correct before saving.
                  </p>
                </div>
              </div>
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
              disabled={isSubmitting || !formData.title.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
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
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Recurring Unavailability
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default RecurringUnavailabilityModal;
