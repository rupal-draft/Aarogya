import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Ban,
  Calendar,
  Search,
  RefreshCw,
} from "lucide-react";
import type {
  AvailabilityResponse,
  SlotAvailabilityRequest,
  SlotAvailabilityResponse,
} from "../../types/availability";
import { AvailabilityStatus } from "../../Data/enums/availability";
import { availabilityService } from "../../Services/availabilityService";

interface SlotManagerProps {
  selectedDate: Date;
  onSlotUpdate: () => void;
}

const SlotManager: React.FC<SlotManagerProps> = ({
  selectedDate,
  onSlotUpdate,
}) => {
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [checkingSlot, setCheckingSlot] = useState<string | null>(null);
  const [slotCheckResults, setSlotCheckResults] = useState<
    Record<string, SlotAvailabilityResponse>
  >({});
  const [appointmentId, setAppointmentId] = useState("");
  const [updatingSlot, setUpdatingSlot] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailability();
  }, [selectedDate]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const dateString = selectedDate.toISOString().split("T")[0];
      const data = await availabilityService.getAvailability(dateString);
      setAvailability(data);
    } catch (error) {
      console.error("Error fetching availability:", error);
      setAvailability(null);
    } finally {
      setLoading(false);
    }
  };

  const checkSlotAvailability = async (startTime: string, endTime: string) => {
    const slotKey = `${startTime}-${endTime}`;
    setCheckingSlot(slotKey);

    try {
      const request: SlotAvailabilityRequest = {
        date: selectedDate.toISOString().split("T")[0],
        startTime,
        endTime,
      };

      const result = await availabilityService.checkSlotAvailability(request);
      setSlotCheckResults((prev) => ({ ...prev, [slotKey]: result }));
    } catch (error) {
      console.error("Error checking slot availability:", error);
    } finally {
      setCheckingSlot(null);
    }
  };

  const updateSlotBooking = async (startTime: string, delta: number) => {
    if (!appointmentId.trim()) {
      alert("Please enter an appointment ID");
      return;
    }

    const slotKey = startTime;
    setUpdatingSlot(slotKey);

    try {
      await availabilityService.updateSlotBooking(
        appointmentId,
        selectedDate.toISOString().split("T")[0],
        startTime,
        delta
      );

      await fetchAvailability();
      onSlotUpdate();
      setAppointmentId("");
    } catch (error) {
      console.error("Error updating slot booking:", error);
      alert("Error updating slot booking. Please try again.");
    } finally {
      setUpdatingSlot(null);
    }
  };

  const getStatusColor = (status: AvailabilityStatus) => {
    switch (status) {
      case AvailabilityStatus.AVAILABLE:
        return "green";
      case AvailabilityStatus.PARTIALLY_AVAILABLE:
        return "yellow";
      case AvailabilityStatus.FULLY_BOOKED:
        return "orange";
      case AvailabilityStatus.UNAVAILABLE:
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: AvailabilityStatus) => {
    switch (status) {
      case AvailabilityStatus.AVAILABLE:
        return CheckCircle;
      case AvailabilityStatus.PARTIALLY_AVAILABLE:
        return UserCheck;
      case AvailabilityStatus.FULLY_BOOKED:
        return Users;
      case AvailabilityStatus.UNAVAILABLE:
        return Ban;
      default:
        return AlertTriangle;
    }
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6">
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Slot Management
              </h2>
              <p className="text-sm text-gray-600">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAvailability}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>

        {/* Appointment ID Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appointment ID (for booking updates)
          </label>
          <input
            type="text"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter appointment ID..."
          />
        </div>
      </div>

      {/* Availability Overview */}
      {availability && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Availability Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Status
                </span>
              </div>
              <div
                className={`text-lg font-bold text-${getStatusColor(
                  availability.status
                )}-600`}
              >
                {availability.status.replace("_", " ")}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  Available Slots
                </span>
              </div>
              <div className="text-lg font-bold text-green-600">
                {availability.totalAvailableSlots}
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">
                  Booked Slots
                </span>
              </div>
              <div className="text-lg font-bold text-orange-600">
                {availability.totalBookedSlots}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">
                  Slot Duration
                </span>
              </div>
              <div className="text-lg font-bold text-purple-600">
                {availability.slotDurationMinutes}m
              </div>
            </div>
          </div>

          {availability.reasonForUnavailability && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-900">
                  Unavailability Reason
                </span>
              </div>
              <p className="text-red-700 mt-1">
                {availability.reasonForUnavailability}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Time Slots */}
      {availability && availability.timeSlots.length > 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Time Slots
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {availability.timeSlots.map((slot, index) => {
                const StatusIcon = getStatusIcon(slot.status);
                const statusColor = getStatusColor(slot.status);
                const slotKey = `${slot.startTime}-${slot.endTime}`;
                const checkResult = slotCheckResults[slotKey];
                const isChecking = checkingSlot === slotKey;
                const isUpdating = updatingSlot === slot.startTime;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border border-${statusColor}-200 bg-${statusColor}-50 hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon
                          className={`w-4 h-4 text-${statusColor}-600`}
                        />
                        <span className="font-medium text-gray-900">
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium bg-${statusColor}-200 text-${statusColor}-800 rounded-full`}
                      >
                        {slot.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Available:</span>
                        <span className="ml-1 font-medium">
                          {slot.availableSlots}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Booked:</span>
                        <span className="ml-1 font-medium">
                          {slot.bookedCount}
                        </span>
                      </div>
                    </div>

                    {slot.reasonForUnavailability && (
                      <div className="text-xs text-gray-600 mb-3">
                        <span className="font-medium">Reason:</span>{" "}
                        {slot.reasonForUnavailability}
                      </div>
                    )}

                    {/* Slot Actions */}
                    <div className="flex flex-col gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          checkSlotAvailability(slot.startTime, slot.endTime)
                        }
                        disabled={isChecking}
                        className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-colors text-sm flex items-center justify-center gap-2"
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
                              className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full"
                            />
                            Checking...
                          </>
                        ) : (
                          <>
                            <Search className="w-3 h-3" />
                            Check Availability
                          </>
                        )}
                      </motion.button>

                      {slot.isAvailable && appointmentId && (
                        <div className="flex gap-1">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateSlotBooking(slot.startTime, 1)}
                            disabled={isUpdating}
                            className="flex-1 px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50 transition-colors text-xs"
                          >
                            {isUpdating ? "..." : "+1"}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              updateSlotBooking(slot.startTime, -1)
                            }
                            disabled={isUpdating || slot.bookedCount === 0}
                            className="flex-1 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 transition-colors text-xs"
                          >
                            {isUpdating ? "..." : "-1"}
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Check Results */}
                    {checkResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 p-2 bg-white rounded border text-xs"
                      >
                        <div className="font-medium mb-1">Check Result:</div>
                        <div className="space-y-1">
                          <div>
                            Available: {checkResult.isAvailable ? "Yes" : "No"}
                          </div>
                          <div>
                            Available Slots: {checkResult.availableSlots}
                          </div>
                          <div>Booked Slots: {checkResult.bookedSlots}</div>
                          {checkResult.reasonIfUnavailable && (
                            <div>Reason: {checkResult.reasonIfUnavailable}</div>
                          )}
                          {checkResult.nextAvailableSlot && (
                            <div>
                              Next Available:{" "}
                              {new Date(
                                checkResult.nextAvailableSlot
                              ).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-6">
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Availability Data
            </h3>
            <p className="text-gray-600">
              {availability === null
                ? "No availability has been set for this date."
                : "No time slots are configured for this date."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotManager;
