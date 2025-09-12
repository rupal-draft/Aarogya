import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { CounterAnimation } from "../../common/Counter/CounterAnimation";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  index: number;
  prefix?: string;
  suffix?: string;
  subtitle?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  index,
  prefix = "",
  suffix = "",
  subtitle,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${color} p-6 rounded-xl shadow-lg text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-2">{title}</p>
          <div className="text-3xl font-bold">
            <CounterAnimation
              value={value}
              prefix={prefix}
              suffix={suffix}
              duration={1.5}
            />
          </div>
          {subtitle && <p className="text-sm opacity-75 mt-1">{subtitle}</p>}
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
        >
          <Icon size={24} />
        </motion.div>
      </div>
    </motion.div>
  );
};
