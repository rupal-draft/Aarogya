import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, AlertCircle } from "lucide-react";
import type {
  AppointmentResponseDto,
  UpdateAppointmentStatusDto,
} from "../../../types/appointment";
import { updateAppointmentStatus } from "../../../Services/appointment";
import { statusOptions } from "../../../Data/appointment";

interface UpdateAppointmentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentResponseDto;
  onStatusUpdate: (updatedAppointment: AppointmentResponseDto) => void;
}

const initialFormData: UpdateAppointmentStatusDto = {
  status: "",
  notes: "",
  doctorNotes: "",
  cancellationReason: "",
};

export const UpdateAppointmentStatusModal = ({
  isOpen,
  onClose,
  appointment,
  onStatusUpdate,
}: UpdateAppointmentStatusModalProps) => {
  const [formData, setFormData] = useState<UpdateAppointmentStatusDto>({
    status: "",
    notes: "",
    doctorNotes: "",
    cancellationReason: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const updatedAppointment = await updateAppointmentStatus(
        appointment.id,
        formData
      );
      onStatusUpdate(updatedAppointment);
      onClose();
      setFormData(initialFormData);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to update appointment status"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    field: keyof UpdateAppointmentStatusDto,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData(initialFormData); // ✅ reset on cancel
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Update Appointment Status
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add appointment notes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Doctor Notes
                </label>
                <textarea
                  value={formData.doctorNotes}
                  onChange={(e) => handleChange("doctorNotes", e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add doctor notes..."
                />
              </div>

              {(formData.status === "CANCELLED" ||
                formData.status === "REJECTED") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Reason
                  </label>
                  <textarea
                    value={formData.cancellationReason}
                    onChange={(e) =>
                      handleChange("cancellationReason", e.target.value)
                    }
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Reason for cancellation..."
                    required={
                      formData.status === "CANCELLED" ||
                      formData.status === "REJECTED"
                    }
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Update Status
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
