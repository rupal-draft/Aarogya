import { motion } from "framer-motion";

const GlassCard = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className={`backdrop-blur-xl bg-gradient-to-br from-white/30 via-sky-100/40 to-blue-100/30 border border-sky-200/50 rounded-3xl shadow-2xl hover:shadow-sky-500/25 transition-all duration-500 cursor-pointer hover:border-sky-300/60 ${className}`}
    onClick={onClick}
  >
    <motion.div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-transparent to-blue-500/10 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

export default GlassCard;
