import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
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
            layoutId={`textarea-label-${props.id}`}
          >
            {label}
          </motion.label>
        )}
        <div className="relative">
          <motion.textarea
            ref={ref}
            className={cn(
              "w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-slate-200 rounded-xl resize-none",
              "focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none",
              "transition-all duration-300 hover:border-blue-300 hover:shadow-lg",
              "placeholder:text-slate-400 text-slate-700",
              "shadow-sm hover:shadow-md focus:shadow-xl",
              error && "border-red-400 focus:border-red-500 focus:ring-red-100",
              className
            )}
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
            {...props}
          />
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-blue-400/20 opacity-0 group-focus-within:opacity-100 pointer-events-none"
            layoutId={`textarea-glow-${props.id}`}
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

Textarea.displayName = "Textarea";

export default Textarea;
