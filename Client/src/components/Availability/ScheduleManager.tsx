import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  Plus,
  Trash2,
  Save,
  Settings,
  X,
  Timer,
  Users,
  AlertCircle,
} from "lucide-react";
import type {
  ScheduleResponse,
  ScheduleRequest,
  DailyScheduleRequest,
  TimeRangeRequest,
  RecurringUnavailabilityResponse,
} from "../../types/availability";
import { availabilityService } from "../../Services/availabilityService";

interface ScheduleManagerProps {
  schedule: ScheduleResponse | null;
  onScheduleUpdate: () => void;
  recurringUnavailabilities: RecurringUnavailabilityResponse[];
  onRecurringUpdate: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  schedule,
  onScheduleUpdate,
  recurringUnavailabilities,
  onRecurringUpdate,
  isModal = false,
  onClose,
}) => {
  const [formData, setFormData] = useState<ScheduleRequest>(() => {
    if (schedule) {
      return {
        weeklySchedule: schedule.weeklySchedule,
        defaultSlotDurationMinutes: schedule.defaultSlotDurationMinutes,
        defaultMaxPatientsPerSlot: schedule.defaultMaxPatientsPerSlot,
        bookingLeadTimeHours: schedule.bookingLeadTimeHours,
        maxBookingDaysInAdvance: schedule.maxBookingDaysInAdvance,
        minCancellationNoticeHours: schedule.minCancellationNoticeHours,
      } as ScheduleRequest;
    }

    return {
      weeklySchedule: {
        MONDAY: {
          isAvailable: true,
          availableSlots: [],
          slotDurationMinutes: 30,
          maxPatientsPerSlot: 1,
        },
        TUESDAY: {
          isAvailable: true,
          availableSlots: [],
          slotDurationMinutes: 30,
          maxPatientsPerSlot: 1,
        },
        WEDNESDAY: {
          isAvailable: true,
          availableSlots: [],
          slotDurationMinutes: 30,
          maxPatientsPerSlot: 1,
        },
        THURSDAY: {
          isAvailable: true,
          availableSlots: [],
          slotDurationMinutes: 30,
          maxPatientsPerSlot: 1,
        },
        FRIDAY: {
          isAvailable: true,
          availableSlots: [],
          slotDurationMinutes: 30,
          maxPatientsPerSlot: 1,
        },
        SATURDAY: {
          isAvailable: false,
          availableSlots: [],
          slotDurationMinutes: 30,
          maxPatientsPerSlot: 1,
        },
        SUNDAY: {
          isAvailable: false,
          availableSlots: [],
          slotDurationMinutes: 30,
          maxPatientsPerSlot: 1,
        },
      },
      defaultSlotDurationMinutes: 30,
      defaultMaxPatientsPerSlot: 1,
      bookingLeadTimeHours: 24,
      maxBookingDaysInAdvance: 30,
      minCancellationNoticeHours: 24,
    } as ScheduleRequest;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const dayNames = {
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
    SUNDAY: "Sunday",
  };

  const handleGlobalSettingChange = (
    field: keyof ScheduleRequest,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDayScheduleChange = (
    day: string,
    field: keyof DailyScheduleRequest,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          [field]: value,
        },
      },
    }));
  };

  const addTimeSlot = (day: string) => {
    const newSlot: TimeRangeRequest = {
      startTime: "09:00",
      endTime: "10:00",
    };

    setFormData((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          availableSlots: [...prev.weeklySchedule[day].availableSlots, newSlot],
        },
      },
    }));
  };

  const updateTimeSlot = (
    day: string,
    index: number,
    field: keyof TimeRangeRequest,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          availableSlots: prev.weeklySchedule[day].availableSlots.map(
            (slot, i) => (i === index ? { ...slot, [field]: value } : slot)
          ),
        },
      },
    }));
  };

  const removeTimeSlot = (day: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      weeklySchedule: {
        ...prev.weeklySchedule,
        [day]: {
          ...prev.weeklySchedule[day],
          availableSlots: prev.weeklySchedule[day].availableSlots.filter(
            (_, i) => i !== index
          ),
        },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await availabilityService.updateSchedule(formData);
      onScheduleUpdate();
      if (isModal && onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Global Settings */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Global Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Timer className="w-4 h-4 inline mr-1" />
              Default Slot Duration (minutes)
            </label>
            <select
              value={formData.defaultSlotDurationMinutes}
              onChange={(e) =>
                handleGlobalSettingChange(
                  "defaultSlotDurationMinutes",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Max Patients per Slot
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.defaultMaxPatientsPerSlot}
              onChange={(e) =>
                handleGlobalSettingChange(
                  "defaultMaxPatientsPerSlot",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Booking Lead Time (hours)
            </label>
            <input
              type="number"
              min="1"
              value={formData.bookingLeadTimeHours}
              onChange={(e) =>
                handleGlobalSettingChange(
                  "bookingLeadTimeHours",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Booking Days in Advance
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={formData.maxBookingDaysInAdvance}
              onChange={(e) =>
                handleGlobalSettingChange(
                  "maxBookingDaysInAdvance",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Cancellation Notice (hours)
            </label>
            <input
              type="number"
              min="1"
              value={formData.minCancellationNoticeHours}
              onChange={(e) =>
                handleGlobalSettingChange(
                  "minCancellationNoticeHours",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Weekly Schedule
        </h3>
        <div className="space-y-4">
          {Object.entries(dayNames).map(([dayKey, dayName]) => {
            const daySchedule = formData.weeklySchedule[dayKey];
            return (
              <motion.div
                key={dayKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    {dayName}
                  </h4>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={daySchedule?.isAvailable}
                        onChange={(e) =>
                          handleDayScheduleChange(
                            dayKey,
                            "isAvailable",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Available</span>
                    </label>
                    {daySchedule?.isAvailable && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addTimeSlot(dayKey)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        <Plus className="w-3 h-3" />
                        Add Slot
                      </motion.button>
                    )}
                  </div>
                </div>

                {!daySchedule?.isAvailable && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Unavailability
                    </label>
                    <input
                      type="text"
                      value={daySchedule?.reasonForUnavailability || ""}
                      onChange={(e) =>
                        handleDayScheduleChange(
                          dayKey,
                          "reasonForUnavailability",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Day off, Conference, etc."
                    />
                  </div>
                )}

                {daySchedule?.isAvailable && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slot Duration (minutes)
                        </label>
                        <select
                          value={daySchedule.slotDurationMinutes}
                          onChange={(e) =>
                            handleDayScheduleChange(
                              dayKey,
                              "slotDurationMinutes",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={45}>45 minutes</option>
                          <option value={60}>1 hour</option>
                          <option value={90}>1.5 hours</option>
                          <option value={120}>2 hours</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Patients per Slot
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={daySchedule.maxPatientsPerSlot}
                          onChange={(e) =>
                            handleDayScheduleChange(
                              dayKey,
                              "maxPatientsPerSlot",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence>
                        {daySchedule?.availableSlots?.map((slot, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) =>
                                  updateTimeSlot(
                                    dayKey,
                                    index,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <span className="text-gray-500">to</span>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) =>
                                  updateTimeSlot(
                                    dayKey,
                                    index,
                                    "endTime",
                                    e.target.value
                                  )
                                }
                                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeTimeSlot(dayKey, index)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {daySchedule?.availableSlots?.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">
                          No time slots configured for {dayName}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recurring Unavailabilities */}
      {recurringUnavailabilities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recurring Unavailabilities
          </h3>
          <div className="space-y-3">
            {recurringUnavailabilities.map((unavailability) => (
              <div
                key={unavailability.id}
                className="bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-red-900">
                      {unavailability.title}
                    </h4>
                    {unavailability.description && (
                      <p className="text-sm text-red-700 mt-1">
                        {unavailability.description}
                      </p>
                    )}
                    <div className="text-sm text-red-600 mt-2">
                      <span>
                        Pattern: {unavailability.recurrencePattern.type}
                      </span>
                      {unavailability.recurrencePattern.daysOfWeek.length >
                        0 && (
                        <span className="ml-2">
                          Days:{" "}
                          {unavailability.recurrencePattern.daysOfWeek.join(
                            ", "
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      unavailability.isActive
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {unavailability.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Schedule Settings</h2>
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

          {/* Content */}
          <form
            onSubmit={handleSubmit}
            className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]"
          >
            {content}

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
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
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
                    <Save className="w-4 h-4" />
                    Update Schedule
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  }
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6">
      <form onSubmit={handleSubmit}>
        {content}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 mt-8">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update Schedule
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleManager;
