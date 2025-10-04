import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TestTube,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  CreditCard,
  Eye,
  EyeOff,
  Activity,
  User,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";
import type { LabOrderResponse } from "../../types/lab";
import { OrderStatus, PaymentStatus } from "../../Data/enums/lab";
import { paymentService } from "../../Services/payment";
import { LabPaymentModal } from "../Payment/LabPaymentModal";

interface LabOrderCardProps {
  order: LabOrderResponse;
  index: number;
}

export const LabOrderCard: React.FC<LabOrderCardProps> = ({ order, index }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loadingPaymentDetails, setLoadingPaymentDetails] = useState(false);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case OrderStatus.CONFIRMED:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case OrderStatus.SAMPLE_COLLECTED:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case OrderStatus.IN_PROGRESS:
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case OrderStatus.COMPLETED:
        return "bg-green-100 text-green-800 border-green-200";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return Clock;
      case OrderStatus.CONFIRMED:
        return CheckCircle;
      case OrderStatus.SAMPLE_COLLECTED:
        return TestTube;
      case OrderStatus.IN_PROGRESS:
        return Activity;
      case OrderStatus.COMPLETED:
        return CheckCircle;
      case OrderStatus.CANCELLED:
        return XCircle;
      default:
        return Clock;
    }
  };

  const isPaymentRequired = () => {
    return (
      order.paymentStatus === PaymentStatus.PENDING &&
      (!order.paymentId || order.paymentId === "Not paid yet")
    );
  };

  const isPaid = () => {
    return (
      order.paymentStatus === PaymentStatus.PAID &&
      order.paymentId &&
      order.paymentId !== "Not paid yet"
    );
  };

  const handlePaymentSuccess = (details: any) => {
    setPaymentDetails(details);
    setShowPaymentModal(false);
  };

  const handlePaymentFailure = (error: string) => {
    console.error("Payment failed:", error);
  };

  const loadPaymentDetails = async () => {
    if (!order.paymentId || order.paymentId === "Not paid yet") return;

    try {
      setLoadingPaymentDetails(true);
      const details = await paymentService.getLabPaymentDetails(
        order.paymentId
      );
      setPaymentDetails(details);
      setShowPaymentDetails(true);
    } catch (error) {
      console.error("Failed to load payment details:", error);
    } finally {
      setLoadingPaymentDetails(false);
    }
  };

  const StatusIcon = getStatusIcon(order.status);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{
          scale: 1.02,
          y: -5,
          transition: { duration: 0.2 },
        }}
        className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
      >
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white p-6">
          {/* Floating background elements */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"
          />

          <div className="relative z-10 flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                >
                  <StatusIcon className="w-5 h-5" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-cyan-100 text-sm">
                    {order.orderedTests.length} test(s)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-cyan-100">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{order.patientName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(order.scheduledDateTime).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 rounded-2xl p-4 space-y-3"
            >
              <h4 className="font-semibold text-gray-900 flex items-center">
                <TestTube className="w-4 h-4 mr-2 text-cyan-500" />
                Order Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Scheduled:</span>
                  <span className="font-medium">
                    {new Date(order.scheduledDateTime).toLocaleDateString()} at{" "}
                    {new Date(order.scheduledDateTime).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tests:</span>
                  <span className="font-medium">
                    {order.orderedTests.length} test(s)
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 rounded-2xl p-4 space-y-3"
            >
              <h4 className="font-semibold text-gray-900 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                Collection Location
              </h4>
              <div className="text-sm">
                <p className="text-gray-800 leading-relaxed">
                  {order.location}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Lab Tests */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-blue-50 rounded-2xl p-4 space-y-3"
          >
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-blue-500" />
              Lab Tests ({order.orderedTests.length})
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {order.orderedTests.map((test, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center space-x-3 bg-white rounded-xl p-3"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TestTube className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {test.testName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Code: {test.testCode}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          test.status === "COMPLETED"
                            ? "bg-green-500"
                            : test.status === "IN_PROGRESS"
                            ? "bg-blue-500"
                            : test.status === "SAMPLE_COLLECTED"
                            ? "bg-purple-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <span className="text-xs text-gray-500">
                        {test.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-900 flex items-center">
                    <IndianRupee className="w-3 h-3" />
                    {test.price.toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-green-50 to-cyan-50 rounded-2xl p-4 border border-green-100"
          >
            <h4 className="font-semibold text-gray-900 flex items-center mb-3">
              <CreditCard className="w-4 h-4 mr-2 text-green-500" />
              Payment Information
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="font-bold text-xl text-green-600 flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {order.totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment Status:</span>
                <div className="flex items-center space-x-2">
                  {isPaid() ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Paid</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center space-x-1">
                      <XCircle className="w-3 h-3" />
                      <span>Pending</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Payment Actions */}
              <div className="flex space-x-3 pt-2">
                {isPaymentRequired() && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPaymentModal(true)}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay Now</span>
                  </motion.button>
                )}

                {isPaid() && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadPaymentDetails}
                    disabled={loadingPaymentDetails}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {loadingPaymentDetails ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    <span>
                      {loadingPaymentDetails ? "Loading..." : "View Receipt"}
                    </span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-yellow-50 rounded-2xl p-4 space-y-3 border border-yellow-100"
            >
              <h4 className="font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                Special Instructions
              </h4>
              <p className="text-sm text-gray-800">
                {order.specialInstructions}
              </p>
            </motion.div>
          )}

          {/* Doctor Information */}
          {order.doctorName && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-purple-50 rounded-2xl p-4 space-y-3 border border-purple-100"
            >
              <h4 className="font-semibold text-gray-900 flex items-center">
                <User className="w-4 h-4 mr-2 text-purple-500" />
                Referring Doctor
              </h4>
              <p className="text-sm text-gray-800">{order.doctorName}</p>
            </motion.div>
          )}

          {/* Cancellation Reason */}
          {order.status === OrderStatus.CANCELLED &&
            order.cancellationReason && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 rounded-2xl p-4 border border-red-100"
              >
                <h4 className="font-semibold text-gray-900 flex items-center mb-2">
                  <XCircle className="w-4 h-4 mr-2 text-red-500" />
                  Cancellation Reason
                </h4>
                <p className="text-sm text-gray-800">
                  {order.cancellationReason}
                </p>
              </motion.div>
            )}
        </div>
      </motion.div>

      {/* Payment Modal */}
      <LabPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        order={order}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
      />

      {/* Payment Details Modal */}
      <AnimatePresence>
        {showPaymentDetails && paymentDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setShowPaymentDetails(false)
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-green-600 to-cyan-600 text-white p-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPaymentDetails(false)}
                  className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <EyeOff className="w-4 h-4" />
                </motion.button>

                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <TestTube className="w-8 h-8" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">Payment Receipt</h2>
                  <p className="text-green-100">
                    Lab Order Transaction Details
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Payment Status */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-green-600 mb-1">
                    Payment Successful
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Transaction completed successfully
                  </p>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      Transaction Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-mono text-xs break-all">
                          {paymentDetails.razorpayPaymentId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-mono text-xs break-all">
                          {paymentDetails.razorpayOrderId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold text-green-600 flex items-center">
                          <IndianRupee className="w-3 h-3" />
                          {paymentDetails.amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-green-600">
                          {paymentDetails.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Date:</span>
                        <span className="font-medium">
                          {paymentDetails.paidAt
                            ? new Date(
                                paymentDetails.paidAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "Just now"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="bg-blue-50 rounded-2xl p-4 space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      Order Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Number:</span>
                        <span className="font-medium">
                          #{order.orderNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Patient:</span>
                        <span className="font-medium">{order.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tests:</span>
                        <span className="font-medium">
                          {order.orderedTests.length} test(s)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Scheduled:</span>
                        <span className="font-medium">
                          {new Date(
                            order.scheduledDateTime
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPaymentDetails(false)}
                  className="w-full bg-cyan-600 text-white py-3 rounded-2xl font-semibold hover:bg-cyan-700 transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
