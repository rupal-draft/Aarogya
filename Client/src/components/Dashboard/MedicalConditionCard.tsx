import GlassCard from "../../common/Cards/GlassCard";
import { motion } from "framer-motion";

const MedicalConditionCard = ({ condition }: { condition: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    whileHover={{ scale: 1.03, y: -4 }}
    whileTap={{ scale: 0.98 }}
  >
    <GlassCard
      className="p-6 bg-gradient-to-br from-sky-50 via-white to-sky-100 
                 rounded-2xl shadow-md hover:shadow-lg transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <h3 className="font-semibold text-gray-900 text-lg leading-snug">
          {condition.conditionName}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm
            ${
              condition.severity === "High"
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                : condition.severity === "Medium"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                : "bg-gradient-to-r from-green-500 to-green-600 text-white"
            }`}
        >
          {condition.severity}
        </span>
      </div>

      {/* Notes */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-700 text-sm mb-4 leading-relaxed"
      >
        {condition.notes}
      </motion.p>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span className="font-medium">
          Diagnosed:{" "}
          <span className="text-gray-800">
            {new Date(condition.diagnosisDate).toLocaleDateString()}
          </span>
        </span>
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm
            ${
              condition.status === "Active"
                ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
                : "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
            }`}
        >
          {condition.status}
        </motion.span>
      </div>
    </GlassCard>
  </motion.div>
);

export default MedicalConditionCard;
