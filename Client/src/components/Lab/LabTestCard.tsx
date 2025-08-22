"use client";

import { motion } from "framer-motion";
import {
  TestTube,
  Clock,
  DollarSign,
  Info,
  Plus,
  Minus,
  Star,
  Shield,
  Zap,
} from "lucide-react";
import type { LabTestResponse } from "../../types/lab";

interface LabTestCardProps {
  test: LabTestResponse;
  isSelected: boolean;
  onToggleSelect: (test: LabTestResponse) => void;
  index: number;
}

const LabTestCard: React.FC<LabTestCardProps> = ({
  test,
  isSelected,
  onToggleSelect,
  index,
}) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      Blood: "from-red-500 to-pink-500",
      Urine: "from-yellow-500 to-orange-500",
      Cardiac: "from-blue-500 to-cyan-500",
      Liver: "from-green-500 to-emerald-500",
      Kidney: "from-purple-500 to-violet-500",
      Thyroid: "from-indigo-500 to-blue-500",
      Diabetes: "from-orange-500 to-red-500",
      Lipid: "from-pink-500 to-rose-500",
    };
    return (
      colors[category as keyof typeof colors] || "from-gray-500 to-slate-500"
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      Blood: TestTube,
      Cardiac: Star,
      Liver: Shield,
      Kidney: Zap,
      Thyroid: TestTube,
      Diabetes: TestTube,
      Lipid: TestTube,
      Urine: TestTube,
    };
    const IconComponent = icons[category as keyof typeof icons] || TestTube;
    return IconComponent;
  };

  const CategoryIcon = getCategoryIcon(test.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative group cursor-pointer transition-all duration-300 ${
        isSelected ? "ring-4 ring-blue-500 ring-opacity-50" : "hover:shadow-2xl"
      }`}
      onClick={() => onToggleSelect(test)}
    >
      {/* Background Image */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <img
          src={`https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg`}
          alt={test.testName}
          className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-gray-50/95" />
      </div>

      {/* Floating Sparkles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3 + i,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className={`absolute w-2 h-2 bg-gradient-to-r ${getCategoryColor(
            test.category
          )} rounded-full opacity-60`}
          style={{
            top: `${20 + i * 25}%`,
            right: `${10 + i * 15}%`,
          }}
        />
      ))}

      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div
          className={`relative p-6 bg-gradient-to-r ${getCategoryColor(
            test.category
          )} text-white`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: isSelected ? 360 : 0 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
              >
                <CategoryIcon className="w-6 h-6" />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg">{test.testName}</h3>
                <p className="text-white/80 text-sm">{test.testCode}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isSelected
                  ? "bg-white text-blue-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {isSelected ? (
                <Minus className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </motion.button>
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
              {test.category}
            </span>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {test.description}
          </p>

          {/* Test Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500">Price</p>
                <p className="font-semibold text-gray-900">₹{test.price}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500">Result Time</p>
                <p className="font-semibold text-gray-900">
                  {test.resultTimeHours}h
                </p>
              </div>
            </div>
          </div>

          {/* Sample Type */}
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
            <TestTube className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">
              Sample: {test.sampleType}
            </span>
          </div>

          {/* Preparation Instructions */}
          {test.preparationInstructions && (
            <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
              <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-yellow-800 mb-1">
                  Preparation Required
                </p>
                <p className="text-xs text-yellow-700">
                  {test.preparationInstructions}
                </p>
              </div>
            </div>
          )}

          {/* Normal Ranges */}
          {test.normalRanges && test.normalRanges.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-700">
                Normal Ranges:
              </p>
              <div className="space-y-1">
                {test.normalRanges.slice(0, 2).map((range, index) => (
                  <div
                    key={index}
                    className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded"
                  >
                    {range}
                  </div>
                ))}
                {test.normalRanges.length > 2 && (
                  <p className="text-xs text-blue-600">
                    +{test.normalRanges.length - 2} more
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Selection Overlay */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-blue-500/10 rounded-2xl border-2 border-blue-500 pointer-events-none"
          >
            <div className="absolute top-4 right-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
              >
                <Plus className="w-4 h-4 text-white rotate-45" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default LabTestCard;
