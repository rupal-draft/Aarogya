import React from "react";
import { motion } from "framer-motion";
import {
  TestTube,
  Clock,
  DollarSign,
  Info,
  Plus,
  AlertCircle,
  Timer,
} from "lucide-react";
import type { LabTestResponse } from "../../types/labV2";

interface TestCardProps {
  test: LabTestResponse;
  index: number;
  onAssign?: (testId: string) => void;
}

export const TestCard: React.FC<TestCardProps> = ({
  test,
  index,
  onAssign,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        type: "spring",
        stiffness: 120,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.15)",
      }}
      className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
            className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
          >
            <TestTube className="text-blue-600" size={20} />
          </motion.div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{test.testName}</h3>
            <p className="text-sm text-gray-600">Code: {test.testCode}</p>
          </div>
        </div>

        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {test.category}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-2">
        {test.description}
      </p>

      {/* Key Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className="text-green-600" />
            <span className="text-xs text-green-600 font-medium">Price</span>
          </div>
          <p className="font-bold text-green-900">
            {formatCurrency(test.price)}
          </p>
        </div>

        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TestTube size={14} className="text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Sample</span>
          </div>
          <p className="font-bold text-purple-900">{test.sampleType}</p>
        </div>
      </div>

      {/* Timing Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock size={14} className="text-blue-500" />
          <span className="text-gray-600">Preparation Time:</span>
          <span className="font-semibold text-gray-900">
            {test.preparationTimeHours}h
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Timer size={14} className="text-orange-500" />
          <span className="text-gray-600">Result Time:</span>
          <span className="font-semibold text-gray-900">
            {test.resultTimeHours}h
          </span>
        </div>
      </div>

      {/* Preparation Instructions */}
      {test.preparationInstructions && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} className="text-amber-500" />
            <span className="text-xs font-medium text-amber-700">
              Preparation Instructions
            </span>
          </div>
          <p className="text-xs text-gray-700 bg-amber-50 p-2 rounded border-l-4 border-amber-400">
            {test.preparationInstructions}
          </p>
        </div>
      )}

      {/* Normal Ranges */}
      {test.normalRanges.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-blue-500" />
            <span className="text-xs font-medium text-blue-700">
              Normal Ranges
            </span>
          </div>
          <div className="space-y-1">
            {test.normalRanges.map((range, rangeIndex) => (
              <span
                key={rangeIndex}
                className="inline-block bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
              >
                {range}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          <p>Updated: {formatDate(test.updatedAt)}</p>
        </div>

        {onAssign && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAssign(test.id)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Assign Test
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
