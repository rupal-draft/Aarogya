"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";
import { AnimatedCounter } from "../../../common/Counter/AnimatedCounter";

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  subtitle,
  animateValue = false,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: { value: number; isPositive: boolean };
  subtitle?: string;
  animateValue?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className={`p-6 rounded-2xl shadow-lg ${color} text-white relative overflow-hidden group`}
  >
    {/* Animated background elements */}
    <motion.div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0],
      }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <div className="absolute -inset-10 bg-gradient-to-r from-white/10 to-transparent transform -skew-x-12" />
    </motion.div>

    <div className="absolute top-4 right-4 opacity-20">
      <Icon className="w-12 h-12" />
    </div>

    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"
        >
          <Icon className="w-6 h-6" />
        </motion.div>
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold">
            {animateValue && typeof value === "number" ? (
              <AnimatedCounter value={value} />
            ) : (
              value
            )}
          </p>
          {subtitle && <p className="text-sm opacity-80 mt-1">{subtitle}</p>}
        </div>

        {trend && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`flex items-center gap-1 text-sm ${
              trend.isPositive ? "text-green-200" : "text-red-200"
            }`}
          >
            {trend.isPositive ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            {trend.value}%
          </motion.div>
        )}
      </div>
    </div>

    {/* Floating particles */}
    {[1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-white/30 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: i * 0.5,
        }}
        style={{
          left: `${20 + i * 20}%`,
          bottom: "10%",
        }}
      />
    ))}
  </motion.div>
);
