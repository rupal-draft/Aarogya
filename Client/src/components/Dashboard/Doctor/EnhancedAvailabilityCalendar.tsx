import {
  AlertCircle,
  BookOpen,
  CalendarCheck,
  CheckCircle,
  Clock,
  Info,
  Star,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import type { DayAvailability } from "../../../types/doctorDashboard";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const EnhancedAvailabilityCalendar = ({
  days,
}: {
  days: DayAvailability[];
}) => {
  const [selectedDay, setSelectedDay] = useState<DayAvailability | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-gradient-to-br from-green-100 to-green-200 border-green-300 text-green-800 shadow-sm hover:shadow-md";
      case "UNAVAILABLE":
        return "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-500 shadow-sm hover:shadow-md";
      case "OVERRIDDEN":
        return "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800 shadow-sm hover:shadow-md";
      case "SPECIAL":
        return "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 text-blue-800 shadow-sm hover:shadow-md";
      default:
        return "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-500 shadow-sm hover:shadow-md";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return <CheckCircle className="w-4 h-4" />;
      case "UNAVAILABLE":
        return <XCircle className="w-4 h-4" />;
      case "OVERRIDDEN":
        return <Clock className="w-4 h-4" />;
      case "SPECIAL":
        return <Star className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleDayClick = (day: DayAvailability) => {
    setSelectedDay(selectedDay?.date === day.date ? null : day);
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.02, type: "spring" }}
            whileHover={{ scale: 1.05, z: 10 }}
            onClick={() => handleDayClick(day)}
            className={`p-2 rounded-lg border text-center text-xs cursor-pointer ${getStatusColor(
              day.status
            )} relative overflow-hidden group ${
              selectedDay?.date === day.date
                ? "ring-2 ring-blue-400 ring-offset-2"
                : ""
            }`}
          >
            {/* Hover effect */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="font-medium mb-1">
              {new Date(day.date).getDate()}
            </div>
            <div className="flex justify-center mb-1">
              {getStatusIcon(day.status)}
            </div>

            {/* Slot information */}
            {day.bookedSlots > 0 && (
              <div className="mt-1 text-xs font-semibold bg-white/50 rounded-full px-1 py-0.5">
                {day.bookedSlots}/{day.totalSlots}
              </div>
            )}

            {/* Free slots indicator */}
            {day.freeSlots > 0 && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></div>
            )}

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
              {day.note || "No notes"}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-800 rotate-45" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected day details */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-blue-500" />
                  {new Date(selectedDay.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center justify-center p-2 bg-white rounded-lg shadow-xs border">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      selectedDay.isAvailable ? "bg-green-400" : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="text-sm font-medium">
                    {selectedDay.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>

                <div className="flex items-center justify-center p-2 bg-white rounded-lg shadow-xs border">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="text-sm font-medium">
                    Total: {selectedDay.totalSlots} slots
                  </span>
                </div>

                <div className="flex items-center justify-center p-2 bg-white rounded-lg shadow-xs border">
                  <BookOpen className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-sm font-medium">
                    Booked: {selectedDay.bookedSlots} slots
                  </span>
                </div>

                <div className="flex items-center justify-center p-2 bg-white rounded-lg shadow-xs border">
                  <Zap className="w-4 h-4 mr-2 text-amber-500" />
                  <span className="text-sm font-medium">
                    Free: {selectedDay.freeSlots} slots
                  </span>
                </div>
              </div>

              {selectedDay.note && (
                <div className="p-3 bg-white rounded-lg border">
                  <div className="flex items-start">
                    <Info className="w-4 h-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      {selectedDay.note}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
