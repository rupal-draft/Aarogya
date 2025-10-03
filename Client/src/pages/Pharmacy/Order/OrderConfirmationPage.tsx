"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getOrderById } from "../../../Services/orderService";
import LoadingSpinner from "../../../common/Spinners/LoadingSpinner";
import ErrorDisplay from "../../../common/Error/ErrorDisplay";
import type { OrderDTO } from "../../../types/order";

const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate estimated delivery date (7 days from order date)
  const getEstimatedDeliveryDate = (orderDate: string) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorDisplay
          message={error || "Order not found"}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-12 text-white text-center relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360, scale: [1, 1.3, 1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/5 rounded-full"
            />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.2,
              }}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
            >
              <motion.svg
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-3 relative z-10"
            >
              Order Confirmed!
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-emerald-100 text-lg relative z-10"
            >
              Thank you for your purchase. Your order is being processed.
            </motion.p>
          </div>

          {/* Order details */}
          <div className="px-6 py-8">
            {/* Order Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col md:flex-row justify-between mb-8 p-6 bg-gray-50 rounded-xl"
            >
              <div className="mb-4 md:mb-0">
                <h2 className="text-sm font-medium text-gray-500 mb-1">
                  ORDER NUMBER
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  #{order.id.slice(-8)}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-1">
                  ORDER DATE
                </h2>
                <p className="text-xl font-bold text-gray-900">
                  {formatDate(order.orderDate)}
                </p>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="border-t border-gray-200 pt-6 mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Order Summary
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <motion.div
                    key={item.medicineId}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden mr-4 shadow-sm">
                      <img
                        src={
                          item.medicineImage ||
                          "/placeholder.svg?height=64&width=64"
                        }
                        alt={item.medicineName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-gray-900">
                        {item.medicineName}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-lg font-bold text-emerald-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Order Total */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="border-t border-gray-200 pt-6 mb-8"
            >
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">
                    ${(order.totalAmount * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200 text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-emerald-600">
                    ${(order.totalAmount * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Shipping & Payment */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="border-t border-gray-200 pt-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    SHIPPING ADDRESS
                  </h2>
                  <p className="text-sm text-gray-900 whitespace-pre-line leading-relaxed">
                    {order.shippingAddress}
                  </p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    PAYMENT METHOD
                  </h2>
                  <p className="text-sm font-medium text-gray-900">
                    {order.paymentMethod === "CREDIT_CARD"
                      ? "Credit Card"
                      : order.paymentMethod === "PAYPAL"
                      ? "PayPal"
                      : order.paymentMethod === "UPI"
                      ? "UPI Payment"
                      : order.paymentMethod === "CARD"
                      ? "Credit/Debit Card"
                      : "Cash on Delivery"}
                  </p>
                  {order.paymentId && order.paymentId !== "Not paid yet" && (
                    <p className="text-xs text-gray-500 mt-1">
                      Payment ID: {order.paymentId}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Delivery Information */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="border-t border-gray-200 pt-6 mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-3 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Delivery Information
              </h2>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Estimated Delivery Date
                    </p>
                    <p className="text-sm text-emerald-600 font-medium">
                      {getEstimatedDeliveryDate(order.orderDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Order Status
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        order.status === "DELIVERED"
                          ? "text-green-600"
                          : order.status === "CANCELLED"
                          ? "text-red-600"
                          : order.status === "PROCESSING"
                          ? "text-blue-600"
                          : order.status === "SHIPPED"
                          ? "text-purple-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.status === "PENDING"
                        ? "Pending"
                        : order.status === "PROCESSING"
                        ? "Processing"
                        : order.status === "SHIPPED"
                        ? "Shipped"
                        : order.status === "DELIVERED"
                        ? "Delivered"
                        : "Cancelled"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="text-center"
            >
              <p className="text-sm text-gray-600 mb-8">
                A confirmation email has been sent to your registered email
                address.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/medicines"
                    className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-2xl shadow-lg text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Continue Shopping
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/pharmacy/orders"
                    className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 shadow-sm text-base font-medium rounded-2xl text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    View All Orders
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
