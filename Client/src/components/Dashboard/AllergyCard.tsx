import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, XCircle } from "lucide-react";

const iconMap: Record<string, any> = {
  "exclamation-triangle": AlertTriangle,
  "alert-circle": AlertCircle,
  "times-circle": XCircle,
};

const AllergyCard = ({ allergy }: { allergy: any }) => {
  const Icon = iconMap[allergy.severityIcon] || AlertCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative rounded-2xl shadow-md border border-sky-200 p-6 
                 bg-gradient-to-br from-sky-50 via-white to-sky-100"
    >
      {/* Top section */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="p-3 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${allergy.severityColor}20` }}
          >
            <Icon
              className="w-6 h-6"
              style={{ color: allergy.severityColor }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 leading-snug">
              {allergy.allergen}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              Diagnosed:{" "}
              <span className="font-medium text-gray-800">
                {new Date(allergy.diagnosedDate).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>

        {/* Severity Badge */}
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase shadow-sm"
          style={{
            backgroundColor: `${allergy.severityColor}25`,
            color: allergy.severityColor,
          }}
        >
          {allergy.severity}
        </motion.span>
      </div>

      {/* Symptoms */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-4"
      >
        <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
          Symptoms
        </p>
        <p className="text-sm text-gray-800 leading-relaxed">
          {allergy.formattedSymptoms}
        </p>
      </motion.div>

      {/* Emergency Action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
          Emergency Action
        </p>
        <p className="text-sm text-gray-800 leading-relaxed">
          {allergy.emergencyAction}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AllergyCard;
