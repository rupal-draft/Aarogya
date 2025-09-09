import { AlertCircle, CheckCircle, Clock, Star } from "lucide-react";
import type { DayAvailability } from "../../../types/doctorDashboard";
import { motion } from "framer-motion";

export const EnhancedAvailabilityCalendar = ({
  days,
}: {
  days: DayAvailability[];
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-gradient-to-br from-green-100 to-green-200 border-green-300 text-green-800";
      case "UNAVAILABLE":
        return "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-500";
      case "OVERRIDDEN":
        return "bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300 text-yellow-800";
      case "SPECIAL":
        return "bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300 text-blue-800";
      default:
        return "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return <CheckCircle className="w-3 h-3" />;
      case "UNAVAILABLE":
        return <AlertCircle className="w-3 h-3" />;
      case "OVERRIDDEN":
        return <Clock className="w-3 h-3" />;
      case "SPECIAL":
        return <Star className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.02, type: "spring" }}
          whileHover={{ scale: 1.05, z: 10 }}
          className={`p-2 rounded-lg border text-center text-xs ${getStatusColor(
            day.status
          )} relative overflow-hidden group`}
        >
          {/* Hover effect */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="font-medium">{new Date(day.date).getDate()}</div>
          <div className="flex justify-center mt-1">
            {getStatusIcon(day.status)}
          </div>
          {day.bookedSlots > 0 && (
            <div className="mt-1 text-xs font-semibold">
              {day.bookedSlots}/{day.totalSlots}
            </div>
          )}

          {/* Tooltip on hover */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
            {day.note}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-800 rotate-45" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
