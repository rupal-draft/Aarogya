"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TestTube,
  FileText,
  Activity,
  Package,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Calendar,
  MapPin,
  Download,
  X,
  AlertTriangle,
  User,
  CreditCard,
  Eye,
  IndianRupee,
  Sparkles,
  Zap,
  Star,
  Shield,
  Award,
  Heart,
  Battery,
  Thermometer,
  Droplets,
  Stethoscope,
} from "lucide-react";
import type { LabOrderResponse, LabResultResponse } from "../../types/lab";
import { OrderStatus, PaymentStatus } from "../../Data/enums/lab";
import { paymentService } from "../../Services/payment";
import { LabPaymentModal } from "../Payment/LabPaymentModal";
import { labOrderService, labResultService } from "../../Services/lab";
import {
  getOrderStatusColor,
  getOrderStatusIcon,
  getResultStatusColor,
  getResultStatusIcon,
} from "../../Data/lab";

interface PatientLabOrdersProps {
  onBack?: () => void;
}

const PatientLabOrders: React.FC<PatientLabOrdersProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<LabOrderResponse[]>([]);
  const [results, setResults] = useState<LabResultResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "results">("orders");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<LabOrderResponse | null>(
    null
  );
  const [selectedResult, setSelectedResult] =
    useState<LabResultResponse | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, resultsData] = await Promise.all([
        labOrderService.getMyOrders(),
        labResultService.getMyResults(),
      ]);
      setOrders(ordersData.content || ordersData);
      setResults(resultsData.content || resultsData);
    } catch (error) {
      console.error("Error loading lab data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Payment functions
  const isPaymentRequired = (order: LabOrderResponse) => {
    return (
      order.paymentStatus === PaymentStatus.PENDING &&
      (!order.paymentId || order.paymentId === "Not paid yet")
    );
  };

  const isPaid = (order: LabOrderResponse) => {
    return (
      order.paymentStatus === PaymentStatus.PAID &&
      order.paymentId &&
      order.paymentId !== "Not paid yet"
    );
  };

  const handlePaymentSuccess = (details: any) => {
    setPaymentDetails(details);
    setShowPaymentModal(false);
    loadData();
  };

  const handlePaymentFailure = (error: string) => {
    console.error("Payment failed:", error);
    setShowPaymentModal(false);
  };

  const loadPaymentDetails = async (order: LabOrderResponse) => {
    if (!order.paymentId || order.paymentId === "Not paid yet") return;

    try {
      const details = await paymentService.getLabPaymentDetails(
        order.paymentId
      );
      setPaymentDetails(details);
      setShowPaymentDetails(true);
    } catch (error) {
      console.error("Failed to load payment details:", error);
    }
  };

  // Filter functions
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderedTests?.some((test) =>
        test.testName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  const filteredResults = results.filter((result) => {
    const matchesStatus =
      filterStatus === "all" || result.overallResult === filterStatus;
    const matchesSearch =
      result.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.testName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Enhanced Compact Order Card Component
  const CompactOrderCard = ({
    order,
    index,
  }: {
    order: LabOrderResponse;
    index: number;
  }) => {
    const statusConfig = getOrderStatusColor(order.status);
    const { icon: StatusIcon, color: statusIconColor } = getOrderStatusIcon(
      order.status
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
        className="relative bg-white rounded-3xl shadow-2xl border-2 border-white overflow-hidden cursor-pointer group"
        onClick={() => setSelectedOrder(order)}
      >
        {/* Animated Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-5 group-hover:opacity-10 transition-all duration-500`}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 180, 360],
                scale: [0.5, 1, 0.5],
              }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
              className={`absolute w-2 h-2 ${statusConfig.bg} rounded-full opacity-30`}
              style={{ top: `${20 + i * 15}%`, left: `${10 + i * 10}%` }}
            />
          ))}
        </div>

        {/* Glow Effect */}
        <div
          className={`absolute -inset-1 bg-gradient-to-r ${statusConfig.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}
        />

        {/* Header */}
        <div
          className={`relative p-5 bg-gradient-to-r ${statusConfig.gradient} text-white overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30"
              >
                <StatusIcon className={`w-6 h-6 ${statusIconColor}`} />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg drop-shadow-sm">
                  #{order.orderNumber}
                </h3>
                <p className="text-white/90 text-sm font-medium">
                  {order.orderedTests.length} tests
                </p>
              </div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="text-right"
            >
              <p className="font-bold text-lg flex items-center justify-end drop-shadow-sm">
                <IndianRupee className="w-4 h-4 mr-1" />
                {order.totalAmount}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                <p className="text-white/90 text-sm font-medium">
                  {order.status}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-5 space-y-4 bg-white/80 backdrop-blur-sm">
          {/* Date and Location */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <div
                className={`p-2 rounded-lg ${statusConfig.light} ${statusConfig.border}`}
              >
                <Calendar className={`w-4 h-4 ${statusConfig.text}`} />
              </div>
              <span className="font-medium text-gray-700">
                {new Date(order.scheduledDateTime).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div
                className={`p-2 rounded-lg ${statusConfig.light} ${statusConfig.border}`}
              >
                <MapPin className={`w-4 h-4 ${statusConfig.text}`} />
              </div>
              <span className="font-medium text-gray-700 truncate max-w-[120px]">
                {order.location}
              </span>
            </div>
          </div>

          {/* Patient Info */}
          <div className="flex items-center space-x-2 text-sm">
            <div
              className={`p-2 rounded-lg ${statusConfig.light} ${statusConfig.border}`}
            >
              <User className={`w-4 h-4 ${statusConfig.text}`} />
            </div>
            <span className="font-medium text-gray-700">
              {order.patientName}
            </span>
          </div>

          {/* Payment Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm">
              <div
                className={`p-2 rounded-lg ${statusConfig.light} ${statusConfig.border}`}
              >
                <CreditCard className={`w-4 h-4 ${statusConfig.text}`} />
              </div>
              <span className="font-medium text-gray-700">
                {isPaid(order)
                  ? "Payment Complete"
                  : isPaymentRequired(order)
                  ? "Payment Pending"
                  : "Payment Required"}
              </span>
            </div>
            {isPaymentRequired(order) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOrder(order);
                  setShowPaymentModal(true);
                }}
                className="px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-1"
              >
                <Zap className="w-3 h-3" />
                <span>Pay Now</span>
              </motion.button>
            )}
            {isPaid(order) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  loadPaymentDetails(order);
                }}
                className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-1"
              >
                <Eye className="w-3 h-3" />
                <span>Receipt</span>
              </motion.button>
            )}
          </div>

          {/* Tests Preview */}
          <div className="pt-3 border-t border-gray-100/50">
            <div className="flex items-center space-x-2 mb-2">
              <TestTube className={`w-4 h-4 ${statusConfig.text}`} />
              <p className="text-sm font-semibold text-gray-700">
                Tests Included
              </p>
            </div>
            <div className="space-y-2">
              {order.orderedTests.slice(0, 2).map((test, idx) => (
                <motion.div
                  key={test.testId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + idx * 0.1 }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${statusConfig.light} ${statusConfig.border} backdrop-blur-sm`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800">{test.testName}</span>
                    <span className={`font-bold ${statusConfig.text}`}>
                      ₹{test.price}
                    </span>
                  </div>
                </motion.div>
              ))}
              {order.orderedTests.length > 2 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="text-sm font-semibold text-blue-600 flex items-center space-x-1"
                >
                  <Star className="w-3 h-3" />
                  <span>+{order.orderedTests.length - 2} more tests</span>
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Enhanced Result Card Component
  const CompactResultCard = ({
    result,
    index,
  }: {
    result: LabResultResponse;
    index: number;
  }) => {
    const statusConfig = getResultStatusColor(result.overallResult);
    const { icon: StatusIcon, color: statusIconColor } = getResultStatusIcon(
      result.overallResult
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{ y: -8, scale: 1.03, transition: { duration: 0.3 } }}
        className="relative bg-white rounded-3xl shadow-2xl border-2 border-white overflow-hidden cursor-pointer group"
        onClick={() => setSelectedResult(result)}
      >
        {/* Animated Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-5 group-hover:opacity-10 transition-all duration-500`}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 180, 360],
                scale: [0.5, 1, 0.5],
              }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
              className={`absolute w-2 h-2 ${statusConfig.bg} rounded-full opacity-30`}
              style={{ top: `${20 + i * 15}%`, left: `${10 + i * 10}%` }}
            />
          ))}
        </div>

        {/* Glow Effect */}
        <div
          className={`absolute -inset-1 bg-gradient-to-r ${statusConfig.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}
        />

        {/* Header */}
        <div
          className={`relative p-5 bg-gradient-to-r ${statusConfig.gradient} text-white overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30"
              >
                <StatusIcon className={`w-6 h-6 ${statusIconColor}`} />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg drop-shadow-sm">
                  {result.testName}
                </h3>
                <p className="text-white/90 text-sm font-medium">
                  {result.orderNumber}
                </p>
              </div>
            </div>
            {result.isCritical && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <AlertTriangle className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative p-5 space-y-4 bg-white/80 backdrop-blur-sm">
          {/* Result Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">
              Overall Result:
            </span>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className={`px-3 py-1 rounded-full text-sm font-bold ${statusConfig.light} ${statusConfig.border} ${statusConfig.text} backdrop-blur-sm`}
            >
              {result.overallResult}
            </motion.span>
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div
                  className={`p-2 rounded-lg ${statusConfig.light} ${statusConfig.border}`}
                >
                  <Calendar className={`w-3 h-3 ${statusConfig.text}`} />
                </div>
                <span className="text-gray-600">Sample Collected:</span>
              </div>
              <span className="font-semibold text-gray-800">
                {result.sampleCollectedAt
                  ? new Date(result.sampleCollectedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div
                  className={`p-2 rounded-lg ${statusConfig.light} ${statusConfig.border}`}
                >
                  <FileText className={`w-3 h-3 ${statusConfig.text}`} />
                </div>
                <span className="text-gray-600">Result Date:</span>
              </div>
              <span className="font-semibold text-gray-800">
                {result.resultGeneratedAt
                  ? new Date(result.resultGeneratedAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Verification Badge */}
          {result.isVerified && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">
                Verified by Pathologist
              </span>
            </motion.div>
          )}

          {/* Download Button */}
          {result.reportUrl && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Download className="w-4 h-4 group-hover:animate-bounce" />
              <span>Download Report</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  };

  // Enhanced Order Detail Modal
  const OrderDetailModal = ({ order }: { order: LabOrderResponse }) => {
    const statusConfig = getOrderStatusColor(order.status);
    const { icon: StatusIcon, color: statusIconColor } = getOrderStatusIcon(
      order.status
    );

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={() => setSelectedOrder(null)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${statusConfig.glow} opacity-20`}
          />

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 15, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                className={`absolute w-3 h-3 ${statusConfig.bg} rounded-full opacity-20`}
                style={{
                  top: `${10 + i * 12}%`,
                  left: `${5 + i * 12}%`,
                }}
              />
            ))}
          </div>

          {/* Header */}
          <div
            className={`relative p-8 bg-gradient-to-r ${statusConfig.gradient} text-white overflow-hidden`}
          >
            <div className="absolute inset-0">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30"
                >
                  <StatusIcon className={`w-8 h-8 ${statusIconColor}`} />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold drop-shadow-sm">
                    Order Details
                  </h2>
                  <p className="text-white/90 text-lg">#{order.orderNumber}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedOrder(null)}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="relative p-8 space-y-8 bg-white/95 backdrop-blur-sm max-h-[60vh] overflow-y-auto">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-100 text-center">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <p className="text-sm text-blue-600 mb-1">Scheduled Date</p>
                <p className="font-bold text-blue-800">
                  {new Date(order.scheduledDateTime).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-100 text-center">
                <Clock className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-green-600 mb-1">Scheduled Time</p>
                <p className="font-bold text-green-800">
                  {new Date(order.scheduledDateTime).toLocaleTimeString()}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border-2 border-purple-100 text-center">
                <MapPin className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <p className="text-sm text-purple-600 mb-1">Location</p>
                <p className="font-bold text-purple-800">{order.location}</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-100 text-center">
                <IndianRupee className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <p className="text-sm text-amber-600 mb-1">Total Amount</p>
                <p className="font-bold text-amber-800 text-xl">
                  ₹{order.totalAmount}
                </p>
              </div>
            </motion.div>

            {/* Patient & Payment Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-slate-50 to-gray-50 p-6 rounded-2xl border-2 border-slate-100"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <User className="w-6 h-6 text-gray-600 mr-2" />
                  Patient Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold text-gray-800">
                      {order.patientName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-2xl border-2 border-cyan-100"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <CreditCard className="w-6 h-6 text-cyan-600 mr-2" />
                  Payment Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-semibold ${
                        isPaid(order) ? "text-green-600" : "text-amber-600"
                      }`}
                    >
                      {isPaid(order) ? "Paid" : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-800 flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {order.totalAmount}
                    </span>
                  </div>
                  <div className="flex space-x-3 mt-4">
                    {isPaymentRequired(order) && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowPaymentModal(true)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg"
                      >
                        Pay Now
                      </motion.button>
                    )}
                    {isPaid(order) && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => loadPaymentDetails(order)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Receipt</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Tests Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <TestTube className="w-7 h-7 text-purple-500 mr-3" />
                Ordered Tests ({order.orderedTests.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.orderedTests.map((test, index) => {
                  const testStatusConfig = getOrderStatusIcon(
                    test.status as OrderStatus
                  );
                  const TestStatusIcon = testStatusConfig.icon;
                  return (
                    <motion.div
                      key={test.testId}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-800 text-lg group-hover:text-purple-600 transition-colors">
                          {test.testName}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <TestStatusIcon
                            className={`w-5 h-5 ${testStatusConfig.color}`}
                          />
                          <span className="text-sm font-medium text-gray-600">
                            {test.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            Code: {test.testCode}
                          </p>
                          {test.sampleCollectedAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Collected:{" "}
                              {new Date(
                                test.sampleCollectedAt
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <p className="font-bold text-purple-600 flex items-center text-lg">
                          <IndianRupee className="w-4 h-4 mr-1" />
                          {test.price}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Enhanced Result Detail Modal
  const ResultDetailModal = ({ result }: { result: LabResultResponse }) => {
    const statusConfig = getResultStatusColor(result.overallResult);
    const { icon: StatusIcon, color: statusIconColor } = getResultStatusIcon(
      result.overallResult
    );

    // Get appropriate test icon based on test name
    const getTestIcon = (testName: string) => {
      const lowerName = testName.toLowerCase();
      if (lowerName.includes("blood") || lowerName.includes("cbc"))
        return Heart;
      if (lowerName.includes("sugar") || lowerName.includes("glucose"))
        return Battery;
      if (lowerName.includes("temperature") || lowerName.includes("fever"))
        return Thermometer;
      if (lowerName.includes("urine") || lowerName.includes("fluid"))
        return Droplets;
      return Stethoscope;
    };

    const TestIcon = getTestIcon(result.testName);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={() => setSelectedResult(null)}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${statusConfig.glow} opacity-20`}
          />

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -40, 0],
                  x: [0, 20, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                className={`absolute w-4 h-4 ${statusConfig.bg} rounded-full opacity-20`}
                style={{
                  top: `${5 + i * 8}%`,
                  left: `${3 + i * 8}%`,
                }}
              />
            ))}
          </div>

          {/* Header */}
          <div
            className={`relative p-8 bg-gradient-to-r ${statusConfig.gradient} text-white overflow-hidden`}
          >
            <div className="absolute inset-0">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/10 rounded-full" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 rounded-full" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30"
                  >
                    <TestIcon className={`w-10 h-10 ${statusIconColor}`} />
                  </motion.div>
                  <div>
                    <h2 className="text-4xl font-bold drop-shadow-sm">
                      {result.testName}
                    </h2>
                    <p className="text-white/90 text-xl">
                      Order #{result.orderNumber}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedResult(null)}
                  className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all duration-300 border border-white/30"
                >
                  <X className="w-7 h-7" />
                </motion.button>
              </div>

              {/* Critical Alert */}
              {result.isCritical && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center space-x-3 bg-red-500/30 backdrop-blur-sm p-4 rounded-2xl border border-red-300/50"
                >
                  <AlertTriangle className="w-8 h-8 text-red-200" />
                  <div>
                    <p className="text-red-100 font-bold text-lg">
                      Critical Result
                    </p>
                    <p className="text-red-200 text-sm">
                      Please consult your healthcare provider immediately
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="relative p-8 space-y-8 bg-white/95 backdrop-blur-sm max-h-[70vh] overflow-y-auto">
            {/* Result Summary Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border-2 border-emerald-100 text-center">
                <StatusIcon className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <p className="text-sm text-emerald-600 mb-1">Overall Result</p>
                <p className={`font-bold text-2xl ${statusConfig.text}`}>
                  {result.overallResult}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-100 text-center">
                <Calendar className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                <p className="text-sm text-blue-600 mb-1">Sample Collected</p>
                <p className="font-bold text-blue-800 text-lg">
                  {result.sampleCollectedAt
                    ? new Date(result.sampleCollectedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border-2 border-purple-100 text-center">
                <FileText className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                <p className="text-sm text-purple-600 mb-1">Result Generated</p>
                <p className="font-bold text-purple-800 text-lg">
                  {result.resultGeneratedAt
                    ? new Date(result.resultGeneratedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-100 text-center">
                <Shield className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                <p className="text-sm text-amber-600 mb-1">Verification</p>
                <p className="font-bold text-amber-800">
                  {result.isVerified ? "Verified" : "Pending"}
                </p>
              </div>
            </motion.div>

            {/* Interpretation */}
            {result.interpretation && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-sky-50 to-blue-50 p-6 rounded-2xl border-2 border-sky-100"
              >
                <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <Stethoscope className="w-7 h-7 text-blue-600 mr-3" />
                  Clinical Interpretation
                </h3>
                <p className="text-blue-800 text-lg leading-relaxed">
                  {result.interpretation}
                </p>
              </motion.div>
            )}

            {/* Parameters */}
            {result.parameters && result.parameters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Activity className="w-7 h-7 text-purple-500 mr-3" />
                  Test Parameters ({result.parameters.length})
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {result.parameters.map((param, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`p-6 rounded-2xl border-2 backdrop-blur-sm ${
                        param.isAbnormal
                          ? "bg-gradient-to-br from-rose-50 to-red-50 border-rose-200"
                          : "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {param.name}
                        </h4>
                        {param.isAbnormal && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex items-center space-x-1 bg-red-100 px-3 py-1 rounded-full"
                          >
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-semibold text-red-600">
                              Abnormal
                            </span>
                          </motion.div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            Normal Range: {param.normalRange}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Unit: {param.unit}
                          </p>
                        </div>
                        <p
                          className={`text-2xl font-bold ${
                            param.isAbnormal
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {param.value}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Download Report */}
            {result.reportUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center space-x-3 mx-auto"
                >
                  <Download className="w-6 h-6" />
                  <span>Download Full Report</span>
                  <Award className="w-6 h-6" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 text-white"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3825573/pexels-photo-3825573.jpeg"
            alt="Lab Dashboard"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 via-teal-600/90 to-blue-700/90" />
        </div>

        {/* Floating Medical Icons */}
        {[TestTube, FileText, Activity, Package, CheckCircle].map(
          (Icon, index) => (
            <motion.div
              key={index}
              animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute text-white/20"
              style={{
                top: `${20 + index * 15}%`,
                left: `${10 + index * 20}%`,
              }}
            >
              <Icon size={30 + index * 5} />
            </motion.div>
          )
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            {/* Back Button */}
            {onBack && (
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="absolute left-4 top-4 flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300 group"
              >
                <X className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </motion.button>
            )}

            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <FileText className="w-10 h-10 text-white" />
                </div>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
              My Lab
              <span className="block text-yellow-300">Dashboard 🧪</span>
            </h1>

            <p className="text-xl md:text-2xl text-green-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Track your lab orders, view results, and manage your health
              records all in one place.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-center"
              >
                <div className="relative mb-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-blue-400/20 flex items-center justify-center">
                    <Package className="w-10 h-10 text-blue-300" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-blue-300 mb-2">
                  {orders.length}
                </div>
                <div className="text-green-100">Total Orders</div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-center"
              >
                <div className="relative mb-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-green-400/20 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-300" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-green-300 mb-2">
                  {results.length}
                </div>
                <div className="text-green-100">Results Available</div>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-center"
              >
                <div className="relative mb-4">
                  <div className="w-24 h-24 mx-auto rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <Clock className="w-10 h-10 text-yellow-300" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-yellow-300 mb-2">
                  {
                    orders.filter(
                      (o) =>
                        o.status !== "Completed" && o.status !== "Cancelled"
                    ).length
                  }
                </div>
                <div className="text-green-100">Pending Tests</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-2 border border-gray-100">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "orders"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Package className="w-5 h-5" />
                <span>Lab Orders</span>
              </button>
              <button
                onClick={() => setActiveTab("results")}
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "results"
                    ? "bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Test Results</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
            />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
            >
              <option value="all">All Status</option>
              {activeTab === "orders" ? (
                <>
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Sample Collection Scheduled">
                    Sample Collection Scheduled
                  </option>
                  <option value="Sample Collected">Sample Collected</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </>
              ) : (
                <>
                  <option value="Normal">Normal</option>
                  <option value="Abnormal">Abnormal</option>
                  <option value="Critical">Critical</option>
                </>
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
                >
                  <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-4" />
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3" />
                </div>
              ))}
            </motion.div>
          ) : activeTab === "orders" ? (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredOrders.map((order, index) => (
                <CompactOrderCard key={order.id} order={order} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredResults.map((result, index) => (
                <CompactResultCard
                  key={result.id}
                  result={result}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading &&
          ((activeTab === "orders" && filteredOrders.length === 0) ||
            (activeTab === "results" && filteredResults.length === 0)) && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <TestTube className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {activeTab} found
              </h3>
              <p className="text-gray-600">
                {searchQuery || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : `You don't have any ${activeTab} yet`}
              </p>
            </motion.div>
          )}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && <OrderDetailModal order={selectedOrder} />}
      </AnimatePresence>

      {/* Result Detail Modal */}
      <AnimatePresence>
        {selectedResult && <ResultDetailModal result={selectedResult} />}
      </AnimatePresence>

      {/* Payment Modal */}
      {selectedOrder && (
        <LabPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          order={selectedOrder}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
        />
      )}

      {/* Payment Details Modal */}
      <AnimatePresence>
        {showPaymentDetails && paymentDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentDetails(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-green-600 to-cyan-600 text-white p-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPaymentDetails(false)}
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
    </div>
  );
};

export default PatientLabOrders;
