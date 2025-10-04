import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  Shield,
  Lock,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";
import { paymentService } from "../../Services/payment";
import type {
  InitiateAppointmentPaymentRequest,
  VerifyPaymentRequest,
} from "../../types/payment";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  onPaymentSuccess: (paymentDetails: any) => void;
  onPaymentFailure: (error: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<
    "initiate" | "processing" | "success" | "failed"
  >("initiate");
  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setStep("processing");
      setError(null);

      const paymentRequest: InitiateAppointmentPaymentRequest = {
        appointmentId: appointment.id,
        doctorId: appointment.doctor.id,
        patientId: appointment.patientDetails.id,
        amount: appointment.doctor.consultationFee,
        currency: appointment.doctor.currency || "INR",
      };
      const paymentResponse = await paymentService.initiateAppointmentPayment(
        paymentRequest
      );
      console.log(paymentResponse);
      const options = {
        key: paymentResponse.razorpayKey,
        amount: paymentResponse.amount,
        currency: paymentResponse.currency,
        name: "Aaorgya",
        description: `Consultation with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
        order_id: paymentResponse.razorpayOrderId,
        handler: async function (response: any) {
          try {
            const verifyRequest: VerifyPaymentRequest = {
              razorpayOrderId: paymentResponse.razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };

            // Verify payment signature
            const verificationResult = await paymentService.verifyPayment(
              verifyRequest
            );

            if (verificationResult.valid) {
              // Confirm payment without webhook
              await paymentService.confirmPaymentWithoutWebhook(verifyRequest);

              // Get payment details
              const details = await paymentService.getPaymentByOrderId(
                paymentResponse.razorpayOrderId
              );
              setPaymentDetails(details);
              setStep("success");
              onPaymentSuccess(details);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error: any) {
            console.error("Payment verification failed:", error);
            setStep("failed");
            setError(error.message || "Payment verification failed");
            onPaymentFailure(error.message || "Payment verification failed");
          }
        },
        prefill: {
          name: `${appointment.patientDetails.firstName} ${appointment.patientDetails.lastName}`,
          email: appointment.patientDetails.email,
          contact: appointment.patientDetails.phone || "",
        },
        notes: {
          appointmentId: appointment.id,
          doctorId: appointment.doctor.id,
          patientId: appointment.patientDetails.id,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: function () {
            setStep("initiate");
            setLoading(false);
            setError("Payment cancelled by user");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (error: any) {
      console.error("Payment initiation failed:", error);
      setStep("failed");
      setLoading(false);
      setError(error.message || "Payment initiation failed");
      onPaymentFailure(error.message || "Payment initiation failed");
    }
  };

  const resetModal = () => {
    setStep("initiate");
    setLoading(false);
    setError(null);
    setPaymentDetails(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>

            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CreditCard className="w-8 h-8" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Secure Payment</h2>
              <p className="text-blue-100">Consultation Fee Payment</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {step === "initiate" && (
                <motion.div
                  key="initiate"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Appointment Details */}
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                    <h3 className="font-semibold text-gray-900">
                      Appointment Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doctor:</span>
                        <span className="font-medium">
                          Dr. {appointment.doctor.firstName}{" "}
                          {appointment.doctor.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Specialization:</span>
                        <span className="font-medium">
                          {appointment.doctor.specialization}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {new Date(
                            appointment.appointmentDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">
                          {appointment.startTime} - {appointment.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Amount */}
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">
                        Consultation Fee:
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{appointment.doctor.consultationFee}
                      </span>
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Shield className="w-5 h-5 text-green-500" />
                      <span>256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Lock className="w-5 h-5 text-green-500" />
                      <span>Secure payment gateway</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Instant confirmation</span>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3"
                    >
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span className="text-red-700">{error}</span>
                    </motion.div>
                  )}

                  {/* Pay Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    {loading ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <CreditCard className="w-5 h-5" />
                    )}
                    <span>
                      {loading
                        ? "Processing..."
                        : `Pay ₹${appointment.doctor.consultationFee}`}
                    </span>
                  </motion.button>
                </motion.div>
              )}

              {step === "processing" && (
                <motion.div
                  key="processing"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-center py-8 space-y-6"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"
                  />
                  <h3 className="text-xl font-bold text-gray-900">
                    Processing Payment
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we process your payment securely...
                  </p>
                </motion.div>
              )}

              {step === "success" && paymentDetails && (
                <motion.div
                  key="success"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </motion.div>

                  <div>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">
                      Payment Successful!
                    </h3>
                    <p className="text-gray-600">
                      Your appointment has been confirmed
                    </p>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-green-50 rounded-2xl p-4 space-y-3 text-left">
                    <h4 className="font-semibold text-gray-900 text-center mb-3">
                      Payment Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-mono text-xs">
                          {paymentDetails.razorpayPaymentId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold text-green-600">
                          ₹{paymentDetails.amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-green-600">
                          {paymentDetails.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid At:</span>
                        <span className="font-medium">
                          {paymentDetails.paidAt
                            ? new Date(paymentDetails.paidAt).toLocaleString()
                            : "Just now"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="w-full bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700 transition-colors"
                  >
                    Done
                  </motion.button>
                </motion.div>
              )}

              {step === "failed" && (
                <motion.div
                  key="failed"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto"
                  >
                    <XCircle className="w-8 h-8 text-red-600" />
                  </motion.div>

                  <div>
                    <h3 className="text-2xl font-bold text-red-600 mb-2">
                      Payment Failed
                    </h3>
                    <p className="text-gray-600">
                      {error || "Something went wrong with your payment"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        resetModal();
                        handlePayment();
                      }}
                      className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Try Again
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="w-full bg-gray-200 text-gray-800 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
