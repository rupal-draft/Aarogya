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
  Shield,
  Truck,
  BadgeCheck,
} from "lucide-react";
import type {
  LabTestResponse,
  CreateLabOrderRequest,
  LabOrderResponse,
} from "../../types/lab";
import { labOrderService } from "../../Services/lab";
import { LabPaymentModal } from "../Payment/LabPaymentModal";
import { locations } from "../../Data/lab";

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
  const [createdOrder, setCreatedOrder] = useState<LabOrderResponse | null>(
    null
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

      // Check if selected time is within business hours (8 AM - 8 PM)
      const hours = selectedDate.getHours();
      if (hours < 8 || hours >= 20) {
        newErrors.scheduledDateTime =
          "Please select time between 8 AM and 8 PM";
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
      setErrors({});

      const orderRequest: CreateLabOrderRequest = {
        testIds: selectedTests.map((test) => test.id),
        scheduledDateTime: formData.scheduledDateTime,
        location: formData.location,
        specialInstructions: formData.specialInstructions || undefined,
        doctorId: formData.doctorId || undefined,
      };

      const order = await labOrderService.createOrder(orderRequest);
      setCreatedOrder(order);

      // Show payment modal if payment is required
      if (order.totalAmount > 0 && order.paymentStatus === "Pending") {
        setShowPaymentModal(true);
      } else {
        onComplete();
      }
    } catch (error: any) {
      console.error("Error creating lab order:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create lab order. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    onComplete();
  };

  const handlePaymentFailure = (error: string) => {
    console.error("Payment failed:", error);
    setErrors({ submit: `Payment failed: ${error}. Please try again.` });
    setShowPaymentModal(false);
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
  };

  const totalAmount = selectedTests.reduce((sum, test) => sum + test.price, 0);
  const discount = totalAmount > 1000 ? totalAmount * 0.1 : 0; // 10% discount for orders above 1000
  const finalAmount = totalAmount - discount;

  // Get next available time slots
  const getTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const startHour = 8; // 8 AM
    const endHour = 20; // 8 PM

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(now.getDate() + i);
      date.setHours(startHour, 0, 0, 0);

      slots.push({
        date: date.toISOString().split("T")[0],
        display:
          i === 0
            ? "Today"
            : i === 1
            ? "Tomorrow"
            : date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
      });
    }

    return slots;
  };

  const timeSlots = getTimeSlots();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header with More Animations */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-16"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg"
            alt="Lab Booking"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-700/90" />
        </div>

        {/* Enhanced Floating Elements */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, 20, -20],
              x: [-15, 15, -15],
              rotate: [0, 180, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + (i % 4),
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
            className="absolute w-2 h-2 bg-white/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-all duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Tests</span>
              </motion.button>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              >
                Complete Your
                <motion.span
                  className="block text-yellow-300"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 30px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Lab Order 📋
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-blue-100 max-w-2xl"
              >
                Schedule your lab tests with confidence and get accurate results
                delivered to you
              </motion.p>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-6 mt-8"
              >
                <div className="flex items-center space-x-2 text-blue-100">
                  <Shield className="w-5 h-5" />
                  <span>100% Accurate Results</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-100">
                  <Truck className="w-5 h-5" />
                  <span>Free Home Collection</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-100">
                  <BadgeCheck className="w-5 h-5" />
                  <span>NABL Certified Labs</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="hidden lg:flex flex-col items-center"
            >
              <motion.div
                animate={{
                  rotate: 360,
                  y: [0, -10, 0],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                }}
                className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30"
              >
                <TestTube className="w-16 h-16 text-white" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-white/80 text-sm mt-4 text-center"
              >
                Secure & Reliable
                <br />
                Testing
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Order Summary</h3>
                        <p className="text-blue-100">
                          {selectedTests.length} test
                          {selectedTests.length !== 1 ? "s" : ""} selected
                        </p>
                      </div>
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
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
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

                {/* Pricing Breakdown */}
                <div className="border-t border-gray-200 p-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{totalAmount}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600">Discount (10%)</span>
                      <span className="text-green-600">-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Collection Charges</span>
                    <span className="text-gray-900">Free</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-blue-600">₹{finalAmount}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>Includes all taxes and fees</span>
                  </p>
                </div>
              </div>

              {/* Additional Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-900">
                    What's Included
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Free sample collection</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Digital report delivery</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Doctor consultation</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Booking Details</h3>
                      <p className="text-green-100">
                        Schedule your lab tests in few simple steps
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Date and Time Selection */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-4">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span>Preferred Date & Time *</span>
                  </label>

                  {/* Quick Date Selection */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {timeSlots.map((slot, index) => (
                      <motion.button
                        key={slot.date}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const dateTime = `${slot.date}T10:00`;
                          setFormData({
                            ...formData,
                            scheduledDateTime: dateTime,
                          });
                        }}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all duration-300 ${
                          formData.scheduledDateTime.split("T")[0] === slot.date
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300"
                        }`}
                      >
                        {slot.display}
                      </motion.button>
                    ))}
                  </div>

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
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                      errors.scheduledDateTime
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.scheduledDateTime && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center space-x-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.scheduledDateTime}</span>
                    </motion.p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    ⏰ Available time slots: 8:00 AM - 8:00 PM
                  </p>
                </div>

                {/* Location Selection */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-4">
                    <MapPin className="w-5 h-5 text-green-500" />
                    <span>Collection Location *</span>
                  </label>

                  <div className="grid gap-3">
                    {locations.map((location) => (
                      <motion.div
                        key={location.value}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          formData.location === location.value
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, location: location.value })
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{location.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {location.value}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {location.description}
                            </p>
                          </div>
                          {formData.location === location.value && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {errors.location && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center space-x-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.location}</span>
                    </motion.p>
                  )}
                </div>

                {/* Doctor ID */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <User className="w-5 h-5 text-purple-500" />
                    <span>Referring Doctor (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.doctorId}
                    onChange={(e) =>
                      setFormData({ ...formData, doctorId: e.target.value })
                    }
                    placeholder="Enter doctor ID or name..."
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    💡 If you have a referring doctor, please enter their ID for
                    better coordination
                  </p>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <FileText className="w-5 h-5 text-orange-500" />
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
                    placeholder="Any special instructions for sample collection, fasting requirements, or specific concerns..."
                    rows={4}
                    maxLength={500}
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none ${
                      errors.specialInstructions
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.specialInstructions && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-600 flex items-center space-x-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.specialInstructions}</span>
                      </motion.p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {formData.specialInstructions.length}/500 characters
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
                      <span className="font-medium">{errors.submit}</span>
                    </div>
                  </motion.div>
                )}

                {/* Enhanced Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`w-full py-5 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {/* Animated background */}
                  {!loading && (
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  )}

                  <div className="relative z-10 flex items-center space-x-3">
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Creating Your Order...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-6 h-6" />
                        <div className="text-center">
                          <div>Book Lab Tests</div>
                          <div className="text-sm opacity-90">
                            ₹{finalAmount} • Secure Payment
                          </div>
                        </div>
                        <CheckCircle className="w-6 h-6" />
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Enhanced Terms */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center space-y-2"
                >
                  <p className="text-sm text-gray-600">
                    By booking, you agree to our{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Privacy Policy
                    </a>
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>SSL Secure</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BadgeCheck className="w-3 h-3" />
                      <span>NABL Certified</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Truck className="w-3 h-3" />
                      <span>Free Collection</span>
                    </div>
                  </div>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      {createdOrder && (
        <LabPaymentModal
          isOpen={showPaymentModal}
          onClose={handlePaymentModalClose}
          order={createdOrder}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
        />
      )}
    </div>
  );
};

export default LabOrderForm;
