import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard = ({ children, className = "", onClick }: GlassCardProps) => (
  <motion.div
    whileHover={{
      scale: 1.02,
      y: -4,
      boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.15)",
    }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`relative backdrop-blur-2xl bg-gradient-to-br from-white/40 via-blue-50/30 to-indigo-50/20 
                border border-blue-200/40 rounded-3xl shadow-xl hover:shadow-2xl 
                transition-all duration-500 cursor-pointer hover:border-blue-300/50 
                overflow-hidden group ${className}`}
    onClick={onClick}
  >
    {/* Animated border glow */}
    <motion.div
      className="absolute inset-0 rounded-3xl border-2 border-blue-300/20 opacity-0 group-hover:opacity-100"
      animate={{
        borderColor: [
          "rgba(59, 130, 246, 0.2)",
          "rgba(147, 197, 253, 0.4)",
          "rgba(59, 130, 246, 0.2)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    {/* Background shimmer effect */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
      animate={{
        x: ["-100%", "100%"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    {/* Main content */}
    <div className="relative z-10">{children}</div>
  </motion.div>
);

export default GlassCard;
