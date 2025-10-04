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
  XCircle,
} from "lucide-react";
import type { LabOrderResponse, LabResultResponse } from "../../types/lab";
import { OrderStatus, PaymentStatus } from "../../Data/enums/lab";
import { paymentService } from "../../Services/payment";
import { LabPaymentModal } from "../Payment/LabPaymentModal";
import { labOrderService, labResultService } from "../../Services/lab";

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

  // Status color and icon functions for orders
  const getOrderStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "from-yellow-500 to-orange-500";
      case OrderStatus.CONFIRMED:
        return "from-blue-500 to-cyan-500";
      case OrderStatus.SAMPLE_COLLECTED:
        return "from-purple-500 to-violet-500";
      case OrderStatus.IN_PROGRESS:
        return "from-indigo-500 to-blue-500";
      case OrderStatus.COMPLETED:
        return "from-green-500 to-emerald-500";
      case OrderStatus.CANCELLED:
        return "from-red-500 to-pink-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return Clock;
      case OrderStatus.CONFIRMED:
        return CheckCircle;
      case OrderStatus.SAMPLE_COLLECTED:
        return Package;
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

  // Status color and icon functions for results
  const getResultStatusColor = (status: string) => {
    const colors = {
      NORMAL: "from-green-500 to-emerald-500",
      ABNORMAL: "from-yellow-500 to-orange-500",
      CRITICAL: "from-red-500 to-pink-500",
      PENDING: "from-yellow-500 to-orange-500",
      COMPLETED: "from-green-500 to-emerald-500",
    };
    return (
      colors[status as keyof typeof colors] || "from-gray-500 to-slate-500"
    );
  };

  const getResultStatusIcon = (status: string) => {
    const icons = {
      NORMAL: CheckCircle,
      ABNORMAL: AlertTriangle,
      CRITICAL: AlertTriangle,
      PENDING: Clock,
      COMPLETED: CheckCircle,
    };
    return icons[status as keyof typeof icons] || FileText;
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
    loadData(); // Refresh data after successful payment
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

  // Compact Order Card Component
  const CompactOrderCard = ({
    order,
    index,
  }: {
    order: LabOrderResponse;
    index: number;
  }) => {
    const StatusIcon = getOrderStatusIcon(order.status);

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden cursor-pointer group"
        onClick={() => setSelectedOrder(order)}
      >
        {/* Header */}
        <div
          className={`p-4 bg-gradient-to-r ${getOrderStatusColor(
            order.status
          )} text-white`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <StatusIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">#{order.orderNumber}</h3>
                <p className="text-white/80 text-xs">
                  {order.orderedTests.length} tests
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm flex items-center">
                <IndianRupee className="w-3 h-3 mr-1" />
                {order.totalAmount}
              </p>
              <p className="text-white/80 text-xs">{order.status}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Date and Location */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(order.scheduledDateTime).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{order.location}</span>
            </div>
          </div>

          {/* Patient Info */}
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <User className="w-3 h-3" />
            <span>{order.patientName}</span>
          </div>

          {/* Payment Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-xs">
              <CreditCard className="w-3 h-3" />
              <span>
                {isPaid(order)
                  ? "Paid"
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
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
              >
                Pay Now
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
                className="px-2 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-1"
              >
                <Eye className="w-3 h-3" />
                <span>Receipt</span>
              </motion.button>
            )}
          </div>

          {/* Tests Preview */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-1">Tests:</p>
            <div className="space-y-1">
              {order.orderedTests.slice(0, 2).map((test) => (
                <div
                  key={test.testId}
                  className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded"
                >
                  {test.testName}
                </div>
              ))}
              {order.orderedTests.length > 2 && (
                <p className="text-xs text-blue-600">
                  +{order.orderedTests.length - 2} more tests
                </p>
              )}
            </div>
          </div>
        </div>
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
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4 + index,
                repeat: Number.POSITIVE_INFINITY,
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
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
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
                        o.status !== "COMPLETED" && o.status !== "CANCELLED"
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
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="SAMPLE_COLLECTED">Sample Collected</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </>
              ) : (
                <>
                  <option value="NORMAL">Normal</option>
                  <option value="ABNORMAL">Abnormal</option>
                  <option value="CRITICAL">Critical</option>
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
                  <div className="h-32 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
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
              {filteredResults.map((result, index) => {
                const StatusIcon = getResultStatusIcon(result.overallResult);
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedResult(result)}
                  >
                    {/* Header */}
                    <div
                      className={`p-4 bg-gradient-to-r ${getResultStatusColor(
                        result.overallResult
                      )} text-white`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <StatusIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">
                              {result.testName}
                            </h3>
                            <p className="text-white/80 text-xs">
                              {result.orderNumber}
                            </p>
                          </div>
                        </div>
                        {result.isCritical && (
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-700">
                          Result:
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            result.overallResult === "NORMAL"
                              ? "bg-green-100 text-green-800"
                              : result.overallResult === "ABNORMAL"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.overallResult}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between text-gray-600">
                          <span>Sample Collected:</span>
                          <span className="font-semibold">
                            {result.sampleCollectedAt
                              ? new Date(
                                  result.sampleCollectedAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-gray-600">
                          <span>Result Date:</span>
                          <span className="font-semibold">
                            {result.resultGeneratedAt
                              ? new Date(
                                  result.resultGeneratedAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      {result.isVerified && (
                        <div className="flex items-center space-x-1 p-2 bg-green-50 rounded-lg">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-800 font-semibold">
                            Verified
                          </span>
                        </div>
                      )}

                      {result.reportUrl && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-3 rounded-xl font-semibold flex items-center justify-center space-x-2 text-xs"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download Report</span>
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
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
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className={`p-6 bg-gradient-to-r ${getOrderStatusColor(
                  selectedOrder.status
                )} text-white`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Order Details</h2>
                    <p className="text-white/80">
                      #{selectedOrder.orderNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold">{selectedOrder.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {selectedOrder.totalAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Date</p>
                    <p className="font-semibold">
                      {new Date(
                        selectedOrder.scheduledDateTime
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Time</p>
                    <p className="font-semibold">
                      {new Date(
                        selectedOrder.scheduledDateTime
                      ).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedOrder.location}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{selectedOrder.patientName}</span>
                </div>

                {/* Payment Information */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Information
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span
                      className={`font-semibold ${
                        isPaid(selectedOrder)
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {isPaid(selectedOrder) ? "Paid" : "Pending"}
                    </span>
                  </div>
                  {isPaymentRequired(selectedOrder) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full mt-3 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Pay Now
                    </motion.button>
                  )}
                  {isPaid(selectedOrder) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => loadPaymentDetails(selectedOrder)}
                      className="w-full mt-3 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Payment Receipt</span>
                    </motion.button>
                  )}
                </div>

                {/* Tests */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Ordered Tests</h3>
                  <div className="space-y-3">
                    {selectedOrder.orderedTests.map((test) => {
                      const TestStatusIcon = getOrderStatusIcon(
                        test.status as OrderStatus
                      );
                      return (
                        <div
                          key={test.testId}
                          className="p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{test.testName}</h4>
                              <p className="text-sm text-gray-600">
                                {test.testCode}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold flex items-center">
                                <IndianRupee className="w-3 h-3 mr-1" />
                                {test.price}
                              </p>
                              <div className="flex items-center space-x-1 mt-1">
                                <TestStatusIcon className="w-3 h-3 text-gray-600" />
                                <span className="text-sm text-gray-600">
                                  {test.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
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

      {/* Result Detail Modal */}
      <AnimatePresence>
        {selectedResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedResult(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className={`p-6 bg-gradient-to-r ${getResultStatusColor(
                  selectedResult.overallResult
                )} text-white`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedResult.testName}
                    </h2>
                    <p className="text-white/80">
                      Order #{selectedResult.orderNumber}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {selectedResult.isCritical && (
                      <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-semibold">Critical</span>
                      </div>
                    )}
                    <button
                      onClick={() => setSelectedResult(null)}
                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Result Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">Overall Result</p>
                    <p
                      className={`text-lg font-bold ${
                        selectedResult.overallResult === "NORMAL"
                          ? "text-green-600"
                          : selectedResult.overallResult === "ABNORMAL"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedResult.overallResult}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">Sample Collected</p>
                    <p className="text-lg font-bold">
                      {selectedResult.sampleCollectedAt
                        ? new Date(
                            selectedResult.sampleCollectedAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">Result Generated</p>
                    <p className="text-lg font-bold">
                      {selectedResult.resultGeneratedAt
                        ? new Date(
                            selectedResult.resultGeneratedAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Interpretation */}
                {selectedResult.interpretation && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 className="font-bold text-blue-900 mb-2">
                      Clinical Interpretation
                    </h3>
                    <p className="text-blue-800">
                      {selectedResult.interpretation}
                    </p>
                  </div>
                )}

                {/* Parameters */}
                {selectedResult.parameters &&
                  selectedResult.parameters.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold mb-4">
                        Test Parameters
                      </h3>
                      <div className="space-y-3">
                        {selectedResult.parameters.map((param, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-xl border ${
                              param.isAbnormal
                                ? "bg-red-50 border-red-200"
                                : "bg-green-50 border-green-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{param.name}</h4>
                                <p className="text-sm text-gray-600">
                                  Normal Range: {param.normalRange}
                                </p>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`text-lg font-bold ${
                                    param.isAbnormal
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {param.value} {param.unit}
                                </p>
                                {param.isAbnormal && (
                                  <div className="flex items-center space-x-1 mt-1">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    <span className="text-sm text-red-600">
                                      Abnormal
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Download Report */}
                {selectedResult.reportUrl && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Full Report</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientLabOrders;
