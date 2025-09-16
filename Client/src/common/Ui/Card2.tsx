import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-white border border-slate-200 shadow-sm",
      glass: "bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl",
      elevated: "bg-white shadow-2xl border border-slate-100",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-300 hover:shadow-lg",
          variants[variant],
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        {...props}
      >
        <div className="relative overflow-hidden rounded-2xl">{children}</div>
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export default Card;
