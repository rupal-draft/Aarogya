"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  FileText,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  CreditCard,
  TestTube,
} from "lucide-react";
import type { LabTestResponse, CreateLabOrderRequest } from "../../types/lab";
import { labOrderService } from "../../Services/lab";

interface LabOrderFormProps {
  selectedTests: LabTestResponse[];
  onBack: () => void;
  onComplete: () => void;
}

const LabOrderForm: React.FC<LabOrderFormProps> = ({
  selectedTests,
  onBack,
  onComplete,
}) => {
  const [formData, setFormData] = useState({
    scheduledDateTime: "",
    location: "",
    specialInstructions: "",
    doctorId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const locations = [
    "Home Collection",
    "Main Lab - Downtown",
    "Branch Lab - Uptown",
    "Hospital Lab - Central",
    "Clinic Lab - Westside",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.scheduledDateTime) {
      newErrors.scheduledDateTime = "Please select a date and time";
    } else {
      const selectedDate = new Date(formData.scheduledDateTime);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.scheduledDateTime = "Please select a future date and time";
      }
    }

    if (!formData.location) {
      newErrors.location = "Please select a location";
    }

    if (
      formData.specialInstructions &&
      formData.specialInstructions.length > 500
    ) {
      newErrors.specialInstructions =
        "Special instructions cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const orderRequest: CreateLabOrderRequest = {
        testIds: selectedTests.map((test) => test.id),
        scheduledDateTime: formData.scheduledDateTime,
        location: formData.location,
        specialInstructions: formData.specialInstructions || undefined,
        doctorId: formData.doctorId || undefined,
      };

      await labOrderService.createOrder(orderRequest);
      onComplete();
    } catch (error) {
      console.error("Error creating lab order:", error);
      setErrors({ submit: "Failed to create lab order. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = selectedTests.reduce((sum, test) => sum + test.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/placeholder-kwutl.png"
            alt="Lab Booking"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
        </div>

        {/* Floating Sparkles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Tests</span>
              </motion.button>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Complete Your
                <span className="block text-yellow-300">Lab Order 📋</span>
              </h1>

              <p className="text-xl text-blue-100">
                Schedule your lab tests and get accurate results
              </p>
            </div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="hidden md:block w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <TestTube className="w-12 h-12 text-white" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Order Summary</h3>
                      <p className="text-blue-100">
                        {selectedTests.length} tests selected
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tests List */}
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {selectedTests.map((test, index) => (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {test.testName}
                        </h4>
                        <p className="text-gray-600 text-xs">{test.testCode}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {test.resultTimeHours}h result
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{test.price}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 p-6">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-blue-600">₹{totalAmount}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Includes all taxes and fees
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Booking Details</h3>
                    <p className="text-green-100">Schedule your lab tests</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Date and Time */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>Preferred Date & Time *</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledDateTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scheduledDateTime: e.target.value,
                      })
                    }
                    min={new Date().toISOString().slice(0, 16)}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                      errors.scheduledDateTime
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.scheduledDateTime && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.scheduledDateTime}</span>
                    </motion.p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span>Collection Location *</span>
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                      errors.location
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a location</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  {errors.location && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center space-x-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.location}</span>
                    </motion.p>
                  )}
                </div>

                {/* Doctor ID (Optional) */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <User className="w-4 h-4 text-purple-500" />
                    <span>Referring Doctor (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.doctorId}
                    onChange={(e) =>
                      setFormData({ ...formData, doctorId: e.target.value })
                    }
                    placeholder="Enter doctor ID or leave blank"
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <span>Special Instructions (Optional)</span>
                  </label>
                  <textarea
                    value={formData.specialInstructions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialInstructions: e.target.value,
                      })
                    }
                    placeholder="Any special instructions for sample collection..."
                    rows={4}
                    maxLength={500}
                    className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none ${
                      errors.specialInstructions
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.specialInstructions && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 flex items-center space-x-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.specialInstructions}</span>
                      </motion.p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {formData.specialInstructions.length}/500
                    </p>
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-xl"
                  >
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      <span>{errors.submit}</span>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Order...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Book Lab Tests - ₹{totalAmount}</span>
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Terms */}
                <p className="text-sm text-gray-600 text-center">
                  By booking, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LabOrderForm;
