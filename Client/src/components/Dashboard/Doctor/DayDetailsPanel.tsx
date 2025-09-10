import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { DayAvailability } from "../../../types/doctorDashboard";
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Users,
  XCircle,
  Zap,
} from "lucide-react";

export const DayDetailsPanel = ({ days }: { days: DayAvailability[] }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="mt-6 border rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 bg-gradient-to-r from-gray-50 to-blue-50 flex justify-between items-center hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
      >
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Detailed Day Information
        </h3>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500"
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white max-h-96 overflow-y-auto">
              {days.map((day, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-3 text-sm bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        day.status === "AVAILABLE"
                          ? "bg-green-100 text-green-800"
                          : day.status === "UNAVAILABLE"
                          ? "bg-gray-100 text-gray-800"
                          : day.status === "OVERRIDDEN"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {day.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <BookOpen className="w-3 h-3 mr-1 text-green-500" />
                      <span>{day.bookedSlots} booked</span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="w-3 h-3 mr-1 text-amber-500" />
                      <span>{day.freeSlots} free</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1 text-blue-500" />
                      <span>{day.totalSlots} total</span>
                    </div>
                    <div className="flex items-center">
                      {day.isAvailable ? (
                        <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1 text-red-500" />
                      )}
                      <span>
                        {day.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>
                  </div>

                  {day.note && (
                    <div className="mt-2 flex items-start pt-2 border-t border-gray-100">
                      <Info className="w-3 h-3 mr-1 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-xs">{day.note}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
