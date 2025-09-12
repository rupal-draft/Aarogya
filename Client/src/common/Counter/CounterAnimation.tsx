import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CounterAnimationProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const CounterAnimation: React.FC<CounterAnimationProps> = ({
  value,
  duration = 2,
  className = "",
  prefix = "",
  suffix = "",
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;
    const endValue = value;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      const current = startValue + (endValue - startValue) * progress;
      setCurrentValue(Math.floor(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      {currentValue}
      {suffix}
    </motion.span>
  );
};
