import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <motion.div
        className="relative group"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {label && (
          <motion.label
            className="block text-sm font-semibold text-slate-700 mb-2 group-focus-within:text-blue-600 transition-colors duration-300"
            layoutId={`label-${props.id}`}
          >
            {label}
          </motion.label>
        )}
        <div className="relative">
          {icon && (
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {icon}
            </motion.div>
          )}
          <motion.input
            ref={ref}
            className={cn(
              "w-full px-4 py-3 pl-10 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl",
              "focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none",
              "transition-all duration-300 hover:border-blue-300 hover:shadow-lg",
              "placeholder:text-slate-400 text-slate-700",
              "shadow-sm hover:shadow-md focus:shadow-xl",
              error && "border-red-400 focus:border-red-500 focus:ring-red-100",
              className
            )}
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            {...props}
          />
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 opacity-0 group-focus-within:opacity-100 pointer-events-none"
            layoutId={`input-glow-${props.id}`}
            transition={{ duration: 0.3 }}
          />
        </div>
        {error && (
          <motion.p
            className="mt-2 text-sm text-red-600"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

Input.displayName = "Input";
