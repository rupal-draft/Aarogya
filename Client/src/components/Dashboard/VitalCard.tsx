import { TrendingUp } from "lucide-react";
import GlassCard from "../../common/Cards/GlassCard";
import { motion } from "framer-motion";

const VitalCard = ({
  icon: Icon,
  label,
  value,
  unit,
  color,
  trend,
}: {
  icon: any;
  label: string;
  value: number | string;
  unit: string;
  color: string;
  trend?: "up" | "down" | "stable";
}) => (
  <GlassCard className="p-6 text-center group bg-white/40 backdrop-blur-md rounded-2xl shadow-md">
    <motion.div
      className={`p-4 rounded-2xl w-fit mx-auto mb-4 shadow-md group-hover:shadow-lg transition-all duration-300 ${color}`}
      whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      <Icon className="w-7 h-7 text-white" />
    </motion.div>

    <h3 className="text-sm font-medium text-gray-700 mb-2 tracking-wide">
      {label}
    </h3>

    <div className="flex items-center justify-center gap-2">
      <motion.span
        className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {value}
      </motion.span>
      <span className="text-sm text-sky-600">{unit}</span>

      {trend && (
        <TrendingUp
          className={`w-4 h-4 ${
            trend === "up"
              ? "text-emerald-500"
              : trend === "down"
              ? "text-rose-500"
              : "text-sky-400"
          }`}
        />
      )}
    </div>
  </GlassCard>
);

export default VitalCard;
