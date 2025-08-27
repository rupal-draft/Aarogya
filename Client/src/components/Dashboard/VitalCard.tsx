"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface VitalCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  unit: string;
  color: string;
}

const VitalCard = ({
  icon: Icon,
  label,
  value,
  unit,
  color,
}: VitalCardProps) => {
  return (
    <motion.div
      className="group relative overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`p-6 rounded-3xl shadow-2xl backdrop-blur-xl bg-white/20 border border-white/30 
          hover:shadow-3xl transition-all duration-500 relative overflow-hidden ${color}`}
        whileHover={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* Animated background effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
          animate={{
            opacity: [0, 0.3, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              animate={{
                x: [0, 30, 0],
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <motion.div
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Icon className="w-8 h-8 text-white drop-shadow-lg" />
            </motion.div>
          </motion.div>

          <motion.h3
            className="text-sm font-semibold text-white/90 mb-2 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {label}
          </motion.h3>

          <motion.div
            className="flex items-baseline gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <motion.span
              className="text-3xl font-black text-white drop-shadow-lg"
              animate={{
                textShadow: [
                  "0 0 0px rgba(255, 255, 255, 0)",
                  "0 0 10px rgba(255, 255, 255, 0.3)",
                  "0 0 0px rgba(255, 255, 255, 0)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {value}
            </motion.span>
            <span className="text-sm font-medium text-white/80">{unit}</span>
          </motion.div>
        </div>

        {/* Hover effect overlay */}
        <motion.div
          className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default VitalCard;
