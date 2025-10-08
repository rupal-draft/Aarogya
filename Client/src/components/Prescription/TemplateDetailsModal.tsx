import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Edit,
  Pill,
  Play,
  Share2,
  Star,
} from "lucide-react";
import type {
  PrescribedMedicineResponse,
  TemplateResponse,
} from "../../types/prescription";

const TemplateDetailsModal: React.FC<{
  template: TemplateResponse;
  onClose: () => void;
  onEdit: () => void;
  onApply: () => void;
}> = ({ template, onClose, onEdit, onApply }) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
      className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold">{template.name}</h2>
                <p className="text-blue-100 text-sm mt-1">Template Details</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {template.isFavorite && (
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              )}
              {template.isShared && (
                <Share2 className="w-5 h-5 text-green-300" />
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {template.description || "No description provided"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {template.diagnosis}
                </p>
              </div>

              {template.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                    {template.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Information
                </label>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usage Count:</span>
                    <span className="font-medium">{template.usageCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {template.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">
                      {template.categoryName || "Uncategorized"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {template.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Medicines Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-500" />
                Medicines ({template.medicines.length})
              </h3>
            </div>

            <div className="space-y-3">
              {template.medicines.map(
                (medicine: PrescribedMedicineResponse, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          {medicine.medicineName}
                        </h4>
                        {medicine.isSubstitute && (
                          <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full mt-1">
                            Substitute
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Dosage:</span>
                        <p className="font-medium">{medicine.dosage}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Frequency:</span>
                        <p className="font-medium">{medicine.frequency}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="font-medium">{medicine.duration} days</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Instructions:</span>
                        <p className="font-medium">
                          {medicine.instructions || "Take as directed"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </div>

          {/* Applicable Conditions */}
          {template.applicableConditions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                Applicable Conditions
              </h3>
              <div className="flex flex-wrap gap-2">
                {template.applicableConditions.map((condition, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Template
            </button>
            <button
              onClick={onApply}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Apply Template
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TemplateDetailsModal;
