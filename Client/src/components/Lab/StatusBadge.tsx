import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import type { LabResultParameter } from "../../types/labV2";

interface StatusBadgeProps {
  status: LabResultParameter["status"];
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "NORMAL":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle,
          text: "Normal",
        };
      case "HIGH":
        return {
          color: "bg-orange-100 text-orange-800 border-orange-200",
          icon: TrendingUp,
          text: "High",
        };
      case "LOW":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: TrendingUp,
          text: "Low",
        };
      case "CRITICAL":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: AlertTriangle,
          text: "Critical",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: XCircle,
          text: "Unknown",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${config.color} ${className}`}
    >
      <Icon size={12} />
      {config.text}
    </motion.span>
  );
};
