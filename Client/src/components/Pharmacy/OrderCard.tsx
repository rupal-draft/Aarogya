import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  Eye,
  EyeOff,
  MapPin,
  Calendar,
  IndianRupee,
  Pill,
  User,
} from "lucide-react";
import type { OrderDTO } from "../../types/order";
import { paymentService } from "../../Services/payment";
import { PharmacyPaymentModal } from "../Payment/PharmacyPaymentModal";

interface OrderCardProps {
  order: OrderDTO;
  index: number;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, index }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [loadingPaymentDetails, setLoadingPaymentDetails] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return Clock;
      case "PROCESSING":
        return Package;
      case "SHIPPED":
        return Truck;
      case "DELIVERED":
        return CheckCircle;
      case "CANCELLED":
        return XCircle;
      default:
        return Package;
    }
  };

  const isPaymentRequired = () => {
    return (
      order.status.toUpperCase() === "PENDING" &&
      (!order.paymentId || order.paymentId === "Not paid yet")
    );
  };

  const isPaid = () => {
    return order.paymentId && order.paymentId !== "Not paid yet";
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
      const details = await paymentService.getPharmacyPaymentDetails(
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
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-6">
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
                    Order #{order.id.slice(-8)}
                  </h3>
                  <p className="text-emerald-100 text-sm">
                    {order.items.length} medicine(s)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-emerald-100">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{order.patientName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(order.orderDate).toLocaleDateString()}</span>
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
                <Package className="w-4 h-4 mr-2 text-emerald-500" />
                Order Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">
                    {new Date(order.orderDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">
                    {order.paymentMethod.replace("_", " ").toLowerCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">
                    {order.items.length} medicine(s)
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
                Shipping Address
              </h4>
              <div className="text-sm">
                <p className="text-gray-800 leading-relaxed">
                  {order.shippingAddress}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Medicine Items */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-blue-50 rounded-2xl p-4 space-y-3"
          >
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Pill className="w-4 h-4 mr-2 text-blue-500" />
              Medicines ({order.items.length})
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {order.items.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center space-x-3 bg-white rounded-xl p-3"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.medicineImage ? (
                      <img
                        src={item.medicineImage}
                        alt={item.medicineName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Pill className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {item.medicineName}
                    </p>
                    <p className="text-sm text-gray-600">
                      ₹{item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-bold text-gray-900 flex items-center">
                    <IndianRupee className="w-3 h-3" />
                    {(item.price * item.quantity).toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100"
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
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2"
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
        </div>
      </motion.div>

      {/* Payment Modal */}
      <PharmacyPaymentModal
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
              <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
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
                    <Package className="w-8 h-8" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2">Payment Receipt</h2>
                  <p className="text-green-100">Order Transaction Details</p>
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
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium">
                          #{order.id.slice(-8)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Patient:</span>
                        <span className="font-medium">{order.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items:</span>
                        <span className="font-medium">
                          {order.items.length} medicine(s)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPaymentDetails(false)}
                  className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-semibold hover:bg-emerald-700 transition-colors"
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
