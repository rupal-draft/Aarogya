import { motion } from "framer-motion";
import { Pill } from "lucide-react";
import GlassCard from "../../../../common/Cards/GlassCard";

const MedicationCard = ({ medication }: { medication: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.25 } }}
    whileTap={{ scale: 0.98 }}
  >
    <GlassCard className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 rounded-2xl shadow-md hover:shadow-lg transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
            className="p-3 bg-emerald-100 rounded-xl shadow-sm"
          >
            <Pill className="w-5 h-5 text-emerald-600" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg tracking-tight">
              {medication.medicationName}
            </h3>
            <p className="text-sm text-gray-700 italic">{medication.dosage}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <motion.div
        className="space-y-3 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex justify-between">
          <span className="text-gray-600">💊 Frequency:</span>
          <span className="font-medium text-emerald-700">
            {medication.frequency}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">👨‍⚕️ Prescribed by:</span>
          <span className="font-medium text-emerald-700">
            {medication.prescribedBy}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">📅 Started:</span>
          <span className="font-medium text-emerald-700">
            {new Date(medication.startDate).toLocaleDateString()}
          </span>
        </div>
      </motion.div>
    </GlassCard>
  </motion.div>
);

export default MedicationCard;
