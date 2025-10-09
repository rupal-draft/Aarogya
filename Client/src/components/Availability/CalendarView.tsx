import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  UserCheck,
  Ban,
  Star,
  X,
  Clock,
  User,
  Zap,
  Info,
} from "lucide-react";
import type {
  AvailabilityRangeResponse,
  SpecialAvailabilityResponse,
  CalendarDay,
} from "../../types/availability";
import { AvailabilityStatus } from "../../Data/enums/availability";

interface CalendarViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
  availabilityRange: AvailabilityRangeResponse | null;
  specialAvailabilities: SpecialAvailabilityResponse[];
  onAvailabilityUpdate: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  onDateChange,
  selectedDate,
  onDateSelect,
  availabilityRange,
  specialAvailabilities,
}) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [showSpecialAvailabilityModal, setShowSpecialAvailabilityModal] =
    useState(false);
  const [selectedSpecialAvailability, setSelectedSpecialAvailability] =
    useState<SpecialAvailabilityResponse | null>(null);

  const getCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      // Find availability for this date
      const availability = availabilityRange?.availabilities.find(
        (a) => new Date(a.date).toDateString() === date.toDateString()
      );

      // Check for special availability
      const specialAvailability = specialAvailabilities.find(
        (sa) => new Date(sa.date).toDateString() === date.toDateString()
      );

      const calendarDay: CalendarDay = {
        date,
        isCurrentMonth,
        isToday,
        isSelected,
        availability,
        hasSpecialAvailability: !!specialAvailability,
        hasOverride: false, // You can implement override checking here
      };

      days.push(calendarDay);
    }

    return days;
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
        return AlertCircle;
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    onDateChange(newDate);
  };

  const handleSpecialAvailabilityClick = (day: CalendarDay) => {
    if (day.hasSpecialAvailability) {
      // Find the special availability for this date
      const specialAvailability = specialAvailabilities.find(
        (sa) => new Date(sa.date).toDateString() === day.date.toDateString()
      );
      if (specialAvailability) {
        setSelectedSpecialAvailability(specialAvailability);
        setShowSpecialAvailabilityModal(true);
      }
    }
  };

  const calendarDays = getCalendarDays();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            <h2 className="text-xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateChange(new Date())}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
            >
              Today
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          <AnimatePresence>
            {calendarDays.map((day, index) => {
              const StatusIcon = day.availability
                ? getStatusIcon(day.availability.status)
                : AlertCircle;
              const statusColor = day.availability
                ? getStatusColor(day.availability.status)
                : "gray";

              // Find special availability for this day
              const specialAvailability = specialAvailabilities.find(
                (sa) =>
                  new Date(sa.date).toDateString() === day.date.toDateString()
              );

              return (
                <motion.div
                  key={`${day.date.getTime()}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.01 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (day.hasSpecialAvailability) {
                      handleSpecialAvailabilityClick(day);
                    } else {
                      onDateSelect(day.date);
                    }
                  }}
                  onMouseEnter={() => setHoveredDate(day.date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={`
                    relative aspect-square p-2 rounded-lg cursor-pointer transition-all
                    ${
                      day.isCurrentMonth
                        ? day.hasSpecialAvailability
                          ? "bg-gradient-to-br from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100"
                          : "bg-white hover:bg-blue-50"
                        : "bg-gray-50 text-gray-400"
                    }
                    ${day.isToday ? "ring-2 ring-blue-500" : ""}
                    ${day.isSelected ? "bg-blue-100 ring-2 ring-blue-400" : ""}
                    ${
                      day.availability
                        ? `border-l-4 border-${statusColor}-400`
                        : day.hasSpecialAvailability
                        ? "border-l-4 border-yellow-400"
                        : ""
                    }
                    hover:shadow-lg
                    ${day.hasSpecialAvailability ? "group" : ""}
                  `}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium ${
                          day.isToday ? "text-blue-600" : ""
                        } ${
                          day.hasSpecialAvailability ? "text-orange-700" : ""
                        }`}
                      >
                        {day.date.getDate()}
                      </span>
                      {day.hasSpecialAvailability && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="relative"
                        >
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <div className="absolute inset-0 animate-ping">
                            <Star className="w-4 h-4 text-yellow-400 fill-current opacity-75" />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {day.availability && (
                      <div className="flex-1 flex flex-col justify-center items-center">
                        <StatusIcon
                          className={`w-4 h-4 text-${statusColor}-500 mb-1`}
                        />
                        <div className="text-xs text-center">
                          <div
                            className={`text-${statusColor}-600 font-medium`}
                          >
                            {day.availability.totalAvailableSlots}
                          </div>
                          <div className="text-gray-500">slots</div>
                        </div>
                      </div>
                    )}

                    {day.hasSpecialAvailability && !day.availability && (
                      <div className="flex-1 flex flex-col justify-center items-center">
                        <Zap className="w-4 h-4 text-yellow-500 mb-1" />
                        <div className="text-xs text-center text-yellow-600 font-medium">
                          Special Hours
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Special Availability Badge */}
                  {day.hasSpecialAvailability && (
                    <div className="absolute top-1 right-1">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-yellow-400 rounded-full"
                      />
                    </div>
                  )}

                  {/* Hover Tooltip */}
                  <AnimatePresence>
                    {hoveredDate?.getTime() === day.date.getTime() && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg min-w-max"
                      >
                        <div className="font-medium mb-1">
                          {day.date.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        {day.hasSpecialAvailability ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-yellow-300">
                              <Star className="w-3 h-3 fill-current" />
                              <span>Special Availability</span>
                            </div>
                            {specialAvailability?.title && (
                              <div className="text-yellow-100 text-xs">
                                {specialAvailability.title}
                              </div>
                            )}
                            <div className="text-yellow-100 text-xs">
                              Click to view details
                            </div>
                          </div>
                        ) : day.availability ? (
                          <div className="space-y-1">
                            <div>
                              Status:{" "}
                              {day.availability.status.replace("_", " ")}
                            </div>
                            <div>
                              Available: {day.availability.totalAvailableSlots}
                            </div>
                            <div>
                              Booked: {day.availability.totalBookedSlots}
                            </div>
                            {day.availability.reasonForUnavailability && (
                              <div>
                                Reason:{" "}
                                {day.availability.reasonForUnavailability}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>No availability data</div>
                        )}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Selected Date Details */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-blue-100 p-6 bg-blue-50/50"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>

            {(() => {
              const dayAvailability = availabilityRange?.availabilities.find(
                (a) =>
                  new Date(a.date).toDateString() ===
                  selectedDate.toDateString()
              );

              if (!dayAvailability) {
                return (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No availability data for this date</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayAvailability.timeSlots.map((slot, index) => {
                    const SlotIcon = getStatusIcon(slot.status);
                    const slotColor = getStatusColor(slot.status);

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 bg-white rounded-lg border border-${slotColor}-200 hover:shadow-lg transition-all`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <SlotIcon
                              className={`w-4 h-4 text-${slotColor}-500`}
                            />
                            <span className="font-medium text-gray-900">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium bg-${slotColor}-100 text-${slotColor}-700 rounded-full`}
                          >
                            {slot.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
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
                          <div className="mt-2 text-xs text-gray-600">
                            <span className="font-medium">Reason:</span>{" "}
                            {slot.reasonForUnavailability}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="border-t border-blue-100 p-4 bg-gray-50/50">
        <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
          {[
            {
              status: AvailabilityStatus.AVAILABLE,
              label: "Available",
              color: "green",
            },
            {
              status: AvailabilityStatus.PARTIALLY_AVAILABLE,
              label: "Partially Available",
              color: "yellow",
            },
            {
              status: AvailabilityStatus.FULLY_BOOKED,
              label: "Fully Booked",
              color: "orange",
            },
            {
              status: AvailabilityStatus.UNAVAILABLE,
              label: "Unavailable",
              color: "red",
            },
          ].map(({ status, label, color }) => {
            const Icon = getStatusIcon(status);
            return (
              <div key={status} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 text-${color}-500`} />
                <span className="text-gray-600">{label}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-gray-600">Special Availability</span>
          </div>
        </div>
      </div>

      {/* Special Availability Modal */}
      <AnimatePresence>
        {showSpecialAvailabilityModal && selectedSpecialAvailability && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSpecialAvailabilityModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-white to-yellow-50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-yellow-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-yellow-500 to-orange-600 p-6">
                <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      className="p-2 bg-white/20 rounded-xl backdrop-blur-sm"
                    >
                      <Star className="w-6 h-6 text-white fill-current" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Special Availability
                      </h2>
                      <p className="text-yellow-100">
                        Extended consultation hours
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSpecialAvailabilityModal(false)}
                    className="p-2 text-white/80 hover:text-white transition-colors relative z-10"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  {/* Date and Status */}
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {new Date(
                            selectedSpecialAvailability.date
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-yellow-700">
                          Special consultation day
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedSpecialAvailability.isAvailable
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {selectedSpecialAvailability.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedSpecialAvailability.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedSpecialAvailability.description}
                      </p>
                    </div>

                    {selectedSpecialAvailability.reason && (
                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-blue-900 mb-1">
                            Additional Information
                          </p>
                          <p className="text-blue-700 text-sm">
                            {selectedSpecialAvailability.reason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Custom Slots */}
                  {selectedSpecialAvailability.customSlots &&
                    selectedSpecialAvailability.customSlots.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <Clock className="w-5 h-5 text-orange-500" />
                          Custom Time Slots
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedSpecialAvailability.customSlots.map(
                            (slot, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-white rounded-xl border border-orange-200 hover:shadow-lg transition-all"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                    <span className="font-medium text-gray-900">
                                      {slot.startTime} - {slot.endTime}
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="flex items-center gap-1">
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">
                                      Duration:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      {
                                        selectedSpecialAvailability.customSlotDuration
                                      }{" "}
                                      min
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">
                                      Max Patients:
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      {
                                        selectedSpecialAvailability.customMaxPatients
                                      }
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Status Information */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          selectedSpecialAvailability.isActive
                            ? "bg-green-500 animate-pulse"
                            : "bg-gray-400"
                        }`}
                      />
                      <span className="text-sm text-gray-600">
                        {selectedSpecialAvailability.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>
                    <div className="w-px h-4 bg-gray-300" />
                    <div className="text-sm text-gray-600">
                      Created:{" "}
                      {new Date(
                        selectedSpecialAvailability.createdAt
                      ).toLocaleDateString()}
                    </div>
                    <div className="w-px h-4 bg-gray-300" />
                    <div className="text-sm text-gray-600">
                      Updated:{" "}
                      {new Date(
                        selectedSpecialAvailability.updatedAt
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-yellow-200 bg-yellow-50/50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSpecialAvailabilityModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarView;
